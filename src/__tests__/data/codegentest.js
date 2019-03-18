const React = require("react");
const ReactFragment = React.Fragment;

const makeMyTitle = vocab => {
  const [ReactFragment] = vocab.mapMulti(["ReactFragment"]);
  console.log([ReactFragment]);

  const MyTitle = props => (
    <ReactFragment>
      {" "}
      <div>{props.text}</div>
    </ReactFragment>
  );

  vocab.update("MyTitle", MyTitle);
};

const maketitle1 = vocab => {
  const [MyTitle] = vocab.mapMulti(["MyTitle"]);
  console.log([MyTitle]);

  const title1 = props => (
    <ReactFragment>
      {" "}
      <MyTitle text={"special title"} />
    </ReactFragment>
  );

  vocab.update("title1", title1);
};

const makefooter = vocab => {
  const [ReactFragment, copyright] = vocab.mapMulti([
    "ReactFragment",
    "copyright"
  ]);
  console.log([ReactFragment, copyright]);

  const footer = props => (
    <ReactFragment>
      {" "}
      <div>
        <span>
          <copyright />
        </span>
      </div>
    </ReactFragment>
  );

  vocab.update("footer", footer);
};

const makebody = vocab => {
  const [ReactFragment] = vocab.mapMulti(["ReactFragment"]);
  console.log([ReactFragment]);

  const body = props => (
    <ReactFragment>
      {" "}
      <div>Body here</div>
    </ReactFragment>
  );

  vocab.update("body", body);
};

const makecopyright = vocab => {
  const copyright = props => (
    <ReactFragment>Copyright (c) 2019, Example.com!</ReactFragment>
  );

  vocab.update("copyright", copyright);
};

const makepage = vocab => {
  const [ReactFragment] = vocab.mapMulti(["ReactFragment"]);
  console.log([ReactFragment]);

  const page = props => (
    <ReactFragment>
      {" "}
      <header />
      <body />
      <footer />
    </ReactFragment>
  );

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
