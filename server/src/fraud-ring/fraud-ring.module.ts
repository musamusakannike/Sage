import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FraudRingController } from './fraud-ring.controller';
import { FraudRingService } from './fraud-ring.service';
import { GraphNode, GraphNodeSchema } from './schemas/graph-node.schema';
import { GraphEdge, GraphEdgeSchema } from './schemas/graph-edge.schema';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GraphNode.name, schema: GraphNodeSchema },
      { name: GraphEdge.name, schema: GraphEdgeSchema },
    ]),
    TransactionsModule,
  ],
  controllers: [FraudRingController],
  providers: [FraudRingService],
  exports: [FraudRingService],
})
export class FraudRingModule {}
