"use strict";
const makemakeHello = ctx => {
    const { vocab, propMapper } = ctx;
    const [State, loop] = vocab.mapMulti(["State", "loop"]);
    const render = props => (React.createElement(State, { init: vocab.map("stateInit") },
        React.createElement("div", { foo: props.a.b.c },
            React.createElement("h3", null,
                React.createElement("span", null,
                    "Hello ",
                    props.user.name.first)),
            React.createElement("input", { type: "text", oninput: vocab.domEvtHandle(this, "helloinput") }),
            React.createElement("div", { class: "buttons" },
                React.createElement("button", { onclick: vocab.domEvtHandle(this, "helloclick") }, "click me")),
            React.createElement("table", { class: "table striped" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "name"),
                        React.createElement("th", null, "email"))),
                React.createElement("tbody", null,
                    React.createElement("loop", { over: props.user.accounts, as: "account", component: vocab.map("AccountRow") })),
                React.createElement("tfoot", null)))));
    // Add new component to vocabulary object
    // and return the updated vocab
    return vocab.add("makeHello", render);
};
//# sourceMappingURL=gen.js.map