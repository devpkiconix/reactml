'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactMLHoc = require('./ReactMLHoc');

var _ReactMLHoc2 = _interopRequireDefault(_ReactMLHoc);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function asyncComponent(getComponent) {
    var Component = null;
    return function (_React$Component) {
        _inherits(AsyncComponent, _React$Component);

        function AsyncComponent(props) {
            _classCallCheck(this, AsyncComponent);

            var _this = _possibleConstructorReturn(this, (AsyncComponent.__proto__ || Object.getPrototypeOf(AsyncComponent)).call(this, props));

            _this.state = { Component: Component };
            return _this;
        }

        _createClass(AsyncComponent, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                var _this2 = this;

                if (!Component) {
                    getComponent().then(function (C) {
                        Component = C;
                        _this2.setState({ Component: Component });
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                if (Component) {
                    return _react2.default.createElement(Component, this.props);
                }
                return null;
            }
        }]);

        return AsyncComponent;
    }(_react2.default.Component);
}

var ReactMLRoutes = function ReactMLRoutes(props) {
    if (!props.tagFactory) {
        return _react2.default.createElement(
            'div',
            null,
            ' loading.. '
        );
    }
    var routes = props.routes,
        tagFactory = props.tagFactory,
        actionLib = props.actionLib,
        stateNodeName = props.stateNodeName,
        spec = props.spec;

    var getAsyncComponent = function getAsyncComponent(name) {
        return function () {
            var Component = (0, _ReactMLHoc2.default)(spec, actionLib, tagFactory, 'playground', name);
            return Promise.resolve(Component);
        };
    };

    var makeRoute = function makeRoute(path, i) {
        var componentName = props[path];
        var component = asyncComponent(getAsyncComponent(componentName));
        return _react2.default.createElement(_reactRouterDom.Route, { key: i, exact: true, path: path,
            component: component });
    };

    return _react2.default.createElement(
        'main',
        null,
        Object.keys(routes).map(makeRoute)
    );
};

exports.default = ReactMLRoutes;