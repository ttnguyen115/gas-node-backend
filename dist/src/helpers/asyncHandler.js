"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
function asyncHandler(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
exports.asyncHandler = asyncHandler;
