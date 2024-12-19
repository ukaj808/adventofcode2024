import * as fs from 'fs';
import * as path from 'path';

type Node = {
  id: string;
  branches: { weight: number, node: Node }[];
}

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-16-input.txt"), 'utf-8')
    .trim()
    .split('\n')
    .map((ln) => ln.split(""));
};

const input = readInput();

const startingRow = input.findIndex((r) => r.includes('S'));
const startingCol = input[startingRow].findIndex((c) => c === 'S');
const startIndex = [startingRow, startingCol];

const mapGraph = (input: string[][], startIndex: {x:number,y:number}): Node => {

  const mappedNodes: Set<string> = new Set();

  const startingNode = {
  };

  ret
}

console.log(readInput());
