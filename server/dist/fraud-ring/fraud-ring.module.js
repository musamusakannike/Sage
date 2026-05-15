"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudRingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const fraud_ring_controller_1 = require("./fraud-ring.controller");
const fraud_ring_service_1 = require("./fraud-ring.service");
const graph_node_schema_1 = require("./schemas/graph-node.schema");
const graph_edge_schema_1 = require("./schemas/graph-edge.schema");
const transactions_module_1 = require("../transactions/transactions.module");
let FraudRingModule = class FraudRingModule {
};
exports.FraudRingModule = FraudRingModule;
exports.FraudRingModule = FraudRingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: graph_node_schema_1.GraphNode.name, schema: graph_node_schema_1.GraphNodeSchema },
                { name: graph_edge_schema_1.GraphEdge.name, schema: graph_edge_schema_1.GraphEdgeSchema },
            ]),
            transactions_module_1.TransactionsModule,
        ],
        controllers: [fraud_ring_controller_1.FraudRingController],
        providers: [fraud_ring_service_1.FraudRingService],
        exports: [fraud_ring_service_1.FraudRingService],
    })
], FraudRingModule);
//# sourceMappingURL=fraud-ring.module.js.map