"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _index = _interopRequireDefault(require("./routes/index"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// app.js
// load in the environment vars
_dotenv["default"].config({
  silent: true
});

var app = (0, _express["default"])();
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public'))); // enable CORS for all routes and for our specific API-Key header

app.use(function (req, res, next) {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,POST');
  res.append('Access-Control-Allow-Headers', 'Content-Type, API-Key');
  next();
}); // PROTECT ALL ROUTES THAT FOLLOW

app.use(function (req, res, next) {
  var apiKey = req.get('API-Key');

  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({
      error: 'unauthorised'
    });
  } else {
    next();
  }
});
app.use('/cowin/cert/veryfy/', _index["default"]);
var _default = app;
exports["default"] = _default;