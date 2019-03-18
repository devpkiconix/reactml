// tslint:disable:variable-name
// tslint:disable:no-any
import { codegenSpec } from '../codegen';
import { mapObjIndexed } from 'ramda';
import prettify from '../prettify';

describe("rtml codegen ", () => {

    it("basic codegen", (done) => {
        const spec = `
            MyTitle = div -> "$p:text";
            title1 = MyTitle(text="special title");

            footer = div -> span -> copyright;
            body = div -> "Body here";
            copyright = "Copyright (c) 2019, Example.com!";
            page = header, body, footer;

            Page = Header, Body, Footer;
            Header = AppBar(position="static") ->Toolbar->Button -> "Login";
            Body = Grid(container=true spacing=24) ->
                (Grid(item=true xs=12) -> Paper -> "xs=12"
                );
            Footer = div -> span -> Copyright;
            Copyright = span -> "Copyright (c) 2019, Example.com!";

        `;

        codegenSpec(spec)
            // .map(mapObjIndexed(prettify))
            .map(output => {
                console.log(output);
                Object.keys(output).forEach(name => {
                    // console.log(`/*${name}*/\n${output[name]}`);
                });
                return output;
            }).fork((err) => done(new Error(err.toString())), () => done());
    });
});
