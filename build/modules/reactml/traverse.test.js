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
    traverse = _functions2.default.traverse,
    normalizeNode = _functions2.default.normalizeNode;


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

    var lines = results.split('\n');
    (0, _chai.expect)(lines[0].trim()).to.equal('<div id={2} key={0}>');
    (0, _chai.expect)(lines[13].trim()).to.equal('<Icon id={7} icon={"+LogoComponent"} key={0}>');
  });

  it("normalize test", function () {
    var spec = _functions2.default.maybeParse(spec2);
    var node = normalizeNode(spec.components.Editor.view);
    // console.log(JSON.stringify(node, null, 2));
  });

  it("react-style traversal2", function () {

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

      return '<' + tag + ' ' + sprops + '>\n  ' + (children || []).join('\n') + '  \n</' + tag + '>\n';
    };

    var treeWalker = traverse(basicRender, tagGetter, propGetter);
    var spec = _functions2.default.maybeParse(spec2);
    var results = treeWalker(normalizeNode(spec.components.Editor.view));
    // console.log(results);

    var lines = results.split('\n');
    (0, _chai.expect)(lines[10].trim()).to.equal('<TextField className={"textField"} label={"Name"} value={"*firstName"} onChange={"@onFirstNameChange"} helperText={"What\'s your name?"} margin={"normal"} key={0}>');
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

var spec2 = '\nstate:\n  initial:\n    user:\n        name: \'bar\'\n        email: \'mynameisbar@example.com\'\n        firstName: \'bar\'\n        lastName: \'Barz\'\n        address:\n            street: \'1234 main street\'\n            city: \'la la land\'\n            zip: \'00000\'\n            state: \'restless\'\n            country: \'somewhere\'\n    status:\n        save: null\n    specError: \'\'\n    todoList:\n      -\n        label: Buy milk\n        done: true\n      -\n        label: Brew coffee\n        done: true\n      -\n        label: mix\n        done: false\n      -\n        label: sip\n        done: false\n  stateNodeName: playground\ncomponents:\n  Footer:\n    view:\n      tag: Paper\n      children:\n        - tag: pre\n          props:\n            style:\n              color: maroon\n              paddingTop: 20px\n          content: "This prototype is rendered from a YML config file. Please see\n          *.yml files in src/containers/Playground folder"\n  TodoList:\n    state-to-props:\n      items: todoList\n    view:\n      tag: div\n      children:\n        - tag: ReactMLArrayMapper\n          props:\n            email: .user.email\n            over: .items\n            as: todo\n            component: ...Todo\n  About:\n    view:\n      tag: div\n      content: "Ain\'t this cool?"\n  ReadOnly:\n    state-to-props:\n      email: user.email\n      firstName: user.firstName\n    view:\n      tag: div\n      children:\n        - tag: h4\n          content: ReactML component name - ReadOnly\n        - tag: div\n          children:\n          - tag: span\n            content: \'Name: \'\n          - tag: span\n            content: .firstName\n        - tag: div\n          children:\n          - tag: span\n            content: \'E-mail: \'\n          - tag: span\n            content: .email\n  Editor:\n    state-to-props:\n      email: user.email\n      firstName: user.firstName\n      saveStatus: status.save\n      yaml: specText\n      onChangeYaml: onChangeYaml\n      yamlError: specError\n      todoList: todoList\n    styles:\n      root: { }\n      email: { }\n      error:\n        color: red\n        fontSize: small\n    dispach-to-props:\n      myAction: someAction\n    view:\n      tag: form\n      props:\n      children:\n        - tag: h4\n          content: ReactML component name - Editor\n        - tag: Grid\n          props:\n            container: true\n          Grid:\n            props: { item: true, xs: 12 }\n            Paper:\n              props:\n                className: .classes.root\n              Grid:\n                props:\n                  container: true\n                children:\n                - tag: Grid\n                  props: { item: true, xs: 4 }\n                  children:\n                  - tag: TextField\n                    props:\n                      className: textField\n                      label: Name\n                      value: .firstName # i.e. props.customerName\n                      onChange: ..onFirstNameChange\n                      helperText: What\'s your name?\n                      margin: normal\n                - tag: Grid\n                  props:\n                    item: true\n                    xs: 8\n                    className: .classes.email\n                  children:\n                  - tag: TextField\n                    props:\n                      label: E-mail\n                      value: .email\n                      helperText: What\'s your email address?\n                      onChange: ..onEmailChange\n                      margin: normal\n                - tag: Grid\n                  props:\n                    item: true\n                    xs: 12\n                  children:\n                  - tag: Button\n                    props:\n                      variant: contained\n                      color: primary\n                      onClick: ..save\n                    children:\n                    - tag: span\n                      content: Save\n                  - tag: Button\n                    props:\n                      color: secondary\n                    #   onClick: myAction\n                    span:\n                      content: cancel\n                  - tag: Status\n                    props:\n                      status: .saveStatus\n                - tag: Grid\n                  props:\n                    item: true\n                    xs: 10\n        - tag: Grid\n          props:\n            item: true\n            xs: 10\n          children:\n            - tag: ReactMLArrayMapper\n              props:\n                over: .todoList\n                as: todo\n                component: ...Todo\n';