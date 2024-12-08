import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-8-input.txt"), 'utf-8').split('\n')
    .filter((ln: string) => ln !== "")
    .reduce((acc: string[][], ln: string) => [...acc, ln.split("")], []);
};


console.log(readInput());
