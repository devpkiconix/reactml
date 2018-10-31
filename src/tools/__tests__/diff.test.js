import {
	composableDiff,
	setPrevVersion,
	clearPrevVersion,
	getPrevVersion
} from '../diff';

describe("diff component diff", () => {
	it("noprev", () => {
		clearPrevVersion();
		const compDefTable = {
			A: {
				props: { a: 1, b: 2 },
				tag: 'div', content: 'hello'
			},
			B: {
				props: { a: 5, b: 6 },
				tag: 'span', children: [
				]
			},
		};
		const diffFn = composableDiff();
		const delta = diffFn(compDefTable);
		expect(delta.A).toBeDefined();
		expect(delta.B).toBeDefined();
	});
	it("changed component def", () => {
		clearPrevVersion();
		const prev = {
			A: {
				props: { a: 1, b: 2 },
				tag: 'div', content: 'hello'
			},
			B: {
				props: { a: 5, b: 6 },
				tag: 'span', children: [
				]
			},
		};
		const updated = {
			A: {
				...prev.A,
				content: prev.A.content + ' world',
			},
			B: {
				...prev.B,
			},
		};
		setPrevVersion(prev);
		const diffFn = composableDiff();
		const delta = diffFn(updated);
		expect(delta.A).toBeDefined();
		expect(delta.B).not.toBeDefined();

	});
	it("new component def", ()  => {
		clearPrevVersion();
		const prev = {
			A: {
				props: { a: 1, b: 2 },
				tag: 'div', content: 'hello'
			},
			B: {
				props: { a: 5, b: 6 },
				tag: 'span', children: [
				]
			},
		};
		const updated = {
			A: {
				...prev.A,
			},
			B: {
				...prev.B,
			},
			C: {
				props: { a: 5, b: 6 },
				tag: 'span', children: [
				]
			},

		};
		setPrevVersion(prev);
		const diffFn = composableDiff();
		const delta = diffFn(updated);
		expect(delta.A).not.toBeDefined();
		expect(delta.B).not.toBeDefined();
		expect(delta.C).toBeDefined();
	});
	it("component removed");
})