import { functions } from '../render';
import { fromYaml, toYaml } from '../../../modules/reactml/util';

import { expect } from 'chai';
const chaiImmutable = require('chai-immutable');

const {
    maybeParse, mapNode2Tag, mapPropName2Value,
} = functions;


describe("Basic reactml rendering", () => {
    it("maybeparse - yaml", () => {
        let inputYaml = sampleYaml()
        const obj = maybeParse(inputYaml);
        const yamlAgain = toYaml(obj);
        expect(obj).to.be.an('object');
        expect(yamlAgain).to.be.a('string');

        // confirm that the two YAMLs eval to the same obj
        const objAgain = fromYaml(yamlAgain);
        expect(obj.id).to.equal(objAgain.id)

        const obj2 = maybeParse({});
        expect(obj2).to.be.an('object');
    });

    it("mapPropName2Value", () => {
        // constants
        const Dummy1 = {}, Dummy2 = {},
            STREET = 'SOME Street',
            ZIP = 12345,
            STREET_PROP = ".user.address.street", // Note leading dot
            ZIP_PROP = ".user.address.zip", // Note leading dot
            NOT_DEFINED_PROP = ".not-defined", // Note leading dot
            CONST_STRING = "a-const-string",
            DUMMY1_PROP = '...Dummy1', // note leading triple-dot
            NOT_DEFINED_TAG_PROP = '...XYZ',  // note leading triple-dot
            SAVE_PROP = "..save",
            NOT_DEFINED_ACTION_PROP = "..blah",
            dummyTagFactory = { Dummy1, Dummy2 };

        const tagGetter = mapNode2Tag(dummyTagFactory);
        const rootProps = {
            user: {
                address: {
                    street: STREET,
                    zip: ZIP
                }
            },
            save: () => 0,
        };

        //NOte the leading dot
        const street = mapPropName2Value(tagGetter, rootProps, STREET_PROP);
        expect(street).to.equal(STREET);

        const zip = mapPropName2Value(tagGetter, rootProps, ZIP_PROP);
        expect(zip).to.equal(ZIP);

        const notdefined = mapPropName2Value(tagGetter, rootProps, NOT_DEFINED_PROP);
        expect(notdefined).to.be.undefined;

        const notaProp = mapPropName2Value(tagGetter, rootProps, CONST_STRING);
        expect(notaProp).to.equal(CONST_STRING);

        // Function prop - TBD
        const fn1 = mapPropName2Value(tagGetter, rootProps, SAVE_PROP);
        expect(fn1).to.equal(rootProps.save);
        const fn2 = mapPropName2Value(tagGetter, rootProps, NOT_DEFINED_ACTION_PROP);
        expect(fn2).to.be.undefined;

        // Tag props
        const tag1 = mapPropName2Value(tagGetter, rootProps, DUMMY1_PROP);
        expect(tag1).to.equal(Dummy1);
        const tag2 = mapPropName2Value(tagGetter, rootProps, NOT_DEFINED_TAG_PROP);
        expect(tag2).to.equal(NOT_DEFINED_TAG_PROP.replace('...', ''))

    });
});

const sampleYaml = () => `
id: ${nextId()}
state:
  initial: {}
  stateNodeName: switch
components:
  Switch:
    state-to-props: {}
    view:
      tag: div
      children:
        - tag: main
          children:
            - tag: Switch
              props: {}
              children:
              - tag: Route
                props:
                  exact: true
                  path: /reactml/editor
                  component: ...Editor
              - tag: Route
                props:
                  exact: true
                  path: /reactml/about
                  component: ...About
              - tag: Route
                props:
                  exact: true
                  path: /reactml/view
                  component: ...ReadOnly
`;

let next = new Date().getTime();
const nextId = () => next++;
