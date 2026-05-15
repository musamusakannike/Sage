"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudRingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const graph_node_schema_1 = require("./schemas/graph-node.schema");
const graph_edge_schema_1 = require("./schemas/graph-edge.schema");
const enums_1 = require("../common/enums");
const transactions_service_1 = require("../transactions/transactions.service");
let FraudRingService = class FraudRingService {
    nodeModel;
    edgeModel;
    transactionsService;
    constructor(nodeModel, edgeModel, transactionsService) {
        this.nodeModel = nodeModel;
        this.edgeModel = edgeModel;
        this.transactionsService = transactionsService;
    }
    async buildGraph(orgId, cycle) {
        const convergences = await this.transactionsService.detectConvergingDestinations(orgId, cycle);
        const currentCycle = cycle ?? new Date().toISOString().slice(0, 7);
        for (const convergence of convergences) {
            let destNode = await this.nodeModel.findOne({
                orgId: new mongoose_2.Types.ObjectId(orgId),
                cycle: currentCycle,
                accountNumber: convergence.destination,
            });
            if (!destNode) {
                const nodeType = convergence.count >= 3 ? enums_1.NodeType.CONTROLLER : enums_1.NodeType.DESTINATION;
                destNode = await this.nodeModel.create({
                    orgId: new mongoose_2.Types.ObjectId(orgId),
                    cycle: currentCycle,
                    type: nodeType,
                    label: nodeType === enums_1.NodeType.CONTROLLER
                        ? 'SUSPECTED CONTROLLER'
                        : `****${convergence.destination.slice(-4)}`,
                    accountNumber: convergence.destination,
                });
            }
            for (const employeeId of convergence.employeeIds) {
                let empNode = await this.nodeModel.findOne({
                    orgId: new mongoose_2.Types.ObjectId(orgId),
                    cycle: currentCycle,
                    employeeId: new mongoose_2.Types.ObjectId(employeeId),
                    type: enums_1.NodeType.EMPLOYEE,
                });
                if (!empNode) {
                    empNode = await this.nodeModel.create({
                        orgId: new mongoose_2.Types.ObjectId(orgId),
                        cycle: currentCycle,
                        type: enums_1.NodeType.EMPLOYEE,
                        label: employeeId,
                        employeeId: new mongoose_2.Types.ObjectId(employeeId),
                    });
                }
                const edgeExists = await this.edgeModel.findOne({
                    orgId: new mongoose_2.Types.ObjectId(orgId),
                    cycle: currentCycle,
                    sourceNodeId: empNode._id,
                    targetNodeId: destNode._id,
                });
                if (!edgeExists) {
                    await this.edgeModel.create({
                        orgId: new mongoose_2.Types.ObjectId(orgId),
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
    async getGraph(orgId, cycle) {
        const currentCycle = cycle ?? new Date().toISOString().slice(0, 7);
        const filter = {
            orgId: new mongoose_2.Types.ObjectId(orgId),
            cycle: currentCycle,
        };
        const [nodes, edges] = await Promise.all([
            this.nodeModel.find(filter).lean().exec(),
            this.edgeModel.find(filter).lean().exec(),
        ]);
        const convergenceCount = nodes.filter((n) => n.type === enums_1.NodeType.CONTROLLER).length;
        const ringConfidence = this.computeRingConfidence(convergenceCount, nodes.length);
        return {
            nodes: nodes,
            edges: edges,
            ringConfidence,
            convergenceCount,
        };
    }
    async getNodeDetail(nodeId, orgId) {
        const node = await this.nodeModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(nodeId),
            orgId: new mongoose_2.Types.ObjectId(orgId),
        })
            .lean()
            .exec();
        const edges = await this.edgeModel
            .find({
            orgId: new mongoose_2.Types.ObjectId(orgId),
            $or: [
                { sourceNodeId: new mongoose_2.Types.ObjectId(nodeId) },
                { targetNodeId: new mongoose_2.Types.ObjectId(nodeId) },
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
    computeRingConfidence(convergenceCount, nodeCount) {
        if (convergenceCount === 0)
            return enums_1.RingConfidence.LOW;
        const ratio = convergenceCount / Math.max(nodeCount, 1);
        if (ratio >= 0.3 || convergenceCount >= 3)
            return enums_1.RingConfidence.HIGH;
        if (ratio >= 0.1 || convergenceCount >= 2)
            return enums_1.RingConfidence.MEDIUM;
        return enums_1.RingConfidence.LOW;
    }
};
exports.FraudRingService = FraudRingService;
exports.FraudRingService = FraudRingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(graph_node_schema_1.GraphNode.name)),
    __param(1, (0, mongoose_1.InjectModel)(graph_edge_schema_1.GraphEdge.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        transactions_service_1.TransactionsService])
], FraudRingService);
//# sourceMappingURL=fraud-ring.service.js.map