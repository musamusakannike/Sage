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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphEdgeSchema = exports.GraphEdge = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let GraphEdge = class GraphEdge {
    orgId;
    cycle;
    sourceNodeId;
    targetNodeId;
    amount;
    timestamp;
};
exports.GraphEdge = GraphEdge;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GraphEdge.prototype, "orgId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    __metadata("design:type", String)
], GraphEdge.prototype, "cycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'GraphNode' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GraphEdge.prototype, "sourceNodeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'GraphNode' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GraphEdge.prototype, "targetNodeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], GraphEdge.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], GraphEdge.prototype, "timestamp", void 0);
exports.GraphEdge = GraphEdge = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'graph_edges' })
], GraphEdge);
exports.GraphEdgeSchema = mongoose_1.SchemaFactory.createForClass(GraphEdge);
exports.GraphEdgeSchema.index({ orgId: 1, cycle: 1 });
//# sourceMappingURL=graph-edge.schema.js.map