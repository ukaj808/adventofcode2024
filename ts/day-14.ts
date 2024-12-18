import * as fs from 'fs';
import * as path from 'path';

type Robot = {
  position: { x: number, y: number },
  velocity: { x: number, y: number }
};

const readInput = (): Robot[] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-14-input.txt"), 'utf-8')
    .trim()
    .split('\n')
    .map((line: string) => {
	const nums = line.match(/-?\d+/g);
	return { position: { x: parseInt(nums![0]), y: parseInt(nums![1]) }, velocity: { x: parseInt(nums![2]), y: parseInt(nums![3]) } };
    });
};

const moveRobot = (tilesWide: number, tilesTall: number, r: Robot): Robot => {
  let newX;
  if (r.position.x + r.velocity.x < 0) {
    newX = tilesWide - Math.abs(r.position.x + r.velocity.x);
  } else if (r.position.x + r.velocity.x >= tilesWide) {
    newX = Math.abs(tilesWide - (r.position.x + r.velocity.x));
  } else {
    newX = r.position.x + r.velocity.x;
  }
  let newY;
  if (r.position.y + r.velocity.y < 0) {
    newY = tilesTall - Math.abs(r.position.y + r.velocity.y);
  } else if (r.position.y + r.velocity.y > tilesTall - 1) {
    newY = Math.abs(tilesTall - (r.position.y + r.velocity.y));
  } else {
    newY = r.position.y + r.velocity.y;
  }
  return {
    position: {
      x: newX,
      y: newY
    },
    velocity: r.velocity
  };
};

const robots = readInput();

const moveNTimes = (n: number) => { return Array.from({length: n}, (r: Robot) => moveRobot) };

const tilesWide = 101;
const tilesTall = 103;

const moveRobotsNTimes = (seconds: number) => robots.map((r) => moveNTimes(seconds).reduce((r, fn) => fn(tilesWide, tilesTall, r), r));

/*
const robotsInQuadrants = moveRobotsNTimes(100).reduce(([q1, q2, q3, q4]: [number, number, number, number], r: Robot) => {
  const middleCol = Math.floor(tilesWide / 2);
  const middleRow = Math.floor(tilesTall / 2);
  let result: [number, number, number, number];
  if (r.position.x < middleCol && r.position.y < middleRow) result = [q1 + 1, q2, q3, q4]
  else if (r.position.x > middleCol && r.position.y < middleRow) result = [q1, q2 + 1, q3, q4]
  else if (r.position.x < middleCol && r.position.y > middleRow) result = [q1, q2, q3 + 1, q4];
  else if (r.position.x > middleCol && r.position.y > middleRow) result = [q1, q2, q3, q4 + 1];
  else result = [q1, q2, q3, q4];
  return result;
}, [0, 0, 0, 0]);
*/

for (let i = 0; i < 1000000; i++) {
  const robots = moveRobotsNTimes(i);
  const grid = Array.from({length: tilesTall}, () => Array.from({length: tilesWide}, () => ""));
  const robotGrid = grid.map((row, i) => row.map((val, j) => {
    const r = robots.find((r) => r.position.x === j && r.position.y === i);
    if (r) {
      return '#';
    } else return '.';
  }));
  const patternDetected = false;

  for (let rowNum = 0; rowNum < robotGrid.length; rowNum++) {
    for (let colNum = 0; colNum < robotGrid[0].length; colNum++) {
    }
  } 

  if (patternDetected) {
    for (let j = 0; j < robotGrid.length; j++) {
      let ln = '';
      for (let g = 0; g < robotGrid[0].length; g++) {
        ln = ln + robotGrid[j][g];
      }
      console.log(ln + '\n');
    }
  }
}


