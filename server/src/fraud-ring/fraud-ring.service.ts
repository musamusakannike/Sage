import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GraphNode, GraphNodeDocument } from './schemas/graph-node.schema';
import { GraphEdge, GraphEdgeDocument } from './schemas/graph-edge.schema';
import { NodeType, RingConfidence } from '../common/enums';
import { TransactionsService } from '../transactions/transactions.service';

export interface GraphData {
  nodes: GraphNodeDocument[];
  edges: GraphEdgeDocument[];
  ringConfidence: RingConfidence;
  convergenceCount: number;
}

@Injectable()
export class FraudRingService {
  constructor(
    @InjectModel(GraphNode.name)
    private nodeModel: Model<GraphNodeDocument>,
    @InjectModel(GraphEdge.name)
    private edgeModel: Model<GraphEdgeDocument>,
    private transactionsService: TransactionsService,
  ) {}

  async buildGraph(orgId: string, cycle?: string): Promise<void> {
    const convergences = await this.transactionsService.detectConvergingDestinations(
      orgId,
      cycle,
    );

    const currentCycle = cycle ?? new Date().toISOString().slice(0, 7);

    for (const convergence of convergences) {
      let destNode = await this.nodeModel.findOne({
        orgId: new Types.ObjectId(orgId),
        cycle: currentCycle,
        accountNumber: convergence.destination,
      });

      if (!destNode) {
        const nodeType =
          convergence.count >= 3 ? NodeType.CONTROLLER : NodeType.DESTINATION;
        destNode = await this.nodeModel.create({
          orgId: new Types.ObjectId(orgId),
          cycle: currentCycle,
          type: nodeType,
          label:
            nodeType === NodeType.CONTROLLER
              ? 'SUSPECTED CONTROLLER'
              : `****${convergence.destination.slice(-4)}`,
          accountNumber: convergence.destination,
        });
      }

      for (const employeeId of convergence.employeeIds) {
        let empNode = await this.nodeModel.findOne({
          orgId: new Types.ObjectId(orgId),
          cycle: currentCycle,
          employeeId: new Types.ObjectId(employeeId),
          type: NodeType.EMPLOYEE,
        });

        if (!empNode) {
          empNode = await this.nodeModel.create({
            orgId: new Types.ObjectId(orgId),
            cycle: currentCycle,
            type: NodeType.EMPLOYEE,
            label: employeeId,
            employeeId: new Types.ObjectId(employeeId),
          });
        }

        const edgeExists = await this.edgeModel.findOne({
          orgId: new Types.ObjectId(orgId),
          cycle: currentCycle,
          sourceNodeId: empNode._id,
          targetNodeId: destNode._id,
        });

        if (!edgeExists) {
          await this.edgeModel.create({
            orgId: new Types.ObjectId(orgId),
            cycle: currentCycle,
            sourceNodeId: empNode._id,
            targetNodeId: destNode._id,
            amount: 0,
            timestamp: new Date(),
          });
        }
      }
    }
  }

  async getGraph(orgId: string, cycle?: string): Promise<GraphData> {
    const currentCycle = cycle ?? new Date().toISOString().slice(0, 7);
    const filter = {
      orgId: new Types.ObjectId(orgId),
      cycle: currentCycle,
    };

    const [nodes, edges] = await Promise.all([
      this.nodeModel.find(filter).lean().exec(),
      this.edgeModel.find(filter).lean().exec(),
    ]);

    const convergenceCount = nodes.filter(
      (n) => n.type === NodeType.CONTROLLER,
    ).length;

    const ringConfidence = this.computeRingConfidence(
      convergenceCount,
      nodes.length,
    );

    return {
      nodes: nodes as GraphNodeDocument[],
      edges: edges as GraphEdgeDocument[],
      ringConfidence,
      convergenceCount,
    };
  }

  async getNodeDetail(nodeId: string, orgId: string) {
    const node = await this.nodeModel
      .findOne({
        _id: new Types.ObjectId(nodeId),
        orgId: new Types.ObjectId(orgId),
      })
      .lean()
      .exec();

    const edges = await this.edgeModel
      .find({
        orgId: new Types.ObjectId(orgId),
        $or: [
          { sourceNodeId: new Types.ObjectId(nodeId) },
          { targetNodeId: new Types.ObjectId(nodeId) },
        ],
      })
      .populate('sourceNodeId targetNodeId')
      .lean()
      .exec();

    const totalInflow = edges
      .filter((e) => e.targetNodeId.toString() === nodeId)
      .reduce((sum, e) => sum + e.amount, 0);

    const totalOutflow = edges
      .filter((e) => e.sourceNodeId.toString() === nodeId)
      .reduce((sum, e) => sum + e.amount, 0);

    return { node, edges, totalInflow, totalOutflow };
  }

  private computeRingConfidence(
    convergenceCount: number,
    nodeCount: number,
  ): RingConfidence {
    if (convergenceCount === 0) return RingConfidence.LOW;
    const ratio = convergenceCount / Math.max(nodeCount, 1);
    if (ratio >= 0.3 || convergenceCount >= 3) return RingConfidence.HIGH;
    if (ratio >= 0.1 || convergenceCount >= 2) return RingConfidence.MEDIUM;
    return RingConfidence.LOW;
  }
}
