import { isArray } from 'ramda-adjunct';
import S from 'sanctuary';
import {
    omit, keys,
    compose, curry,
    map as RMap,
    identity
} from 'ramda';

const BEGIN = identity;

export default (spec) => {
    let errors = [];
    validateCompTree(errors)(spec);
    if (errors.length == 0) {
        errors = null;
    }

    return { errors };
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
const checkCompsType = curry((errors, container) => {
    let compsVal = container.value;
    if (isArray(compsVal)) {
        errors.push({
            name: 'components', msg: 'must NOT be an array',
        });
    }
    return container;
});

const checkCompsExistence = curry((errors, container) => {
    if (container.value.isNothing) {
        errors.push({
            name: 'components', msg: 'REQUIRED',
        });
        return S.Left(S.Nothing);
    }
    return container;
});

const validateComp = (errors) => compose(
    validateNode(errors, ["components", "view"]),
    propGet('view'),
    BEGIN
);

const validateCompTree = (errors) => compose(
    // (comps) => comps ? RMap(validateComp(errors), comps) : comps,
    S.map(validateComp(errors)),
    (wrapper) => wrapper.value,
    checkCompsType(errors),
    checkCompsExistence(errors),
    // componentsGet
    propGet("components")
);

const checkExistenceOfBothContentAndChildren = curry((errors, path, node) => {
    if (node.content) {
        if (node.children && node.children.length) {
            errors.push({ path, msg: "Cant have both content and children" });
        }
    }
    return node;
});

const checkSingleChildTag = curry((errors, path, node) => {
    let children = propGet('children', node);
    const allowedProps = ['props', 'children', 'content', 'tag',];
    const sansAllowed = omit(allowedProps, node);
    const keyNames = keys(sansAllowed);
    if (children.length == 0) {
        if (keyNames.length == 1) {
            node.children = [sansAllowed];
        } else if (keyNames.length > 1) {
            errors.push({
                path,
                msg: `Children must be in 'children' array ${keyNames.join(',')}`,
            })
        }
    }
    return node;
});

const validateNode = curry((errors, parentPath, container) => {
    if (container.isLeft) {
        errors.push({ path: parentPath, msg: `Invalid spec, missing 'view' specification` });
        return container;
    }
    const node = container.value;
    if (!node || node.isNothing) {
        return node;
    }
    const myPath = nodePath(node, parentPath);

    const verify = compose(
        // S.map(validateNode(errors, myPath)),
        (children_) => {
            let children = children_.value;
            if (children_.isLeft) {
                return;
            }
            (children || []).map(child => {
                validateNode(errors, myPath, S.Just(child));
            })
        },
        propGet('children'),
        checkSingleChildTag(errors, myPath),
        checkExistenceOfBothContentAndChildren(errors, myPath)
    );
    verify(node);
    return node;
});

const nodePath = (node, parentPath) => parentPath + " > " + node.tag;
const propGet = curry((name, obj) =>
    (name && obj && obj[name]) ? S.Right(obj[name]) : S.Left(S.Nothing));
