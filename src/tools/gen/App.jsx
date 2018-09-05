// Code generated by reactml
import React from "react";
import connect from "react-redux";

import lib from "./lib";

import TagFactory from "./tag-factory";
const { Header, NavRoutes } = TagFactory;

const App = props => (
  <React.Fragment>
    <Header />

    <main>
      <NavRoutes />
    </main>
  </React.Fragment>
);

const mapStateToProps = ({ reactml }) => {
  let compState = reactml.get(stateNodeName);
  return {};
};

const mapActionsToProps = null;

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);