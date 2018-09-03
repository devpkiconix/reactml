# reactml
Experimental project exploring simpler way to build React apps

This library attempts to super-simplify React App by development by:

  - allowing you to specify view structure in a YML file
  - maintaining all state in redux
  - letting you supply initial state and React components you want to use in the views
  - letting you supply action functions
  - Generating React JS code from the YML once prototyping is done *(coming soon)*

Ideally, all you have to do is provide your view specs in YML and actions in JS. Everything else happens in the background (at least that's the idea!).

## How it works

Steps:

  1. You define a YML file describing your view
  2. Write your action and
  2. Initialize redux state
  3. Iterate 1-3 as many times as needed
  4. Generate code *(coming soon)*

## Running this Project

  1. `git clone`
  2. `yarn` or `npm install`
  2. `yarn start` or `npm start`
  3. If you want to run in docker, run `docker-compose up` (The server comes
     up on port 8000 in docker container. )

## Structure of the YML files

Structure:

```
state:
  initial:
    xxxx
stateNodeName: zzzz
components:
  Name:
    state-to-props:
    view:
      tag: xx
      children:
        - tag: yy
```
  - `state` node describes the initial state to be set in redux. It's initialized in the node provided by `stateNodeName`.
  - `Name` is the name of the view. This needs to be supplied to the top-level reactml component.
  -  `state-to-props` - describes redux state to props for the component (`mapStateToProps`). The keys in this table are property names, and the values are the state names. The state names can be specified in dot-delimited format. E.g. user.address.street.
  - `view`: Tree of react components
  - `tag`: React element to be rendered.
  -  `props`: Properties for the tag.

      Properties starting with a perid or dot are considered special. These properties can be dot-delimited names, and will be lookedup in redux state.

      Properties starting with two dots `..` are considered to be functions coming from the `actionLib` supplied by user.

      Properties starting with three dots `...` are considered to be react element names, supplied in tagFactory.

  - `children`: children of this tag. The children can have tag, props etc.  If there's only one child, you can directly use the tag name without this `children` node.
  - `content`: content to render under this node. Can be a dot-separated name that begins with a dot (in which case it'll be looked up in redux state). If this exists, `children` will be ignored.

Example:
(see `*.yml` in `src/containers/Playground directory` for complete examples)

```
components:
  ReadOnly:
    state-to-props:
      email: user.email
      firstName: user.firstName
    view:
      tag: div
      children:
        - tag: h4
          content: ReactML - ReadOnly view (readonly.yml)
        - tag: div
          children:
          - tag: span
            content: 'Name: '
          - tag: span
            content: .firstName
        - tag: div
          children:
          - tag: span
            content: 'E-mail: '
          - tag: span
            content: .email

```

## API

### ReactML

This is a React component that takes three properties.

  - tagFactory: a table of React Component tags that this ReactML component will render.
  - spec: View specification object - we use YML in the examples, but this could easily be JSON or hand-coded javascript object
  - page: The name of the component to render. This will be looked up under `components` node in the spec.
  - actionLib: A table of functions to be used for actions.

Example:

```
const actionLib = {
    onClick: (event) => (dispatch) => { dispatch({type: 'SOME_ACTION', ... }) }
}
const TagFactory = { Button, Grid, Paper };
...
...

    <ReactML tagFactory={TagFactory1}
        spec={spec}
        component='HomePage'
        actionLib={actionLib} />
```

### ReactMLHoc

A higher-order component that hides nitty gritty of state initialization (from YML) and other such details, into a function. It takes the following parameters:
spec - YML spec

  - `lib` - library of functions to be used for actions, event handling etc.
  - `tagFactory` - React component tags used in the spec
  - `stateNodeName` - Name of the node in redux store where the state is to be stored.
  - `view` - Name of the view to render

## Limitations

  - No support for dynamic loops or conditionals
  - Route specifications are not working if specified via YML
## Coming soon

  - Code generation
  - NPM module
