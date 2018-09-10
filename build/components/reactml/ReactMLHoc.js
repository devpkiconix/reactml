'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _ReactML = require('../../components/reactml/ReactML');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactmlHoc = function ReactmlHoc(spec, actionLib, tagFactory, stateNodeName, view) {
    var View = function (_React$Component) {
        _inherits(View, _React$Component);

        function View() {
            _classCallCheck(this, View);

            return _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).apply(this, arguments));
        }

        _createClass(View, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                if (spec.state.initial) {
                    this.props.dispatch({
                        type: 'REACTML_INIT', initial: _extends({}, spec.state.initial, {
                            spec: spec, actionLib: actionLib, tagFactory: tagFactory,
                            stateNodeName: stateNodeName
                        }),
                        stateNodeName: stateNodeName
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(_ReactML.ReactML, {
                    tagFactory: tagFactory,
                    stateNodeName: stateNodeName,
                    spec: spec, component: view,
                    actionLib: actionLib
                });
            }
        }]);

        return View;
    }(_react2.default.Component);

    var mapStateToProps = function mapStateToProps(state) {
        return {};
    };
    return (0, _reactRedux.connect)(mapStateToProps)(View);
};

exports.default = ReactmlHoc;