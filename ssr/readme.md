
This folder contains a server that takes a YML config file and renders into
HTML, using react components.  Very rudimentary and very buggy right now.

# Usage:

`$ yarn `
`$ YML_SPEC=~/dev/reactml-example/src/containers/Playground/example.yml yarn
start`

So set YML_SPEC environment variable and start the server. The server looks for
component named 'App' and renders it. Any routes defined in the app should work
as expected.

No support for actions in this version.