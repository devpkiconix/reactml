// tslint:disable:variable-name
// tslint:disable:no-any

const { parseF } = require('../parserV5');

describe("rtml parse ", () => {
    it("basic parsing test", (done) => {
        const spec1 = `p = a->b;`;
        const spec = `// comment line
        // This is another comment
page = header, body, footer;
body = div(width=$g:style.page.width) -> span(color="red") -> "body here";
header = hamburger, menus, settings;
footer = copyright;
if2 = div -> If(cond="$p:user.loggedIn" component="UserProfile" user="$p:user" else_="NotLoggedIn");
//comment
//comment line 2
page2 = (header, //comment
    body, // comment
    footer // comment
    ); //comment
body2 = (div -> //comment
     span(color="red") -> "body here");

page3 = header, body, footer;


`;
        parseF(spec)
            .fork(done, (ast: any) => {
                // console.log(JSON.stringify(ast, null, 2));
                expect(ast).toBeInstanceOf(Object);
                const { page, header, body, footer, if2 } = ast;
                expect(page).toBeInstanceOf(Array);
                expect(page.length).toBe(3);
                expect(page[0].tag).toBe("header");
                expect(page[1].tag).toBe("body");
                expect(page[2].tag).toBe("footer");

                expect(header[0].tag).toBe("hamburger");
                expect(header[1].tag).toBe("menus");
                expect(header[2].tag).toBe("settings");

                expect(body[0].tag).toBe("div");
                expect(body[0].children[0].tag).toBe("span");

                expect(if2[0].children[0].tag).toBe("If");
                expect(if2[0].children[0].props.cond).toBe("$p:user.loggedIn");
                expect(if2[0].children[0].props.user).toBe("$p:user");

                // extra span added to make the code a little simpler
                expect(body[0].children[0].children[0]).toBe("body here");
                expect(footer.tag).toBe("copyright");

                done();
            });
    });
    // it("grouping", () => {
    //     const myParser = RtmlParser(0);
    //     myParser._node.tryParse(`div`);
    //     myParser._node.tryParse(`div,span`);
    //     myParser._arrowSepNodes.tryParse(`div->span`);
    //     myParser._node.tryParse(`div(width=200)`);
    //     myParser._commaSepNodes.tryParse(`div(width=200), span(color="red"), p, a, graph(type="bar")`);
    //     myParser._arrowSepNodes.tryParse(`div(width=200) -> span(color="red") -> p -> a -> graph(type="bar")`);
    //     myParser._arrowSepNodes.tryParse(`div(width=200) -> span(color="red") -> p -> a -> graph(type="bar")`);
    //     myParser._groupedCommaSepNodes.tryParse(`(div(width=200), span(color="red"), graph(type="line"))`);
    //     myParser._groupedArrowSepNodes.tryParse(`(div(width=200) -> span(color="red") -> "hello world")`);

    //     myParser._maybeArrowSepNodes.tryParse(`div(width=30) -> "hello world"`);
    //     myParser._maybeArrowSepNodes.tryParse(`(div(width=30) -> "hello world")`);

    //     myParser._node.tryParse(`div`);
    //     myParser._node2.tryParse(`div -> div(width=200) -> span(color="red") -> "hello world"`);
    //     myParser._node2.tryParse(`(div -> div(width=200) -> span(color="red") -> "hello world")`);
    //     myParser._node2.tryParse(`(div -> div(width=200) -> span(color="red") -> "hello world")`);

    //     myParser._node.tryParse(`div(width=200)`);
    //     myParser._node.tryParse(`"hello world"`);

    // });
    it("hierarchy with liberal whitespace", (done) => {
        const spec = `
page = A(prop1=1 prop2="string" prop3=true prop4={ "some": "object"})
-> B
->
C
-> D;
                `;
        parseF(spec)
            .fork(done, (ast: any) => {
                // console.log(JSON.stringify(ast, null, 2));
                expect(ast).toBeInstanceOf(Object);
                const { page, } = ast;
                const A = page[0];
                expect(A).toBeInstanceOf(Object);
                expect(A.tag).toBe("A");
                expect(A.props.prop1).toBe(1);
                expect(A.props.prop2).toBe("string");
                const B = A.children[0];
                expect(B).toBeInstanceOf(Object);
                expect(B.tag).toBe("B");
                const C = B.children[0];
                expect(C).toBeInstanceOf(Object);
                expect(C.tag).toBe("C");
                done();
            });
    });
    it("hierarchy2", (done) => {
        const spec = `
page = A(prop1=1 prop2="string" prop3=true prop4={ "some": "object"}) -> B ->  C -> D;
header = div -> "$p:user.name";
                `;
        parseF(spec)
            .fork(done, (ast: any) => {
                // console.log(JSON.stringify(ast, null, 2));
                expect(ast).toBeInstanceOf(Object);
                const { page, header } = ast;
                const A = page[0];
                expect(A).toBeInstanceOf(Object);
                expect(A.tag).toBe("A");
                expect(A.props.prop1).toBe(1);
                expect(A.props.prop2).toBe("string");
                const B = A.children[0];
                expect(B).toBeInstanceOf(Object);
                expect(B.tag).toBe("B");
                const C = B.children[0];
                expect(C).toBeInstanceOf(Object);
                expect(C.tag).toBe("C");
                done();
            });
    });
    it("with content", (done) => {
        const spec = `
table = thead, tbody(ds="my-data-source-name"), tfoot;
fcontent = "hello footer!", "foobar", copyright;
copyright = "Copyright (c) 2019, Example.com!";
        `;
        parseF(spec)
            .fork(done, (ast: any) => {
                expect(ast).toBeInstanceOf(Object);
                const { table, fcontent, copyright } = ast;

                expect(table.length).toBe(3);

                expect(fcontent.length).toBe(3);
                expect(fcontent[0]).toBe("hello footer!");
                expect(fcontent[1]).toBe("foobar");
                expect(typeof fcontent[2]).toBe("object");
                expect(fcontent[2].tag).toBe("copyright");
                expect(copyright).toBe("Copyright (c) 2019, Example.com!");
                done();
            });
    });

    it("more parsing..", (done) => {
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
                // console.log(ast);
                expect(ast).toBeInstanceOf(Object);
                const { username, elem, elem2, elem3, elem4, elem5, elem6, elem7 } = ast;
                expect(JSON.stringify(elem)).toBe(`["one ","two ","three"]`);
                expect(JSON.stringify(elem2)).toBe(`["$g:a","$g:b"]`);
                done();
            });
    });

});

// describe("rtml lex", () => {
//     const lexF = (parserName: string, spec: string): FutVal<any> => {
//         const rtml = RtmlParser(0);

//         return Future((rej, resolve) => {
//             try {
//                 const parser = rtml[parserName];
//                 console.log(parser);
//                 resolve(parser.tryParse(spec));
//             } catch (err) {
//                 rej(err);
//             }
//         });
//     };
//     it("lex hierarchy", (done) => {
//         const spec = `(c->d->e -> (e1,e2,e3), (t1->t2->(t3->t4)))`;
//         lexF("Node3", spec)
//             .map(result => {
//                 console.log(JSON.stringify(result, null, 2));
//                 return result;
//             })
//             .fork(done, () => done());
//     });
//     it("list", (done) => {
//         const spec = `(a, (b(width=100),(c->d->e -> (e1,e2,e3)), "some string", xy, yz, a1))`;
//         lexF("Node3", spec)
//             .map(result => {
//                 console.log(JSON.stringify(result, null, 2));
//                 return result;
//             })
//             .fork(done, () => done());
//     });
//     it("equation", (done) => {
//         const spec = `foo = (a, (b(width=100),(c->d->e -> (e1,e2,e3)), "some string", xy, yz, a1), "some text")`;
//         lexF("Equation3", spec)
//             .map(result => {
//                 console.log(JSON.stringify(result, null, 2));
//                 return result;
//             })
//             .fork(done, () => done());
//     });
// });