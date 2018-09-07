import React from 'react';

import renderer from 'react-test-renderer';

test('Test non-reactml renders correctly', () => {
    const tree = renderer
        .create(<span>
            <span>hello world</span>
        </span>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
