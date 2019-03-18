// tslint:disable:variable-name
// tslint:disable:no-any
import * as React from 'react';
import { newVocab } from "../rtmlVocab";
import { rtmlRenderTest } from "../testlib";

describe("basic rtml conditional rendering", () => {
    const spec = `
    if1 = If(cond="$p:user.loggedIn" true="UserProfile" user="$p:user" false="NotLoggedIn");
    if2 = div -> If(cond="$p:user.loggedIn" true="UserProfile" user="$p:user" false="NotLoggedIn");
    `;
    const UserProfile = (props: any) => {
        return (<div className="profile">{props.user.email}</div>);
    };
    const NotLoggedIn = (props: any) => {
        return <span>Not loggedin!</span>;
    };
    const loggedInState = {
        user: {
            loggedIn: true,
            email: "user1@example.com",
        }
    };
    const notLoggedInState = { user: { loggedIn: false, } };
    it(" - true case", (done) => {
        const compName = "if1";
        const baseVocab = newVocab({ UserProfile, NotLoggedIn });
        const expected = `<div class="profile">user1@example.com</div>`;
        rtmlRenderTest(spec, baseVocab, compName, loggedInState, expected, done);
    });
    it(" - false case", (done) => {
        const compName = "if1";
        const baseVocab = newVocab({ UserProfile, NotLoggedIn });
        const expected = `<span>Not loggedin!</span>`;
        rtmlRenderTest(spec, baseVocab, compName, notLoggedInState, expected, done);
    });

});
