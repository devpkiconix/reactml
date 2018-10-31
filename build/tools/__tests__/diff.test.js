"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _diff = require("../diff");

describe("diff component diff", function () {
	it("noprev", function () {
		(0, _diff.clearPrevVersion)();
		var compDefTable = {
			A: {
				props: { a: 1, b: 2 },
				tag: 'div', content: 'hello'
			},
			B: {
				props: { a: 5, b: 6 },
				tag: 'span', children: []
			}
		};
		var diffFn = (0, _diff.composableDiff)();
		var delta = diffFn(compDefTable);
		expect(delta.A).toBeDefined();
		expect(delta.B).toBeDefined();
	});
	it("changed component def", function () {
		(0, _diff.clearPrevVersion)();
		var prev = {
			A: {
				props: { a: 1, b: 2 },
				tag: 'div', content: 'hello'
			},
			B: {
				props: { a: 5, b: 6 },
				tag: 'span', children: []
			}
		};
		var updated = {
			A: _extends({}, prev.A, {
				content: prev.A.content + ' world'
			}),
			B: _extends({}, prev.B)
		};
		(0, _diff.setPrevVersion)(prev);
		var diffFn = (0, _diff.composableDiff)();
		var delta = diffFn(updated);
		expect(delta.A).toBeDefined();
		expect(delta.B).not.toBeDefined();
	});
	it("new component def", function () {
		(0, _diff.clearPrevVersion)();
		var prev = {
			A: {
				props: { a: 1, b: 2 },
				tag: 'div', content: 'hello'
			},
			B: {
				props: { a: 5, b: 6 },
				tag: 'span', children: []
			}
		};
		var updated = {
			A: _extends({}, prev.A),
			B: _extends({}, prev.B),
			C: {
				props: { a: 5, b: 6 },
				tag: 'span', children: []
			}

		};
		(0, _diff.setPrevVersion)(prev);
		var diffFn = (0, _diff.composableDiff)();
		var delta = diffFn(updated);
		expect(delta.A).not.toBeDefined();
		expect(delta.B).not.toBeDefined();
		expect(delta.C).toBeDefined();
	});
	it("component removed");
});