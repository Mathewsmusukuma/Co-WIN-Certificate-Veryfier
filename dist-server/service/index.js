"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axiosInstance = void 0;

var _env = _interopRequireDefault(require("../utils/env.config"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var axiosInstance = function axiosInstance() {
  return _axios["default"].create({
    baseURL: _env["default"][process.env.APP_ENV || "development"].apiBaseUrl,
    headers: {
      "content-type": "application/json"
    }
  });
};

exports.axiosInstance = axiosInstance;