import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-6-input.txt"), 'utf-8').split('\n')
    .filter((ln: string) => ln !== "")
    .reduce((acc: string[][], ln: string) => {
      return [...acc, ln.split("")]
    }, []);
};

const rowIncludesGuard = (row: string[]): boolean => {
  return row.includes("^") || row.includes(">") || row.includes("V") || row.includes("<");
};

const isGuard = (c: string): boolean => {
  return c === "^" || c === ">" || c === "V" || c === "<";
};

const isObstruction = (c: string): boolean => {
  return c === "#" || c === "0";
};

const isClear = (c: string): boolean => {
  return c === "." || c === "X";
};

const turnGuard = (c: string): string => {
  if (c === "^") return ">";
  if (c === ">") return "V";
  if (c === "V") return "<";
  if (c === "<") return "^";
  return "@";
}

const isOutOfBounds = (pos: [number, number], zeroBasedMapDimensions: [number, number]) => {
  return pos[0] < 0 || pos[0] > zeroBasedMapDimensions[0] || pos[1] < 0 || pos[1] > zeroBasedMapDimensions[1];
};

const nextPosition = (currentPos: [number, number], guard: string): [number, number] => {
  if (guard === "^") return [currentPos[0] - 1, currentPos[1]];
  if (guard === ">") return [currentPos[0], currentPos[1] + 1];
  if (guard === "V") return [currentPos[0] + 1, currentPos[1]];
  if (guard === "<") return [currentPos[0], currentPos[1] - 1];
  return currentPos;
}; 

const run = (map: string[][]): boolean => {
  const zeroBasedMapDimensions: [number, number] = [map.length - 1, map[0].length - 1];
  const guardStartingRow = map.findIndex(rowIncludesGuard);
  const guardStartingCol = map[guardStartingRow].findIndex(isGuard);
  const positionDirectionHashSet = new Set<string>();
  let guardsCurrentPosition: [number, number] = [map.findIndex(rowIncludesGuard),  guardStartingCol];
  let guardsCurrentDirection: string = map[guardsCurrentPosition[0]][guardsCurrentPosition[1]];
  let guardHasLeftTheMap = false;
  let loopDetected = false;
  while (!guardHasLeftTheMap && !loopDetected) {
    if (positionDirectionHashSet.has(`${guardsCurrentPosition[0]}-${guardsCurrentPosition[1]}-${guardsCurrentDirection}`)) {
      loopDetected = true;
      continue;
    }
    const nextPos = nextPosition(guardsCurrentPosition, map[guardsCurrentPosition[0]][guardsCurrentPosition[1]]);
    if (isOutOfBounds(nextPos, zeroBasedMapDimensions)) {
      map[guardsCurrentPosition[0]][guardsCurrentPosition[1]] = "X";
      guardHasLeftTheMap = true;
      continue;
    }
    const valueAtNextPos = map[nextPos[0]][nextPos[1]];
    if (isClear(valueAtNextPos)) {
      map[nextPos[0]][nextPos[1]] = guardsCurrentDirection;
      map[guardsCurrentPosition[0]][guardsCurrentPosition[1]] = "X";
      positionDirectionHashSet.add(`${guardsCurrentPosition[0]}-${guardsCurrentPosition[1]}-${guardsCurrentDirection}`);
      guardsCurrentPosition = nextPos;
    } else if (isObstruction(valueAtNextPos)) {
      positionDirectionHashSet.add(`${guardsCurrentPosition[0]}-${guardsCurrentPosition[1]}-${guardsCurrentDirection}`);
      guardsCurrentDirection = turnGuard(guardsCurrentDirection);
      map[guardsCurrentPosition[0]][guardsCurrentPosition[1]] = guardsCurrentDirection;
    } else {
      console.log("guardsCurrentPosition: ", guardsCurrentPosition);
      console.log("guardsCurrentDirection: ", guardsCurrentDirection);
      console.log(map);
      throw Error("Unexpected Behavior");
    }
  }
  return loopDetected;
};

const input = readInput();


const inputCopy = input.map((row) => [...row]);
run(inputCopy);

const day6p1Result = inputCopy
  .reduce((acc: number, row: string[]) => {
     const rowCount = row.reduce((akk, c) => {
       if (c === "X") return akk + 1;
       return akk;
     }, 0);
     return acc + rowCount;
  }, 0);

console.log("Day 6 Part 1 Result: " + day6p1Result);

const loopCausingPositions = input.reduce((acc: number, row: string[], i) => {
  const result = row.reduce((acc, _, j) => {
    const inputCopy = input.map(row => [...row]);
    if (isClear(inputCopy[i][j])) {
      inputCopy[i][j] = "0";
      if (run(inputCopy) === true) { 
        console.log("Loop Causing Position: ", i, j);
	return acc + 1 
      };
    }
    return acc;
  }, 0);
  return acc + result;
}, 0);

console.log("Day 6 part 2 Result: " + loopCausingPositions);
