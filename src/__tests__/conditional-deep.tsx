// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { newVocab } from "../rtmlVocab";
import { rtmlRenderTest } from "../testlib";

describe("basic rtml conditional rendering", () => {
    const spec = `
    if1 = If(cond=$p:user.loggedIn true="UserProfile" user="$p:user" false="NotLoggedIn");
    if2 = div -> (If(cond="$g:user.loggedIn" true="UserProfile" user="$g:user" false="NotLoggedIn"));
    `;
    const UserProfile = (props: any) => {
        return (<span className="profile">{props.user.email}</span>);
    };
    const NotLoggedIn = () => {
        return <span>Not loggedin!</span>;
    };
    const loggedInState = {
        user: {
            loggedIn: true,
            email: "user1@example.com",
        }
    };
    const notLoggedInState = {
        user: {
            loggedIn: false,
        }
    };

    it("deeper component - true case", (done) => {
        const compName = "if2";
        const baseVocab = newVocab({ UserProfile, NotLoggedIn });
        const expected = `<div><span class="profile">user1@example.com</span></div>`;
        rtmlRenderTest(spec, baseVocab, compName, loggedInState, expected, done);
    });

    it("deeper component - false case", (done) => {
        const compName = "if2";
        const baseVocab = newVocab({ UserProfile, NotLoggedIn });
        const expected = `<div><span>Not loggedin!</span></div>`;
        rtmlRenderTest(spec, baseVocab, compName, notLoggedInState, expected, done);
    });
});
