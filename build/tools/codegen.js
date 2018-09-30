'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.codegenJsWebbpack = exports.codegenJs = exports.codegenJson = exports.codegenYaml = undefined;

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
var parseYaml = function parseYaml(x) {
    return _jsYaml2.default.safeLoad(x);
};
var parseJson = function parseJson(x) {
    return JSON.parse(x);
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

var TRIPLE_DOT = '...';

var write = function write(fileName) {
    return function (content) {
        return (0, _fs.writeFileSync)(fileName, content);
    };
};

var prettyWrite = function prettyWrite(writer) {
    return R.compose(writer, prettify);
};

var reduce2TagList = function reduce2TagList(node) {
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var tagsInProps = R.keys(node.props || {}).forEach(function (name) {
        var val = node.props[name];
        if ((0, _ramdaAdjunct.isString)(val) && val.startsWith(TRIPLE_DOT)) {
            var tag = val.replace(TRIPLE_DOT, '');
            list[tag] = tag;
        }
    });
    return node.children.reduce(function (list, child) {
        list[child.tag] = child.tag;

        return reduce2TagList(child, list);
    }, list);
};

var reduceState2Props = function reduceState2Props(s2p) {
    return Object.keys(s2p).sort().reduce(function (code, key) {
        return code + (key + ': compState.getIn(' + JSON.stringify(s2p[key].split('.')) + '),');
    }, '');
};

var defaultToEmptyObj = R.defaultTo({});
var defaultToEmptyArr = R.defaultTo([]);

var node2ActionProps = R.compose(R.map(function (name) {
    return name.substr(2);
}), R.filter(function (name) {
    return name.startsWith('..') && !name.startsWith(TRIPLE_DOT);
}), R.filter(_ramdaAdjunct.isString), R.values, defaultToEmptyObj(R.prop('props')), BEGIN);

var findChildActions = R.compose(R.flatten, R.map(function (child) {
    return findActions(child);
}), defaultToEmptyArr(R.prop('children')), BEGIN);

var arrOfOne = R.repeat(R.__, 1);

var findActions = R.compose(R.flatten, R.ap([node2ActionProps, findChildActions]), arrOfOne, BEGIN);

var comp2tags = R.compose(R.keys, R.omit(stdTags), reduce2TagList, R.prop('view'), BEGIN);

var sort = R.sort(function (a, b) {
    return a > b;
});

var comp2foreignTags = function comp2foreignTags(oComps) {
    return R.compose(R.join(','), sort, R.filter(function (x) {
        return !oComps[x];
    }), comp2tags, BEGIN);
};

var comp2localTagCode = function comp2localTagCode(oComps) {
    return R.compose(R.join('\n'), R.map(function (tag) {
        return 'import ' + tag + ' from \'./' + tag + '\';';
    }), sort, R.filter(function (x) {
        return !!oComps[x];
    }), comp2tags, BEGIN);
};

var genTagImport = function genTagImport(comp, compName, oComps) {
    return new Promise(function (resolve, reject) {

        var foreignTags = comp2foreignTags(oComps)(comp);
        var foreignTagCode = foreignTags.length ? '\nimport TagFactory from \'../tag-factory\';\nconst { ' + foreignTags + ' } = TagFactory;\n        ' : '';

        var localTagCode = comp2localTagCode(oComps)(comp);
        resolve(foreignTagCode + '\n' + localTagCode);
    });
};

var ejsGen = function ejsGen(fileName, context) {
    return new Promise(function (resolve, reject) {
        return ejs.renderFile(fileName, context, function (err, output) {
            return err ? reject(err) : resolve(output);
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

var removeCond = R.omit(['$when']);

var basicRenderCodegen = function basicRenderCodegen(tagGetter, propGetter, mappedProps, mappedChildren, node) {
    if ((0, _ramdaAdjunct.isString)(node)) {
        return propGetter(node);
    }
    var tag = tagGetter(node);
    var sprops = '';
    if (mappedProps) {
        sprops = R.mapObjIndexed(function (v, k) {
            return k == 'key' ? '' : k + '=' + v;
        }, removeCond(mappedProps));
        sprops = R.values(sprops).join(' ');
    }
    var schildren = (mappedChildren || []).join('\n');

    var mainCode = '<' + tag + ' ' + sprops + '>\n' + schildren + '\n</' + tag + '>';

    if (mappedProps.$when) {
        var $when = node.props.$when;
        var cond = '(' + node.props.$when + ')';
        var conditionalCode = '{' + cond + ' ? (' + mainCode + ') : \'\'}';
        return conditionalCode;
    }

    return mainCode;
};

var genComp = function genComp(writer) {
    return function (comp, compName, oComps) {
        var propGetter = function propGetter(val) {
            if ((0, _ramdaAdjunct.isString)(val)) {
                if (val.startsWith(TRIPLE_DOT)) {
                    val = val.replace(/^\.\.\./, '');
                    if (!oComps[val]) {
                        val = 'TagFactory.' + val;
                    }
                } else if (val.startsWith('.')) {
                    val = val.replace(/^\.\.\./, 'TagFactory.').replace(/^\.\./, 'props.').replace(/^\./, 'props.');
                } else {
                    val = JSON.stringify(val);
                }
            } else {
                val = JSON.stringify(val);
            }
            return '{' + val + '}';
        };
        var reactComponentBody = codegenTree(propGetter)(comp.view);
        var mapStateToProps = null;
        var mapStateToPropsList = '';
        if (comp['state-to-props']) {
            mapStateToPropsList = '' + reduceState2Props(comp['state-to-props']);
        }
        if (mapStateToPropsList.length) {
            mapStateToProps = '{' + mapStateToPropsList + '}';
        }

        var actionArr = findActions(comp.view).sort();
        var mapActionsToProps = 'null';
        if (actionArr.length) {
            mapActionsToProps = '{\n                ' + actionArr.map(function (action) {
                return action + ': lib.' + action;
            }).join(',') + '\n                }';
        }
        return genTagImport(comp, compName, oComps).then(function (tagImport) {
            var context = {
                tagImport: tagImport, compName: compName, reactComponentBody: reactComponentBody,
                mapStateToProps: mapStateToProps, mapActionsToProps: mapActionsToProps
            };
            return ejsGen(VIEW_TEMPLATE_FILENAME, context).then(prettyWrite(writer(context.compName)));
        });
    };
};

var generateComps = function generateComps(writer) {
    return R.compose(function (proms) {
        return Promise.all(proms);
    }, R.values, R.mapObjIndexed(genComp(writer)), R.view(componentsLens), BEGIN);
};

var generator = function generator(writer) {
    return R.compose(genTail, generateComps(writer), genHeader, BEGIN);
};

var processParsed = function processParsed(writer) {
    return R.compose(generator(writer), _normalize.normalizeChildren, BEGIN);
};

var processor = function processor(parse, writer) {
    return R.compose(processParsed(writer), parse, readFile, BEGIN);
};

var writeComponent = function writeComponent(outputDir) {
    return function (compName) {
        return write(outputDir + '/' + compName + '.jsx');
    };
};

var codegenYaml = exports.codegenYaml = function codegenYaml(srcFileName) {
    var outputDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./gen";
    return processor(parseYaml, writeComponent(outputDir))(srcFileName);
};

var codegenJson = exports.codegenJson = function codegenJson(srcFileName) {
    var outputDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./gen";
    return processor(parseJson, writeComponent(outputDir))(srcFileName);
};

var codegenJs = exports.codegenJs = function codegenJs(spec) {
    var outputDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./gen";
    return processParsed(writeComponent(outputDir))(spec);
};

var codegenJsWebbpack = exports.codegenJsWebbpack = function codegenJsWebbpack(yaml) {
    var _this = this;

    var writer = function writer(compName) {
        return function (content) {
            _this.emitFile(compName + '.jsx', content);
        };
    };
    processParsed(writer)(spec);
    return;
};