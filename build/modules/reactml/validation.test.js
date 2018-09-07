'use strict';

var _chai = require('chai');

var _immutable = require('immutable');

var _reduxTestkit = require('redux-testkit');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chai = require('chai');
var chaiImmutable = require('chai-immutable');

chai.use(chaiImmutable);

describe('validation', function () {
    it("verify components exist", function () {
        var spec = {};
        var results = (0, _validate2.default)(spec);
        (0, _chai.expect)(results).to.be.an('object');
        (0, _chai.expect)(results.errors).to.be.an('array');
        (0, _chai.expect)(results.errors.length).to.equal(1);
        (0, _chai.expect)(results.errors[0].name).to.equal('components');
    });
    it("verify components is not an array", function () {
        var spec = {
            state: {},
            stateNodeName: null,
            components: []
        };
        var results = (0, _validate2.default)(spec);
        (0, _chai.expect)(results).to.be.an('object');
        (0, _chai.expect)(results.errors).to.be.an('array');
        (0, _chai.expect)(results.errors.length).to.equal(1);
        (0, _chai.expect)(results.errors[0].name).to.equal('components');
    });
    it("verify nested ", function () {
        var spec = {
            state: {},
            stateNodeName: null,
            components: {
                homepage: {
                    view: {
                        tag: 'div',
                        children: [{ tag: 'span', content: 'hello', children: [] }, {
                            tag: 'span', children: [{ tag: 'span', content: 'world' }]
                        }]
                    }
                }
            }
        };
        var results = (0, _validate2.default)(spec);
        (0, _chai.expect)(results).to.be.an('object');
        (0, _chai.expect)(results.errors).to.equal(null);
    });

    it("reject components with no view node", function () {
        var spec = {
            state: {
                stateNodeName: 'simple'
            },
            components: {
                page1: {
                    tag: 'div',
                    children: [{ tag: 'span', content: 'hello world' }]
                }
            }
        };
        var results = (0, _validate2.default)(spec);
        (0, _chai.expect)(results).to.be.an('object');
        (0, _chai.expect)(results.errors).to.be.an('array');
        (0, _chai.expect)(results.errors.length).to.equal(1);
    });
    it("reject nodes with both content and children ", function () {
        var spec = {
            state: {},
            stateNodeName: null,
            components: {
                homepage: {
                    view: {
                        tag: 'div',
                        children: [{
                            tag: 'span', content: 'hello', children: [{ tag: 'span', content: 'world' }]
                        }, {
                            tag: 'span',
                            content: 'something',
                            children: [{ tag: 'span', content: 'world' }]
                        }]
                    }
                },
                dashboard: {
                    view: {
                        tag: 'div',
                        children: [{
                            tag: 'span', content: 'hello', children: [{ tag: 'span', content: 'world' }]
                        }, {
                            tag: 'span',
                            content: 'something',
                            children: [{ tag: 'span', content: 'world' }]
                        }]
                    }
                }
            }
        };
        var results = (0, _validate2.default)(spec);
        (0, _chai.expect)(results).to.be.an('object');
        (0, _chai.expect)(results.errors).to.be.an('array');
        (0, _chai.expect)(results.errors.length).to.equal(4);
    });
});