import { expect } from 'chai';
import { Map as ImMap, List as ImList, fromJS } from 'immutable';
import { Reducer } from 'redux-testkit';
import validate from './validate';

const chai = require('chai');
const chaiImmutable = require('chai-immutable');

chai.use(chaiImmutable);

describe('validation', () => {
    it("verify components exist", () => {
        let spec = {};
        const results = validate(spec);
        expect(results).to.be.an('object');
        expect(results.errors).to.be.an('array');
        expect(results.errors.length).to.equal(1);
        expect(results.errors[0].name).to.equal('components');
    });
    it("verify components is not an array", () => {
        let spec = {
            state: {},
            stateNodeName: null,
            components: []
        };
        const results = validate(spec);
        expect(results).to.be.an('object');
        expect(results.errors).to.be.an('array');
        expect(results.errors.length).to.equal(1);
        expect(results.errors[0].name).to.equal('components');
    });
    it("verify nested ", () => {
        let spec = {
            state: {},
            stateNodeName: null,
            components: {
                homepage: {
                    view: {
                        tag: 'div',
                        children: [
                            { tag: 'span', content: 'hello', children: [] },
                            {
                                tag: 'span', children: [
                                    { tag: 'span', content: 'world' }
                                ]
                            }
                        ]
                    }
                }
            }
        };
        const results = validate(spec);
        expect(results).to.be.an('object');
        expect(results.errors).to.equal(null);
    });
    it("reject nodes with both content and children ", () => {
        let spec = {
            state: {},
            stateNodeName: null,
            components: {
                homepage: {
                    view: {
                        tag: 'div',
                        children: [
                            {
                                tag: 'span', content: 'hello', children: [
                                    { tag: 'span', content: 'world' }

                                ]
                            },
                            {
                                tag: 'span',
                                content: 'something',
                                children: [
                                    { tag: 'span', content: 'world' }
                                ]
                            }
                        ]
                    }
                },
                dashboard: {
                    view: {
                        tag: 'div',
                        children: [
                            {
                                tag: 'span', content: 'hello', children: [
                                    { tag: 'span', content: 'world' }

                                ]
                            },
                            {
                                tag: 'span',
                                content: 'something',
                                children: [
                                    { tag: 'span', content: 'world' }
                                ]
                            }
                        ]
                    }
                }
            }
        };
        const results = validate(spec);
        expect(results).to.be.an('object');
        expect(results.errors).to.be.an('array');
        expect(results.errors.length).to.equal(4);
    });

});