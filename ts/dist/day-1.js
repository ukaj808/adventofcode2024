"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = (l1, l2) => {
    const l1Sorted = l1.toSorted((a, b) => a - b);
    const l2Sorted = l2.toSorted((a, b) => a - b);
    const sortedPairs = l1Sorted.map((x, i) => [x, l2Sorted[i]]);
    return sortedPairs.reduce((acc, xs) => acc + Math.abs(xs[0] - xs[1]), 0);
};
