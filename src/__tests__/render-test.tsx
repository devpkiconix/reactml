// tslint:disable:variable-name
// tslint:disable:no-any
import { renderToString } from 'react-dom/server';
import { newVocab } from "../rtmlVocab";
const { parseF } = require('../parserV5');

import { ast2Vocab, reactRenderer } from '../render';

describe("rtml render ", () => {

    it("basic parse and  render", (done) => {
        const spec = `
simple = div ->"this is content";
comp1 = div(color="$g:style.color") -> span -> "$g:a";
comp2 = div(color="$g:style.color") -> span -> "a";
`;
        parseF(spec)
            .fork(done, (ast: any) => {
                // console.log(JSON.stringify(ast, null, 1));
                expect(ast).toBeInstanceOf(Object);
                const { comp1 } = ast;
                expect(comp1[0].tag).toBe("div");
                expect(comp1[0].props.color).toBe("$g:style.color");

                const state = { a: "a", b: "b", c: "c", style: { color: "red" } };
                const vocab = newVocab(undefined);
                ast2Vocab(ast, vocab);
                const render = (name: string) => renderToString(reactRenderer(vocab)(state)(name));

                expect(render("simple")).toBe(`<div>this is content</div>`);
                expect(render("comp2")).toBe(`<div color="red"><span>a</span></div>`);
                expect(render("comp1")).toBe(`<div color="red"><span>a</span></div>`);

                done();
            });
    });
    it("parse and render", (done) => {
        const spec = `
    header2 = hamburger, menus, settings;
    footer = div -> span -> copyright;
    body = div -> "Body here";
    copyright = "Copyright (c) 2019, Example.com!";
    page = header, body, footer;

    devicelist = devicefilter, devicetable;

    firstrow = graph(data="cpu"), graph(data="mem"), graph();
    secondtrow = x, y,z;
    dashboard = firstrow, secondrow;

    header = div->div->username;
    username = "$g:user.name";
    Paper = div;
    settings = div->"$g:user.name";
    elem = "one ", "two ", "three";
    elem2 = "$g:a", "$g:b";

    x = "$p:i";
    elem3 = x(i=1);
    y = "$g:c";
    elem4 = y(i=1), x(i=22), "$g:b";
    elem5 = "$g:a", "$g:b", "$g:c";
    elem6 = div(width="$p:width") -> "$g:a";
    elem7 = If(cond="$p:user.loggedIn" true="UserProfile" user="$p:user" false="NotLoggedIn");

            `;
        parseF(spec)
            .fork(done, (ast: any) => {
                // console.log(JSON.stringify(ast, null, 1));
                expect(ast).toBeInstanceOf(Object);
                const { footer, copyright } = ast;
                expect(footer[0].tag).toBe("div");
                expect(footer[0].children[0].children[0].tag).toBe("copyright");
                expect(copyright).toBe("Copyright (c) 2019, Example.com!");

                const state = { user: { name: "lakhan" }, a: "a", b: "b", c: "c", width: 200 };
                const state2 = { user: { name: "ram" } };
                const vocab = newVocab(undefined);
                ast2Vocab(ast, vocab);

                const render = (name: string) => renderToString(reactRenderer(vocab)(state)(name));
                const render2 = (name: string) => renderToString(reactRenderer(vocab)(state2)(name));
                // console.log(render("username"));

                expect(render("elem")).toBe("one <!-- -->two <!-- -->three");
                expect(render("elem2")).toBe(`a<!-- -->b`);
                expect(render("elem3")).toBe("1");
                expect(render("elem4")).toBe("c<!-- -->22<!-- -->b");
                expect(render("elem5")).toBe("a<!-- -->b<!-- -->c");
                // expect(render("elem6")).toBe("<div><span>a</span></div>");

                const footerHtml = `<div><span>Copyright (c) 2019, Example.com!</span></div>`;
                expect(render("footer")).toBe(footerHtml);
                expect(render("username")).toBe("lakhan");
                expect(render("header")).toBe(`<div><div>lakhan</div></div>`);

                const bodyHtml = `<div>Body here</div>`;
                expect(render("body")).toBe(bodyHtml);

                const lakhanPage = `<div><div>lakhan</div></div><div>Body here</div><div><span>Copyright (c) 2019, Example.com!</span></div>`;
                expect(render("page")).toBe(lakhanPage);
                const ramPage = `<div><div>ram</div></div><div>Body here</div><div><span>Copyright (c) 2019, Example.com!</span></div>`;
                expect(render2("page")).toBe(ramPage);

                done();
            });
    });
    it("passing props to components", (done) => {
        const spec = `
        myComponent = div -> "$p:text";
        cell1 = myComponent(text="cell1");
        cell2 = myComponent(text="cell2");
`;
        parseF(spec)
            .fork(done, (ast: any) => {
                // console.log(JSON.stringify(ast, null, 1));
                expect(ast).toBeInstanceOf(Object);
                const state = {};
                const vocab = newVocab(undefined);
                ast2Vocab(ast, vocab);

                const render = (name: string) => renderToString(reactRenderer(vocab)(state)(name));
                expect(render("cell1")).toBe("<div>cell1</div>");

                done();
            });
    });

});