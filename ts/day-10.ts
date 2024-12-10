import * as fs from 'fs';
import * as path from 'path';

const readInput = (): number[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-10-input.txt"), 'utf-8').trim()
  .split('\n')
  .map((ln) => ln.split('').map((c) => parseInt(c)));
};

const isValidIndex = (input: number[][], index: [number, number]): boolean => {
  return index[0] >= 0 && index[0] < input.length && index[1] >= 0 && index[1] < input[0].length;
}

const findPaths = (input: number[][], currentIndex: [number, number], path: [number,number][]): [number, number][][] => {
  const currentValue = input[currentIndex[0]][currentIndex[1]];
  if (currentValue === 9) {
    return [path];
  }
  const upIndex: [number, number] = [currentIndex[0]-1, currentIndex[1]];
  const upValue = isValidIndex(input, upIndex) ? input[upIndex[0]][upIndex[1]] : -1;
  const rightIndex: [number, number] = [currentIndex[0], currentIndex[1]+1];
  const rightValue = isValidIndex(input, rightIndex) ? input[rightIndex[0]][rightIndex[1]] : -1;
  const downIndex: [number, number] = [currentIndex[0]+1, currentIndex[1]];
  const downValue = isValidIndex(input, downIndex) ? input[downIndex[0]][downIndex[1]] : -1;
  const leftIndex: [number, number] = [currentIndex[0], currentIndex[1]-1];
  const leftValue = isValidIndex(input, leftIndex) ? input[leftIndex[0]][leftIndex[1]] : -1;

  let result: [number, number][][] = [];

  if (upValue === currentValue + 1) {
    result = [...result, ...findPaths(input, upIndex, [...path, upIndex])];
  }
  if (rightValue === currentValue + 1) {
    result = [...result, ...findPaths(input, rightIndex, [...path, rightIndex])];
  }
  if (downValue === currentValue + 1) {
    result = [...result, ...findPaths(input, downIndex, [...path, downIndex])];
  }
  if (leftValue === currentValue + 1) {
    result = [...result, ...findPaths(input, leftIndex, [...path, leftIndex])];
  }

  return result;

};

const findTrailHeads = (input: number[][]): [number, number][] => {
  return input.reduce((acc: [number, number][], row, rowIndex) => {
    const trailHeads = row.reduce((akk: [number, number][], val, colIndex) => {
	const index: [number, number] = [rowIndex, colIndex];
	return val === 0 ? [...akk, index] : akk;
    }, []);
    return [...acc, ...trailHeads];
  }, []);
};

const countUniqueTrails = (trails: [number,number][][]): number => {
  const set = trails.reduce((acc: Set<string>, t: [number, number][]) => { 
   const trailStart = t[0];
   const trailEnd = t[t.length-1];
   const hash = `${trailStart[0]}${trailStart[1]}${trailEnd[0]}${trailEnd[1]}`
   return new Set([...acc, hash]);
  }, new Set());
  return set.size;
};


const input = readInput();

const trailHeads = findTrailHeads(readInput());

const scores = trailHeads.map((th) => countUniqueTrails(findPaths(input, th, [th])));
const ratings = trailHeads.map((th) => findPaths(input, th, [th]).length);

console.log(scores);

console.log("Day 10 Part 1 Result: " + scores.reduce((acc, x) => acc + x));
console.log("Day 10 Part 2 Result: " + ratings.reduce((acc, x) => acc + x));
