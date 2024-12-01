import * as fs from 'fs';
import * as path from 'path';

const totalDist = (l1: number[], l2: number[]): number => {
  const l1Sorted = l1.toSorted((a, b) => a - b);
  const l2Sorted = l2.toSorted((a, b) => a - b);
  const sortedPairs = l1Sorted.map((x, i) => [x, l2Sorted[i]]);
  return sortedPairs.reduce((acc, xs) => acc + Math.abs(xs[0] - xs[1]), 0);
};

const simScore = (l1: number[], l2: number[]): number => {
  return l1.map((x) => {
    return x * l2.reduce((acc, curr) => {
      if (x == curr) {
        acc+=1;
      }
      return acc;
    }, 0);
  }).reduce((acc, curr) => acc + curr);
};

const readInput = (): [number[], number[]] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-1-input.txt"), 'utf-8')
    .split("\n")
    .filter((x) => x !== "")
    .reduce((acc: [number[], number[]], ln: string) => {
       const numPair = ln.split("   ").map((x) => parseInt(x));
       acc[0].push(numPair[0]);
       acc[1].push(numPair[1]);
       return acc;
    }, [[],[]]);
};

const input = readInput();

const p1Result = totalDist(input[0], input[1]);

console.log("Day 1 Part 1 Result: " + p1Result);

const p2Result = simScore(input[0], input[1]);

console.log("Day 1 Part 2 Result: " + p2Result);
