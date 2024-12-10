import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-9-input.txt"), 'utf-8').trim()
};

console.log(readInput());
