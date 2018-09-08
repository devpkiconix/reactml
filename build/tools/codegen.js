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

var _functions = require('../modules/reactml/functions');

var _functions2 = _interopRequireDefault(_functions);

var _normalize = require('../modules/reactml/normalize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var R = require('ramda');

var htmlTags = require('html-tags');
var voidHtmlTags = require('html-tags/void');
var ejs = require("ejs");

var traverse = _functions2.default.traverse;


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
        return name.startsWith('..') && !name.startsWith('...');
    }).map(function (name) {
        return name.substr(2);
    });

    var childLists = (node.children || []).map(function (child) {
        return findActions(child);
    });

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

var codegenTree = function codegenTree(propGetter, _) {
    return function (tree) {
        var tagGetter = function tagGetter(node) {
            return node.tag;
        };

        return traverse(basicRenderCodegen, tagGetter, propGetter)(tree);
    };
};

var basicRenderCodegen = function basicRenderCodegen(tagGetter, propGetter, mappedProps, mappedChildren, node) {
    if ((0, _ramdaAdjunct.isString)(node)) {
        return propGetter(node);
    }
    var tag = tagGetter(node);
    var sprops = '';
    if (mappedProps) {
        sprops = R.mapObjIndexed(function (v, k) {
            return k == 'key' ? '' : k + '=' + v;
        }, mappedProps);
        sprops = R.values(sprops).join(' ');
    }
    var schildren = (mappedChildren || []).join('\n');
    return '\n<' + tag + ' ' + sprops + '>\n' + schildren + '\n</' + tag + '>\n    ';
};

var genComp = function genComp(outputDir) {
    return function (comp, compName) {
        var propGetter = function propGetter(val) {
            if ((0, _ramdaAdjunct.isString)(val) && val.startsWith('.')) {
                val = val.replace(/^\.\.\./, 'TagFactory.').replace(/^\.\./, 'props.').replace(/^\./, 'props.');
            } else {
                val = JSON.stringify(val);
            }
            return '{' + val + '}';
        };
        var reactComponentBody = codegenTree(propGetter)(comp.view);
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
    }, R.values, R.mapObjIndexed(genComp(outputDir)), R.view(componentsLens), BEGIN);
};

var generator = function generator(outputDir) {
    return R.compose(genTail, generateComps(outputDir), genHeader, BEGIN);
};

var processor = function processor(outputDir) {
    return R.compose(generator(outputDir), _normalize.normalizeChildren, parse, readFile, function (x) {
        return console.log(x), x;
    }, BEGIN);
};

exports.default = function (ymlFile) {
    var outputDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./gen";
    return processor(outputDir)(ymlFile);
};