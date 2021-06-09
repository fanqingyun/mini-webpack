(function(modules) {
        function require(id) {
            const [fn, mapping] = modules[id]
            const module = {exports: {} }
            function localRequie(relativePath) { // 由于在文件内，使用import通过文件名称引入，但是我们自定义的require使用的是id，所以使用模块的mapping做一个转换
                return require(mapping[relativePath])
            }
            fn(localRequie, module, module.exports)
            console.log(module.exports)
            return module.exports
        }
        // 入口
        require(0)
    })({0: [function (require, module, exports) {
            "use strict";

var _add = _interopRequireDefault(require("../util/add.js"));

var _minus = _interopRequireDefault(require("./minus.js"));

var _common = _interopRequireDefault(require("../util/common.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _add["default"])(1, 4);
(0, _minus["default"])(6, 8);
(0, _common["default"])('测试');
        }, {"../util/add.js":1,"./minus.js":2,"../util/common.js":3}],1: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = _interopRequireDefault(require("./common.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(a, b) {
  (0, _common["default"])(a + b);
};

exports["default"] = _default;
        }, {"./common.js":4}],2: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = _interopRequireDefault(require("../util/common.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(a, b) {
  (0, _common["default"])(a - b);
};

exports["default"] = _default;
        }, {"../util/common.js":5}],3: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(res) {
  console.log("the result is ".concat(res));
};

exports["default"] = _default;
        }, {}],4: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(res) {
  console.log("the result is ".concat(res));
};

exports["default"] = _default;
        }, {}],5: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(res) {
  console.log("the result is ".concat(res));
};

exports["default"] = _default;
        }, {}],})
