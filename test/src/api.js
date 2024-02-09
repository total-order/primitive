import test from 'ava';

import {increasing, decreasing} from '#module';

const repr = (x) => {
	switch (typeof x) {
		case 'number': {
			return x.toString();
		}

		case 'bigint': {
			return `${x.toString()}n`;
		}

		case 'string': {
			return JSON.stringify(x);
		}

		default: {
			break;
		}
	}

	if (x instanceof Date) return x.toISOString();
	return JSON.stringify(x);
};

const eq = (x) => x === 0;
const ne = (x) => x !== 0;
const lt = (x) => x < 0;
const gt = (x) => x > 0;

const macro = (t, compare, a, rel, b) => {
	t.true(rel(compare(a, b)));
};

macro.title = (title, compare, a, rel, b) =>
	title || `${compare.name}(${repr(a)}, ${repr(b)}) ${rel.name} 0`;

const fns = [
	{compare: increasing, lt, gt},
	{compare: decreasing, lt: gt, gt: lt},
];

for (const {compare, lt, gt} of fns) {
	test(macro, compare, 0, lt, 1);
	test(macro, compare, 0, eq, 0);
	test(macro, compare, 1, eq, 1);
	test(macro, compare, 1, gt, 0);

	test(macro, compare, 0, lt, Number.POSITIVE_INFINITY);
	test(macro, compare, Number.POSITIVE_INFINITY, eq, Number.POSITIVE_INFINITY);
	test(macro, compare, Number.POSITIVE_INFINITY, gt, 0);

	test(macro, compare, 'ab', lt, 'abc');
	test(macro, compare, 'abc', eq, 'abc');
	test(macro, compare, 'abc', gt, 'ab');

	test(macro, compare, 0n, lt, 1n);
	test(macro, compare, 0n, eq, 0n);
	test(macro, compare, 1n, eq, 1n);
	test(macro, compare, 1n, gt, 0n);

	test(macro, compare, Number.NaN, ne, Number.NaN);
	test(macro, compare, Number.NaN, ne, 0);
	test(macro, compare, 0, ne, Number.NaN);

	test(macro, compare, Number.NaN, ne, Number.POSITIVE_INFINITY);
	test(macro, compare, Number.POSITIVE_INFINITY, ne, Number.NaN);
	test(macro, compare, Number.NaN, ne, Number.NEGATIVE_INFINITY);
	test(macro, compare, Number.NEGATIVE_INFINITY, ne, Number.NaN);

	test(macro, compare, new Date(0), lt, new Date(1));
	test(macro, compare, new Date(1), gt, new Date(0));

	// This library is not suitable for date value equality checking
	test(macro, compare, new Date(1), ne, new Date(1));
}
