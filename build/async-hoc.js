"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
/**
 * Load a vocabulary given a mapping from name to module name.
 * Returns a map of name to a promise that returns loaded module.
 *
 * Usage:
 *    loaders = load({ a: '@lib1/a', b: '@lib2/b' })
 *    // ...
 *    const aLoader = loaders.a;
 *    aLoader.then(liba => { ... use a });
 */
// tslint:disable:variable-name
exports.AsyncHoc = (importComponent) => class extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            component: null
        };
    }
    componentDidMount() {
        importComponent()
            // tslint:disable-next-line:no-any
            .then((cmp) => {
            this.setState({ component: cmp.default });
        });
    }
    render() {
        // tslint:disable-next-line:no-any
        const Comp = this.state.component;
        return Comp ? React.createElement(Comp, Object.assign({}, this.props)) : React.createElement("div", null, "loading...");
    }
};
//# sourceMappingURL=async-hoc.js.map