import React from 'react'

const ReactMLArrayMapper = (props) => {
    const { over, as, component } = props;
    // console.log("ArrMapper", props)
    if (!(over && as && component)) {
        return <div> Loading...</div>;
    }
    const overJs = over.toJS();
    const mapped = overJs.map((item, i) => {
        // debugger
        let newProps = {
            // ...props,
            key: i,
            [as]: item,
        };
        // console.log("creating react element with props", newProps);
        return React.createElement(component, { ...newProps })
    });
    return <div>
        {mapped}
    </div>
}

export default ReactMLArrayMapper;