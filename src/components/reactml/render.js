import { pipe, } from 'ramda';

import { normalizeNode } from '../../modules/reactml/normalize';
import functions from '../../modules/reactml/functions';
const {
    mapNode2Tag, mapPropName2Value, renderTree,
} = functions;

const render = (_deps) => (rootProps) => {
    const
        { tagFactory, root } = rootProps,
        tagGetter = mapNode2Tag(tagFactory),
        propGetter = mapPropName2Value(tagGetter, rootProps),

        pipeline = pipe(
            normalizeNode,
            renderTree(propGetter, tagFactory)
        );

    return pipeline(root);
}

export default { render };
