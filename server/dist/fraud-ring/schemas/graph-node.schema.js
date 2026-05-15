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
exports.GraphNodeSchema = exports.GraphNode = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
let GraphNode = class GraphNode {
    orgId;
    cycle;
    type;
    label;
    accountNumber;
    employeeId;
    totalInflow;
    totalOutflow;
};
exports.GraphNode = GraphNode;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GraphNode.prototype, "orgId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, index: true }),
    __metadata("design:type", String)
], GraphNode.prototype, "cycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, enum: Object.values(enums_1.NodeType) }),
    __metadata("design:type", String)
], GraphNode.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], GraphNode.prototype, "label", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], GraphNode.prototype, "accountNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Employee', default: null }),
    __metadata("design:type", Object)
], GraphNode.prototype, "employeeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GraphNode.prototype, "totalInflow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GraphNode.prototype, "totalOutflow", void 0);
exports.GraphNode = GraphNode = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'graph_nodes' })
], GraphNode);
exports.GraphNodeSchema = mongoose_1.SchemaFactory.createForClass(GraphNode);
exports.GraphNodeSchema.index({ orgId: 1, cycle: 1, accountNumber: 1 });
//# sourceMappingURL=graph-node.schema.js.map