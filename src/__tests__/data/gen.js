const makemakeHello = ctx => {
  const { vocab, propMapper } = ctx;
  const [State, loop] = vocab.mapMulti(["State", "loop"]);
  const render = props => (
    <State init={vocab.map("stateInit")}>
      <div foo={props.a.b.c}>
        <h3>
          <span>Hello {props.user.name.first}</span>
        </h3>
        <input type={"text"} oninput={vocab.domEvtHandle(this, "helloinput")} />
        <div class={"buttons"}>
          <button onclick={vocab.domEvtHandle(this, "helloclick")}>
            click me
          </button>
        </div>
        <table class={"table striped"}>
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            <loop
              over={props.user.accounts}
              as={"account"}
              component={vocab.map("AccountRow")}
            />
          </tbody>
          <tfoot />
        </table>
      </div>
    </State>
  );

  // Add new component to vocabulary object
  // and return the updated vocab
  return vocab.add("makeHello", render);
};
