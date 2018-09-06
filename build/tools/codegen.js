'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _ramdaAdjunct = require('ramda-adjunct');

var _prettier = require('prettier');

var _prettier2 = _interopRequireDefault(_prettier);

var _normalize = require('../modules/reactml/normalize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var R = require('ramda');

var htmlTags = require('html-tags');
var voidHtmlTags = require('html-tags/void');
var ejs = require("ejs");

var TEMPLATE_DIR = process.env.TEMPLATE_DIR || 'node_modules/reactml/templates';
var VIEW_TEMPLATE_FILENAME = TEMPLATE_DIR + '/view.jsx.ejs';

var stdTags = [].concat(_toConsumableArray(htmlTags), _toConsumableArray(voidHtmlTags));

var BEGIN = R.identity,
    END = R.identity;
var dbgDump = console.log;
var prettify = function prettify(code) {
    return _prettier2.default.format(code, { semi: true, parser: "babylon" });
};

var componentsLens = R.lensProp('components');

var readFile = function readFile(fn) {
    return (0, _fs.readFileSync)(fn);
};
var parse = function parse(x) {
    return _jsYaml2.default.safeLoad(x);
};
var toString = function toString(x) {
    return _jsYaml2.default.safeDump(x, 2);
};

var genTail = function genTail(x) {
    return x;
};
var genHeader = function genHeader(x) {
    return x;
};

var reactifyProps = function reactifyProps(props) {
    return Object.keys(props).reduce(function (code, key) {
        var value = props[key];
        if ((0, _ramdaAdjunct.isString)(value)) {
            if (value.startsWith('...')) {
                value = value.substr(3);
            } else if (value.startsWith('.')) {
                value = value.replace(/^\.*(.*)$/g, 'props.$1');
            } else {
                value = JSON.stringify(value, null, 2);
            }
        } else {
            value = JSON.stringify(value, null, 2);
        }
        return code + '\n        ' + key + '={' + value + '}';
    }, '');
};

var genNode = function genNode(node) {
    var props = reactifyProps(node.props || {}).trim();
    if (props.length) {
        props = ' ' + props;
    }
    var head = '<' + node.tag + props + '>';
    var body = void 0;
    if (node.content) {
        if (node.content.startsWith('.')) {
            body = node.content.replace(/^\.*(.*)$/g, '{props.$1}');
        } else {
            body = node.content;
        }
    } else {
        body = genChildren(node) || '';
    }
    var tail = '</' + node.tag + '>';
    return head.trim() + '\n' + body.trim() + '\n' + tail.trim() + '\n';
};

var genChildren = function genChildren(node) {
    if (!node.children) {
        return [''];
    }
    return node.children.map(genNode).join('\n');
};

var reduce2TagList = function reduce2TagList(node) {
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return node.children.reduce(function (list, child) {
        list[child.tag] = child.tag;
        return reduce2TagList(child, list);
    }, list);
};

var reduceState2Props = function reduceState2Props(s2p) {
    return Object.keys(s2p).reduce(function (code, key) {
        return code + (key + ': compState.getIn(' + JSON.stringify(s2p[key].split('.')) + '),');
    }, '');
};

var findActions = function findActions(node) {
    var myList = Object.keys(node.props || {}).map(function (k) {
        return node.props[k];
    }).filter(_ramdaAdjunct.isString).filter(function (name) {
        return name.startsWith('..');
    }).map(function (name) {
        return name.substr(2);
    });
    // console.log('myList', myList);
    // console.log((node.children || []).map(child => child.props));
    var childLists = (node.children || []).map(function (child) {
        return findActions(child);
    });
    // console.log('child lists:', R.flatten(childLists));
    return myList.concat(R.flatten(childLists));
};

var genTagImport = function genTagImport(comp) {
    return new Promise(function (resolve, reject) {
        var tagList = reduce2TagList(comp.view);
        var tagNames = R.keys(R.omit(stdTags, tagList)).join(',');
        resolve(tagNames.length ? '\nimport TagFactory from \'./tag-factory\';\nconst { ' + tagNames + ' } = TagFactory;\n        ' : '');
    });
};

var ejsGen = function ejsGen(fileName, context) {
    return new Promise(function (resolve, reject) {
        ejs.renderFile(fileName, context, function (err, output) {
            if (err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
};

var genComp = function genComp(outputDir) {
    return function (comp, compName) {
        var reactComponentBody = genNode(comp.view);
        var mapStateToProps = '{}';
        if (comp['state-to-props']) {
            mapStateToProps = '{' + reduceState2Props(comp['state-to-props']) + '}';
        }
        var actionArr = findActions(comp.view);
        var mapActionsToProps = 'null';
        if (actionArr.length) {
            mapActionsToProps = '{\n                ' + actionArr.map(function (action) {
                return action + ': lib.' + action;
            }).join(',') + '\n                }';
        }
        return genTagImport(comp).then(function (tagImport) {
            var context = {
                tagImport: tagImport, compName: compName, reactComponentBody: reactComponentBody, mapStateToProps: mapStateToProps, mapActionsToProps: mapActionsToProps
            };
            return ejsGen(VIEW_TEMPLATE_FILENAME, context).then(function (code) {
                return prettify(code);
            }).then(function (code) {
                return (0, _fs.writeFileSync)(outputDir + '/' + compName + '.jsx', code);
            });
        });
    };
};

var generateComps = function generateComps(outputDir) {
    return R.compose(function (proms) {
        return Promise.all(proms);
    }, R.values, R.mapObjIndexed(genComp(outputDir)), R.view(componentsLens),
    // dbgDump,
    BEGIN);
};

var generator = function generator(outputDir) {
    return R.compose(genTail, generateComps(outputDir), genHeader, BEGIN);
};

var processor = function processor(outputDir) {
    return R.compose(generator(outputDir),
    // toString,
    _normalize.normalizeChildren, parse, readFile, function (x) {
        return console.log(x), x;
    }, BEGIN);
};

exports.default = function (ymlFile) {
    var outputDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./gen";

    debugger;
    processor(outputDir)(ymlFile);
};

// processor(fileName);