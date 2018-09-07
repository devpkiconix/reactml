'use strict';

var _functions = require('./functions');

var _functions2 = _interopRequireDefault(_functions);

var _util = require('./util');

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chaiImmutable = require('chai-immutable');

var maybeParse = _functions2.default.maybeParse,
    mapNode2Tag = _functions2.default.mapNode2Tag,
    mapPropName2Value = _functions2.default.mapPropName2Value;


describe("Basic reactml rendering", function () {
    it("maybeparse - yaml", function () {
        var inputYaml = sampleYaml();
        var obj = maybeParse(inputYaml);
        var yamlAgain = (0, _util.toYaml)(obj);
        (0, _chai.expect)(obj).to.be.an('object');
        (0, _chai.expect)(yamlAgain).to.be.a('string');

        // confirm that the two YAMLs eval to the same obj
        var objAgain = (0, _util.fromYaml)(yamlAgain);
        (0, _chai.expect)(obj.id).to.equal(objAgain.id);

        var obj2 = maybeParse({});
        (0, _chai.expect)(obj2).to.be.an('object');
    });

    it("mapPropName2Value", function () {
        // constants
        var Dummy1 = {},
            Dummy2 = {},
            STREET = 'SOME Street',
            ZIP = 12345,
            STREET_PROP = ".user.address.street",
            // Note leading dot
        ZIP_PROP = ".user.address.zip",
            // Note leading dot
        NOT_DEFINED_PROP = ".not-defined",
            // Note leading dot
        CONST_STRING = "a-const-string",
            DUMMY1_PROP = '...Dummy1',
            // note leading triple-dot
        NOT_DEFINED_TAG_PROP = '...XYZ',
            // note leading triple-dot
        SAVE_PROP = "..save",
            NOT_DEFINED_ACTION_PROP = "..blah",
            dummyTagFactory = { Dummy1: Dummy1, Dummy2: Dummy2 };

        var tagGetter = mapNode2Tag(dummyTagFactory);
        var rootProps = {
            user: {
                address: {
                    street: STREET,
                    zip: ZIP
                }
            },
            save: function save() {
                return 0;
            }
        };

        //NOte the leading dot
        var street = mapPropName2Value(tagGetter, rootProps, STREET_PROP);
        (0, _chai.expect)(street).to.equal(STREET);

        var zip = mapPropName2Value(tagGetter, rootProps, ZIP_PROP);
        (0, _chai.expect)(zip).to.equal(ZIP);

        var notdefined = mapPropName2Value(tagGetter, rootProps, NOT_DEFINED_PROP);
        (0, _chai.expect)(notdefined).to.be.undefined;

        var notaProp = mapPropName2Value(tagGetter, rootProps, CONST_STRING);
        (0, _chai.expect)(notaProp).to.equal(CONST_STRING);

        // Function prop - TBD
        var fn1 = mapPropName2Value(tagGetter, rootProps, SAVE_PROP);
        (0, _chai.expect)(fn1).to.equal(rootProps.save);
        var fn2 = mapPropName2Value(tagGetter, rootProps, NOT_DEFINED_ACTION_PROP);
        (0, _chai.expect)(fn2).to.be.undefined;

        // Tag props
        var tag1 = mapPropName2Value(tagGetter, rootProps, DUMMY1_PROP);
        (0, _chai.expect)(tag1).to.equal(Dummy1);
        var tag2 = mapPropName2Value(tagGetter, rootProps, NOT_DEFINED_TAG_PROP);
        (0, _chai.expect)(tag2).to.equal(NOT_DEFINED_TAG_PROP.replace('...', ''));
    });
});

var sampleYaml = function sampleYaml() {
    return '\nid: ' + nextId() + '\nstate:\n  initial: {}\n  stateNodeName: switch\ncomponents:\n  Switch:\n    state-to-props: {}\n    view:\n      tag: div\n      children:\n        - tag: main\n          children:\n            - tag: Switch\n              props: {}\n              children:\n              - tag: Route\n                props:\n                  exact: true\n                  path: /reactml/editor\n                  component: ...Editor\n              - tag: Route\n                props:\n                  exact: true\n                  path: /reactml/about\n                  component: ...About\n              - tag: Route\n                props:\n                  exact: true\n                  path: /reactml/view\n                  component: ...ReadOnly\n';
};

var next = new Date().getTime();
var nextId = function nextId() {
    return next++;
};