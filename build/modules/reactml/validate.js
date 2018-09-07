'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramdaAdjunct = require('ramda-adjunct');

var _sanctuary = require('sanctuary');

var _sanctuary2 = _interopRequireDefault(_sanctuary);

var _ramda = require('ramda');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BEGIN = _ramda.identity;

exports.default = function (spec) {
    var errors = [];
    validateCompTree(errors)(spec);
    if (errors.length == 0) {
        errors = null;
    }

    return { errors: errors };
};

//////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------/
//--------------------------// Private functions //--------------------------/
//---------------------------------------------------------------------------/
//////////////////////////////////////////////////////////////////////////////

/**
 * @errors - array to be filled in
 * @container - container wrapper containing 'components' node
 */


var checkCompsType = (0, _ramda.curry)(function (errors, container) {
    var compsVal = container.value;
    if ((0, _ramdaAdjunct.isArray)(compsVal)) {
        errors.push({
            name: 'components', msg: 'must NOT be an array'
        });
    }
    return container;
});

var checkCompsExistence = (0, _ramda.curry)(function (errors, container) {
    if (container.value.isNothing) {
        errors.push({
            name: 'components', msg: 'REQUIRED'
        });
        return _sanctuary2.default.Left(_sanctuary2.default.Nothing);
    }
    return container;
});

var validateComp = function validateComp(errors) {
    return (0, _ramda.compose)(validateNode(errors, ["components", "view"]), propGet('view'), BEGIN);
};

var validateCompTree = function validateCompTree(errors) {
    return (0, _ramda.compose)(
    // (comps) => comps ? RMap(validateComp(errors), comps) : comps,
    _sanctuary2.default.map(validateComp(errors)), function (wrapper) {
        return wrapper.value;
    }, checkCompsType(errors), checkCompsExistence(errors),
    // componentsGet
    propGet("components"));
};

var checkExistenceOfBothContentAndChildren = (0, _ramda.curry)(function (errors, path, node) {
    if (node.content) {
        if (node.children && node.children.length) {
            errors.push({ path: path, msg: "Cant have both content and children" });
        }
    }
    return node;
});

var checkSingleChildTag = (0, _ramda.curry)(function (errors, path, node) {
    var children = propGet('children', node);
    var allowedProps = ['props', 'children', 'content', 'tag'];
    var sansAllowed = (0, _ramda.omit)(allowedProps, node);
    var keyNames = (0, _ramda.keys)(sansAllowed);
    if (children.length == 0) {
        if (keyNames.length == 1) {
            node.children = [sansAllowed];
        } else if (keyNames.length > 1) {
            errors.push({
                path: path,
                msg: 'Children must be in \'children\' array ' + keyNames.join(',')
            });
        }
    }
    return node;
});

var validateNode = (0, _ramda.curry)(function (errors, parentPath, container) {
    if (container.isLeft) {
        errors.push({ path: parentPath, msg: 'Invalid spec, missing \'view\' specification' });
        return container;
    }
    var node = container.value;
    if (!node || node.isNothing) {
        return node;
    }
    var myPath = nodePath(node, parentPath);

    var verify = (0, _ramda.compose)(
    // S.map(validateNode(errors, myPath)),
    function (children_) {
        var children = children_.value;
        if (children_.isLeft) {
            return;
        }
        (children || []).map(function (child) {
            validateNode(errors, myPath, _sanctuary2.default.Just(child));
        });
    }, propGet('children'), checkSingleChildTag(errors, myPath), checkExistenceOfBothContentAndChildren(errors, myPath));
    verify(node);
    return node;
});

var nodePath = function nodePath(node, parentPath) {
    return parentPath + " > " + node.tag;
};
var propGet = (0, _ramda.curry)(function (name, obj) {
    return name && obj && obj[name] ? _sanctuary2.default.Right(obj[name]) : _sanctuary2.default.Left(_sanctuary2.default.Nothing);
});