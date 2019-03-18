"use strict";
const React = require("react");
const ReactFragment = React.Fragment;
const makeMyTitle = vocab => {
    const [ReactFragment] = vocab.mapMulti(["ReactFragment"]);
    console.log([ReactFragment]);
    const MyTitle = props => (React.createElement(ReactFragment, null,
        " ",
        React.createElement("div", null, props.text)));
    vocab.update("MyTitle", MyTitle);
};
const maketitle1 = vocab => {
    const [MyTitle] = vocab.mapMulti(["MyTitle"]);
    console.log([MyTitle]);
    const title1 = props => (React.createElement(ReactFragment, null,
        " ",
        React.createElement(MyTitle, { text: "special title" })));
    vocab.update("title1", title1);
};
const makefooter = vocab => {
    const [ReactFragment, copyright] = vocab.mapMulti([
        "ReactFragment",
        "copyright"
    ]);
    console.log([ReactFragment, copyright]);
    const footer = props => (React.createElement(ReactFragment, null,
        " ",
        React.createElement("div", null,
            React.createElement("span", null,
                React.createElement("copyright", null)))));
    vocab.update("footer", footer);
};
const makebody = vocab => {
    const [ReactFragment] = vocab.mapMulti(["ReactFragment"]);
    console.log([ReactFragment]);
    const body = props => (React.createElement(ReactFragment, null,
        " ",
        React.createElement("div", null, "Body here")));
    vocab.update("body", body);
};
const makecopyright = vocab => {
    const copyright = props => (React.createElement(ReactFragment, null, "Copyright (c) 2019, Example.com!"));
    vocab.update("copyright", copyright);
};
const makepage = vocab => {
    const [ReactFragment] = vocab.mapMulti(["ReactFragment"]);
    console.log([ReactFragment]);
    const page = props => (React.createElement(ReactFragment, null,
        " ",
        React.createElement("header", null),
        React.createElement("body", null),
        React.createElement("footer", null)));
    vocab.update("page", page);
};
module.exports = vocab => ({
    MyTitle: makeMyTitle(vocab),
    title1: maketitle1(vocab),
    footer: makefooter(vocab),
    body: makebody(vocab),
    copyright: makecopyright(vocab),
    page: makepage(vocab)
});
//# sourceMappingURL=codegentest.js.map