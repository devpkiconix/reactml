'use strict';

var _ramda = require('ramda');

var _chai = require('chai');

var _functions = require('./functions');

var _functions2 = _interopRequireDefault(_functions);

var _util = require('./util');

var _util2 = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chaiImmutable = require('chai-immutable');

var isLeaf = _functions2.default.isLeaf,
    traverse = _functions2.default.traverse;


describe("tree traversal", function () {
    it("leaf test", function () {
        var spec = sampleSpec;
        var boolRes = isLeaf(spec.components.page1.view.children[0]);
        (0, _chai.expect)(boolRes).to.be.true;
        boolRes = isLeaf(spec.components.page1.view.children[1]);
        (0, _chai.expect)(boolRes).to.be.false;
    });
    it("basic traversal", function () {

        var tagGetter = function tagGetter(node) {
            return node.tag;
        };
        var propGetter = function propGetter(val) {
            if ((0, _util2.isString)(val)) {
                return val.replace(/^\.\.\./, '+').replace(/^\.\./, '@').replace(/^\./, '*');
            }
            return val;
        };
        var basicRender = function basicRender(tagGetter, props, children, node) {
            var tag = tagGetter(node);

            // 'm' for mapped or modified
            return { tag: tag, mprops: props, mchildren: children };
        };

        var treeWalker = traverse(basicRender, tagGetter, propGetter);
        var results = treeWalker(sampleSpec.components.page1.view);
        // console.log(JSON.stringify(results, null, 2));

        var node2 = results;
        (0, _chai.expect)(node2.tag).to.equal('div');
        (0, _chai.expect)(node2.mprops.id).to.equal(2);
        (0, _chai.expect)(node2.mchildren.length).to.equal(3);

        var node3 = node2.mchildren[0];
        (0, _chai.expect)(node3.mprops.id).to.equal(3);
        (0, _chai.expect)(node3.tag).to.equal('span');
        (0, _chai.expect)(node3.mchildren[0]).to.equal('*hello');

        var node4 = node2.mchildren[1];
        (0, _chai.expect)(node4.mprops.id).to.equal(4);

        var node5 = node4.mchildren[0];
        (0, _chai.expect)(node5.mprops.id).to.equal(5);
        (0, _chai.expect)(node5.mchildren[0]).to.equal('*world');

        var node6 = node2.mchildren[2];
        (0, _chai.expect)(node6.mprops.id).to.equal(6);

        var node7 = node6.mchildren[0];
        (0, _chai.expect)(node7.mprops.id).to.equal(7);
        (0, _chai.expect)(node7.mprops.icon).to.equal("+LogoComponent");

        var node8 = node6.mchildren[1];
        (0, _chai.expect)(node8.mprops.id).to.equal(8);
        (0, _chai.expect)(node8.mprops.icon).to.equal("+FloppyIcon");
        (0, _chai.expect)(node8.mprops.onClick).to.equal("@save");
    });

    it("react-style traversal", function () {

        var tagGetter = function tagGetter(node) {
            return node.tag;
        };
        var propGetter = function propGetter(val) {
            if ((0, _util2.isString)(val)) {
                return val.replace(/^\.\.\./, '+').replace(/^\.\./, '@').replace(/^\./, '*');
            }
            return val;
        };
        var basicRender = function basicRender(tagGetter, props, children, node) {
            var tag = tagGetter(node);
            var sprops = '';
            if (props) {
                sprops = (0, _ramda.mapObjIndexed)(function (v, k) {
                    return k + '={' + JSON.stringify(v) + '}';
                }, props);
                sprops = (0, _ramda.values)(sprops).join(" ");
            }

            return '<' + tag + ' ' + sprops + '>\n  ' + children.join('\n') + '  \n</' + tag + '>\n';
        };

        var treeWalker = traverse(basicRender, tagGetter, propGetter);
        var results = treeWalker(sampleSpec.components.page1.view);
        // console.log(results);

        var lines = results.split('\n');
        (0, _chai.expect)(lines[0].trim()).to.equal('<div id={2}>');
        (0, _chai.expect)(lines[13].trim()).to.equal('<Icon id={7} icon={"+LogoComponent"}>');
    });
});

var sampleSpec = {
    state: {
        stateNodeName: 'compstate1'
    },
    components: {
        id: 0,
        page1: {
            id: 1,
            view: {
                tag: 'div',
                props: {
                    id: 2
                },
                children: [{ props: { id: 3 }, tag: 'span', content: '.hello' }, {
                    props: { id: 4 }, tag: 'span', children: [{ props: { id: 5 }, tag: 'span', content: '.world' }]
                }, {
                    props: { id: 6 }, tag: 'div', children: [{ props: { id: 7, icon: '...LogoComponent' }, tag: 'Icon', content: 'foo1' }, { props: { id: 8, onClick: '..save', icon: '...FloppyIcon' }, tag: 'IconButton', content: 'foo2' }, { props: { id: 9 }, tag: 'span', content: 'foo3' }, { props: { id: 10 }, tag: 'span', content: 'foo4' }]
                }]
            }
        }
    }
};