import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-8-input.txt"), 'utf-8').split('\n')
    .filter((ln: string) => ln !== "")
    .reduce((acc: string[][], ln: string) => [...acc, ln.split("")], []);
};

type Antenna = 
  { x: number,
    y: number, value: string 
  };

type AntennaLine = 
  { 
    antennaPair: [Antenna, Antenna], 
    antiNodeIndexes: [[number, number][], [number, number][]]
  };


const calculateAntiNodeIndexesFromAntennaPair = (antennaPair: [Antenna, Antenna], rows: number, cols: number, resonant: boolean = false): [[number, number][], [number, number][]] => {
  const xDiff = Math.abs(antennaPair[0].x - antennaPair[1].x);
  const yDiff = Math.abs(antennaPair[0].y - antennaPair[1].y);
  if (antennaPair[0].x == antennaPair[1].x) {
      const leftAntenna = antennaPair[0].y < antennaPair[1].y ? antennaPair[0] : antennaPair[1];
      const rightAntenna = antennaPair[0].y > antennaPair[1].y ? antennaPair[0] : antennaPair[1];
      if (resonant) {
	let leftAntiNodeYIndex = leftAntenna.y - yDiff;
	let rightAntiNodeYIndex = rightAntenna.y + yDiff;
        let leftAntiNodes: [number, number][] = [];
	let rightAntiNodes: [number, number][] = [];
	let loob = false;
	let roob = false;
	while (!loob) {
	  if (leftAntiNodeYIndex < 0) { loob = true; continue; }
	  leftAntiNodes.push([antennaPair[0].x, leftAntiNodeYIndex]);
	  leftAntiNodeYIndex = leftAntiNodeYIndex - yDiff;
	}
	leftAntiNodes.push([leftAntenna.x, leftAntenna.y]);
	while (!roob) {
	  if (rightAntiNodeYIndex >= cols) { roob = true; continue; }
	  rightAntiNodes.push([antennaPair[0].x, rightAntiNodeYIndex]);
	  rightAntiNodeYIndex = rightAntiNodeYIndex + yDiff;
	}
	rightAntiNodes.push([rightAntenna.x, rightAntenna.y]);
	return [leftAntiNodes, rightAntiNodes];
      } else {
	const leftAntiNodeYIndex = leftAntenna.y - yDiff;
	const rightAntiNodeYIndex = rightAntenna.y + yDiff;
	const leftAntiNode: [number, number][] = leftAntiNodeYIndex >= 0 ? [[antennaPair[0].x, leftAntiNodeYIndex]] : [];
	const rightAntiNode: [number, number][] = rightAntiNodeYIndex < cols ? [[antennaPair[0].x, rightAntiNodeYIndex]] : [];
        return [leftAntiNode, rightAntiNode];
      }
  } else if (antennaPair[0].y == antennaPair[1].y) {
      const topAntenna = antennaPair[0].x < antennaPair[1].x ? antennaPair[0] : antennaPair[1];
      const bottomAntenna = antennaPair[0].x > antennaPair[1].x ? antennaPair[0] : antennaPair[1];
      if (resonant) {
	let topAntiNodeXIndex = topAntenna.x - xDiff;
	let bottomAntiNodeXIndex = bottomAntenna.x + xDiff;
	let topAntiNodes: [number, number][] = [];
	let bottomAntiNodes: [number, number][] = [];
	let toob = false;
	let boob = false;
	while (!toob) {
	  if (topAntiNodeXIndex < 0) { toob = true; continue; }
	  topAntiNodes.push([topAntiNodeXIndex, antennaPair[0].y]);
	  topAntiNodeXIndex = topAntiNodeXIndex - xDiff;
	}
	topAntiNodes.push([topAntenna.x, topAntenna.y]);
	while (!boob) {
	  if (bottomAntiNodeXIndex >= rows) { boob = true; continue; }
	  bottomAntiNodes.push([bottomAntiNodeXIndex, antennaPair[0].y]);
	  bottomAntiNodeXIndex = bottomAntiNodeXIndex + xDiff;
	}
	bottomAntiNodes.push([bottomAntenna.x, bottomAntenna.y]);
	return [topAntiNodes, bottomAntiNodes];
      } else {
	const topAntiNodeXIndex = topAntenna.x - xDiff;
	const bottomAntiNodeXIndex = bottomAntenna.x + xDiff;
	const topAntiNode: [number, number][] = topAntiNodeXIndex >= 0 ? [[topAntiNodeXIndex, antennaPair[0].y]] : [];
	const bottomAntiNode: [number, number][] = bottomAntiNodeXIndex < rows ? [[bottomAntiNodeXIndex, antennaPair[0].y]] : [];
	return [topAntiNode, bottomAntiNode];
      }
  } else if (antennaPair[0].y < antennaPair[1].y && antennaPair[0].x < antennaPair[1].x) {
      const leftAntenna = antennaPair[0];
      const rightAntenna = antennaPair[1];
      if (resonant) {
        let leftAntiNodeXIndex = leftAntenna.x - xDiff;
	let leftAntiNodeYIndex = leftAntenna.y - yDiff;
	let rightAntiNodeXIndex = rightAntenna.x + xDiff;
	let rightAntiNodeYIndex = rightAntenna.y + yDiff;
	let leftAntiNodes: [number, number][] = [];
	let rightAntiNodes: [number, number][] = [];
	let loob = false;
	let roob = false;
	while (!loob) {
	  if (leftAntiNodeXIndex < 0 || leftAntiNodeYIndex < 0) { loob = true; continue; }
	  leftAntiNodes.push([leftAntiNodeXIndex, leftAntiNodeYIndex]);
	  leftAntiNodeXIndex = leftAntiNodeXIndex - xDiff;
	  leftAntiNodeYIndex = leftAntiNodeYIndex - yDiff;
	}
	leftAntiNodes.push([leftAntenna.x, leftAntenna.y]);
	while (!roob) {
	  if (rightAntiNodeXIndex >= rows || rightAntiNodeYIndex >= cols) { roob = true; continue; }
	  rightAntiNodes.push([rightAntiNodeXIndex, rightAntiNodeYIndex]);
	  rightAntiNodeXIndex = rightAntiNodeXIndex + xDiff;
	  rightAntiNodeYIndex = rightAntiNodeYIndex + yDiff;
	}
	rightAntiNodes.push([rightAntenna.x, rightAntenna.y]);
	return [leftAntiNodes, rightAntiNodes];
      } else {
	const leftAntiNodeXIndex = leftAntenna.x - xDiff;
	const leftAntiNodeYIndex = leftAntenna.y - yDiff;
	const rightAntiNodeXIndex = rightAntenna.x + xDiff;
	const rightAntiNodeYIndex = rightAntenna.y + yDiff;
	const leftAntiNode: [number, number][] = leftAntiNodeXIndex >= 0 && leftAntiNodeYIndex >= 0 ? [[leftAntiNodeXIndex, leftAntiNodeYIndex]] : [];
	const rightAntiNode: [number, number][] = rightAntiNodeXIndex < rows && rightAntiNodeYIndex < cols ? [[rightAntiNodeXIndex, rightAntiNodeYIndex]] : [];
	return [leftAntiNode, rightAntiNode];
      }
  } else if (antennaPair[0].y < antennaPair[1].y) {
      const leftAntenna = antennaPair[0];
      const rightAntenna = antennaPair[1];
      if (leftAntenna.x < rightAntenna.x) {
	if (resonant) {
	  let leftAntiNodeXIndex = leftAntenna.x - xDiff;
	  let leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  let rightAntiNodeXIndex = rightAntenna.x + xDiff;
	  let rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  let leftAntiNodes: [number, number][] = [];
	  let rightAntiNodes: [number, number][] = [];
	  let loob = false;
	  let roob = false;
	  while (!loob) {
	    if (leftAntiNodeXIndex < 0 || leftAntiNodeYIndex < 0) { loob = true; continue; }
	    leftAntiNodes.push([leftAntiNodeXIndex, leftAntiNodeYIndex]);
	    leftAntiNodeXIndex = leftAntiNodeXIndex - xDiff;
	    leftAntiNodeYIndex = leftAntiNodeYIndex - yDiff;
	  }
	  leftAntiNodes.push([leftAntenna.x, leftAntenna.y]);
	  while (!roob) {
	    if (rightAntiNodeXIndex >= rows || rightAntiNodeYIndex >= cols) { roob = true; continue; }
	    rightAntiNodes.push([rightAntiNodeXIndex, rightAntiNodeYIndex]);
	    rightAntiNodeXIndex = rightAntiNodeXIndex + xDiff;
	    rightAntiNodeYIndex = rightAntiNodeYIndex + yDiff;
	  }
	  rightAntiNodes.push([rightAntenna.x, rightAntenna.y]);
	  return [leftAntiNodes, rightAntiNodes];
	} else {
	  const leftAntiNodeXIndex = leftAntenna.x - xDiff;
	  const leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  const rightAntiNodeXIndex = rightAntenna.x + xDiff;
	  const rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  const leftAntiNode: [number, number][] = leftAntiNodeXIndex >= 0 && leftAntiNodeYIndex >= 0 ? [[leftAntiNodeXIndex, leftAntiNodeYIndex]] : [];
	  const rightAntiNode: [number, number][] = rightAntiNodeXIndex < rows && rightAntiNodeYIndex < cols ? [[rightAntiNodeXIndex, rightAntiNodeYIndex]] : [];
	  return [leftAntiNode, rightAntiNode];
	}
      } else {
	if (resonant) {
	  let leftAntiNodeXIndex = leftAntenna.x + xDiff;
	  let leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  let rightAntiNodeXIndex = rightAntenna.x - xDiff;
	  let rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  let leftAntiNodes: [number, number][] = [];
	  let rightAntiNodes: [number, number][] = [];
	  let loob = false;
	  let roob = false;
	  while (!loob) {
	    if (leftAntiNodeXIndex >= rows || leftAntiNodeYIndex < 0) { loob = true; continue; }
	    leftAntiNodes.push([leftAntiNodeXIndex, leftAntiNodeYIndex]);
	    leftAntiNodeXIndex = leftAntiNodeXIndex + xDiff;
	    leftAntiNodeYIndex = leftAntiNodeYIndex - yDiff;
	  }
	  leftAntiNodes.push([leftAntenna.x, leftAntenna.y]);
	  while (!roob) {
	    if (rightAntiNodeXIndex < 0 || rightAntiNodeYIndex >= cols) { roob = true; continue; }
	    rightAntiNodes.push([rightAntiNodeXIndex, rightAntiNodeYIndex]);
	    rightAntiNodeXIndex = rightAntiNodeXIndex - xDiff;
	    rightAntiNodeYIndex = rightAntiNodeYIndex + yDiff;
	  }
	  rightAntiNodes.push([rightAntenna.x, rightAntenna.y]);
	  return [leftAntiNodes, rightAntiNodes];
	} else {
	  const leftAntiNodeXIndex = leftAntenna.x + xDiff;
	  const leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  const rightAntiNodeXIndex = rightAntenna.x - xDiff;
	  const rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  const leftAntiNode: [number, number][] = leftAntiNodeXIndex < rows && leftAntiNodeYIndex >= 0 ? [[leftAntiNodeXIndex, leftAntiNodeYIndex]] : [];
	  const rightAntiNode: [number, number][] = rightAntiNodeXIndex >= 0 && rightAntiNodeYIndex < cols ? [[rightAntiNodeXIndex, rightAntiNodeYIndex]] : [];
	  return [leftAntiNode, rightAntiNode];
	}
      }
  } else {
      const leftAntenna = antennaPair[1];
      const rightAntenna = antennaPair[0];
      if (leftAntenna.x < rightAntenna.x) {
	if (resonant) {
	  let leftAntiNodeXIndex = leftAntenna.x - xDiff;
	  let leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  let rightAntiNodeXIndex = rightAntenna.x + xDiff;
	  let rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  let leftAntiNodes: [number, number][] = [];
	  let rightAntiNodes: [number, number][] = [];
	  let loob = false;
	  let roob = false;
	  while (!loob) {
	    if (leftAntiNodeXIndex < 0 || leftAntiNodeYIndex < 0) { loob = true; continue; }
	    leftAntiNodes.push([leftAntiNodeXIndex, leftAntiNodeYIndex]);
	    leftAntiNodeXIndex = leftAntiNodeXIndex - xDiff;
	    leftAntiNodeYIndex = leftAntiNodeYIndex - yDiff;
	  }
	  leftAntiNodes.push([leftAntenna.x, leftAntenna.y]);
	  while (!roob) {
	    if (rightAntiNodeXIndex >= rows || rightAntiNodeYIndex >= cols) { roob = true; continue; }
	    rightAntiNodes.push([rightAntiNodeXIndex, rightAntiNodeYIndex]);
	    rightAntiNodeXIndex = rightAntiNodeXIndex + xDiff;
	    rightAntiNodeYIndex = rightAntiNodeYIndex + yDiff;
	  }
	  rightAntiNodes.push([rightAntenna.x, rightAntenna.y]);
	  return [leftAntiNodes, rightAntiNodes];
	} else {
	  const leftAntiNodeXIndex = leftAntenna.x - xDiff;
	  const leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  const rightAntiNodeXIndex = rightAntenna.x + xDiff;
	  const rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  const leftAntiNode: [number, number][] = leftAntiNodeXIndex >= 0 && leftAntiNodeYIndex >= 0 ? [[leftAntiNodeXIndex, leftAntiNodeYIndex]] : [];
	  const rightAntiNode: [number, number][] = rightAntiNodeXIndex < rows && rightAntiNodeYIndex < cols ? [[rightAntiNodeXIndex, rightAntiNodeYIndex]] : [];
	  return [leftAntiNode, rightAntiNode];
	}
      } else {
	if (resonant) {
	  let leftAntiNodeXIndex = leftAntenna.x + xDiff;
	  let leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  let rightAntiNodeXIndex = rightAntenna.x - xDiff;
	  let rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  let leftAntiNodes: [number, number][] = [];
	  let rightAntiNodes: [number, number][] = [];
	  let loob = false;
	  let roob = false;
	  while (!loob) {
	    if (leftAntiNodeXIndex >= rows || leftAntiNodeYIndex < 0) { loob = true; continue; }
	    leftAntiNodes.push([leftAntiNodeXIndex, leftAntiNodeYIndex]);
	    leftAntiNodeXIndex = leftAntiNodeXIndex + xDiff;
	    leftAntiNodeYIndex = leftAntiNodeYIndex - yDiff;
	  }
	  leftAntiNodes.push([leftAntenna.x, leftAntenna.y]);
	  while (!roob) {
	    if (rightAntiNodeXIndex < 0 || rightAntiNodeYIndex >= cols) { roob = true; continue; }
	    rightAntiNodes.push([rightAntiNodeXIndex, rightAntiNodeYIndex]);
	    rightAntiNodeXIndex = rightAntiNodeXIndex - xDiff;
	    rightAntiNodeYIndex = rightAntiNodeYIndex + yDiff;
	  }
	  rightAntiNodes.push([rightAntenna.x, rightAntenna.y]);
	  return [leftAntiNodes, rightAntiNodes];
	} else {
	  const leftAntiNodeXIndex = leftAntenna.x + xDiff;
	  const leftAntiNodeYIndex = leftAntenna.y - yDiff;
	  const rightAntiNodeXIndex = rightAntenna.x - xDiff;
	  const rightAntiNodeYIndex = rightAntenna.y + yDiff;
	  const leftAntiNode: [number, number][] = leftAntiNodeXIndex < rows && leftAntiNodeYIndex >= 0 ? [[leftAntiNodeXIndex, leftAntiNodeYIndex]] : [];
	  const rightAntiNode: [number, number][] = rightAntiNodeXIndex >= 0 && rightAntiNodeYIndex < cols ? [[rightAntiNodeXIndex, rightAntiNodeYIndex]] : [];
	  return [leftAntiNode, rightAntiNode];
	}
      }
  };
};

const generateAntennaLinesFromMatchingAntennas = (antennas: Antenna[], rows: number, cols: number, resonant: boolean = false): AntennaLine[] => {
  return antennas.reduce((acc: AntennaLine[], a: Antenna, i) => {
    if (i === antennas.length - 1) return acc;
    const restOf = antennas.slice(i + 1);
    return [...acc, ...restOf.reduce((akk: AntennaLine[], an: Antenna) => {
      const antennaLine: AntennaLine = { antennaPair: [a, an], antiNodeIndexes: calculateAntiNodeIndexesFromAntennaPair([a, an], rows, cols, resonant) };
      return [...akk, antennaLine];
    }, [])];
  }, []);
};

const generateAntennaMap = (input: string[][]): Map<string, Antenna[]> => { 
  return input.reduce((acc: Map<string, Antenna[]>, rowArray: string[], rowIndex: number) => {
    return rowArray.reduce((akk: Map<string, Antenna[]>, char: string, colIndex: number) => {
	if (input[rowIndex][colIndex] !== ".") {
	  if (akk.has(char)) {
	    akk.set(char, [...akk.get(char)!, { x: rowIndex, y: colIndex, value: char }]);
	    return akk;
	  }
	  akk.set(char, [{x: rowIndex, y: colIndex, value: char}]);
	  return akk;
	}
	return akk;
    }, acc);
  }, new Map());
};

const antennaMapToAntennaLines = (antennaMap: Map<string, Antenna[]>, rows: number, cols: number, resonant: boolean = false): AntennaLine[] => {
  return Array.from(antennaMap.entries()).reduce((acc: AntennaLine[], [_, v]: [string, Antenna[]]) => {
    return [...acc, ...generateAntennaLinesFromMatchingAntennas(v, rows, cols, resonant)];
  }, []);
};

const input = readInput();

const antennaLines = antennaMapToAntennaLines(generateAntennaMap(input), input.length, input[0].length, true);

/*
const uniqueAntiNodeIndexes: Set<string> = antennaLines.reduce((acc: Set<string>, al: AntennaLine) => {
  const antiNodeIndexes = al.antiNodeIndexes;
  const antiNodeIndex1 = antiNodeIndexes[0];
  const antiNodeIndex2 = antiNodeIndexes[1];
  const set = new Set([...acc]);
  if (antiNodeIndex1[0] > 0 && antiNodeIndex1[0] < input.length && antiNodeIndex1[1] > 0 && antiNodeIndex1[1] < input[0].length) {
    set.add(`${antiNodeIndex1[0]},${antiNodeIndex1[1]}`);
  }
  if (antiNodeIndex2[0] > 0 && antiNodeIndex2[0] < input.length && antiNodeIndex2[1] > 0 && antiNodeIndex2[1] < input[0].length) {
    set.add(`${antiNodeIndex2[0]},${antiNodeIndex2[1]}`);
  }

  return set;
}, new Set());
*/

const uniqueAntiNodeIndexes: Set<string> = antennaLines
  .reduce((acc: [number, number][], al: AntennaLine) => [...acc, ...al.antiNodeIndexes[0], ...al.antiNodeIndexes[1]], [])
  .filter((an: [number, number]) => an[0] >= 0 && an[0] < input.length && an[1] >= 0 && an[1] < input[0].length)
  .reduce((acc: Set<string>, an: [number, number]) => {
    return new Set([...acc, `${an[0]},${an[1]}`]);
  }, new Set());


console.log("Day 8 Part 1 Result: " + uniqueAntiNodeIndexes.size);

