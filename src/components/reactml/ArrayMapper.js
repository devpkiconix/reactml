import React from 'react'

const ReactMLArrayMapper = (props) => {
    const { over, as, component } = props;
    if (!(over && as && component)) {
        return <div> Loading...</div>;
    }
    const mapped = over.map((x, i) => {
        // debugger
        let newProps = {
            ...props,
            key: i,
            [as]: x,
        };
        return React.createElement(component, { ...newProps })
    });
    return <div>
        {mapped}
    </div>
}

export default ReactMLArrayMapper;