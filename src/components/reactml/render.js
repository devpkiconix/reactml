import React from 'react';
import {
    __, curry, path as pathGet, map as RMap, pipe,
} from 'ramda';
import { isString } from 'ramda-adjunct';

import { fromYaml } from '../../modules/reactml/util';

import { normalizeNode } from '../../modules/reactml/normalize';
import functions from '../../modules/reactml/functions';
const {
    maybeParse, mapNode2Tag, mapPropName2Value, renderTree,
} = functions;

const render = (_deps) => (rootProps) => {
    // console.log("rootProps", rootProps)
    const
        { tagFactory, root } = rootProps,
        tagGetter = mapNode2Tag(tagFactory),
        propGetter = mapPropName2Value(tagGetter, rootProps),

        pipeline = pipe(
            maybeParse,
            // (node) => { console.log("normalzing component", node); return node; },
            normalizeNode,
            renderTree(propGetter, tagFactory)
        );

    return pipeline(root);
}

export default { render };
