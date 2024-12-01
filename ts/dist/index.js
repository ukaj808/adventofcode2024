"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const totalDist = (l1, l2) => {
    const l1Sorted = l1.toSorted((a, b) => a - b);
    const l2Sorted = l2.toSorted((a, b) => a - b);
    const sortedPairs = l1Sorted.map((x, i) => [x, l2Sorted[i]]);
    return sortedPairs.reduce((acc, xs) => acc + Math.abs(xs[0] - xs[1]), 0);
};
const simScore = (l1, l2) => {
    return l1.map((x) => {
        return x * l2.reduce((acc, curr) => {
            if (x == curr) {
                acc += 1;
            }
            return acc;
        }, 0);
    }).reduce((acc, curr) => acc + curr);
};
const readInput = () => {
    return fs.readFileSync(path.join(__dirname, "input.txt"), 'utf-8')
        .split("\n")
        .filter((x) => x !== "")
        .reduce((acc, ln) => {
        const numPair = ln.split("   ").map((x) => parseInt(x));
        console.log(ln);
        acc[0].push(numPair[0]);
        acc[1].push(numPair[1]);
        return acc;
    }, [[], []]);
};
const input = readInput();
const p1Result = totalDist(input[0], input[1]);
console.log("Day 1 Part 1 Result: " + p1Result);
const p2Result = simScore(input[0], input[1]);
console.log("Day 1 Part 2 Result: " + p2Result);
