"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreThreshold = exports.RingConfidence = exports.NodeType = exports.CaseStatus = exports.EmployeeStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["HR_ADMIN"] = "hr_admin";
    UserRole["AUDITOR"] = "auditor";
    UserRole["EMPLOYEE"] = "employee";
})(UserRole || (exports.UserRole = UserRole = {}));
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["CLEAR"] = "CLEAR";
    EmployeeStatus["REVIEW"] = "REVIEW";
    EmployeeStatus["FROZEN"] = "FROZEN";
    EmployeeStatus["PENDING"] = "PENDING";
    EmployeeStatus["FLAGGED"] = "FLAGGED";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["OPEN"] = "OPEN";
    CaseStatus["RESOLVED"] = "RESOLVED";
})(CaseStatus || (exports.CaseStatus = CaseStatus = {}));
var NodeType;
(function (NodeType) {
    NodeType["EMPLOYEE"] = "employee";
    NodeType["DESTINATION"] = "destination";
    NodeType["CONTROLLER"] = "controller";
})(NodeType || (exports.NodeType = NodeType = {}));
var RingConfidence;
(function (RingConfidence) {
    RingConfidence["LOW"] = "LOW";
    RingConfidence["MEDIUM"] = "MEDIUM";
    RingConfidence["HIGH"] = "HIGH";
})(RingConfidence || (exports.RingConfidence = RingConfidence = {}));
var ScoreThreshold;
(function (ScoreThreshold) {
    ScoreThreshold[ScoreThreshold["FREEZE"] = 40] = "FREEZE";
    ScoreThreshold[ScoreThreshold["REVIEW"] = 70] = "REVIEW";
})(ScoreThreshold || (exports.ScoreThreshold = ScoreThreshold = {}));
//# sourceMappingURL=index.js.map