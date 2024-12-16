import * as fs from 'fs';
import * as path from 'path';


type Machine = {
  buttonA: { xMoves: number, yMoves: number },
  buttonB: { xMoves: number, yMoves: number },
  prizeLocation: { x: number, y: number }
}

type PlayThrough = {
  aButtonPresses: number,
  bButtonPresses: number,
};

const readInput = (): Machine[] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-13-input.txt"), 'utf-8')
  .trim()
  .split('\n\n')
  .map((line: string) => line.split('\n'))
  .map((machineInfo: string[]) => {
    return machineInfo.reduce((acc: Machine, info, i) => {
      const movesReg = /X\+(\d+), Y\+(\d+)/;
      const prizeReg = /X=(\d+), Y=(\d+)/;
      if (i === 0) {
        const matched = info.match(movesReg);
	acc.buttonA = { xMoves: parseInt(matched![1]), yMoves: parseInt(matched![2]) };
      } else if (i === 1) {
	const matched = info.match(movesReg);
	acc.buttonB = { xMoves: parseInt(matched![1]), yMoves: parseInt(matched![2]) };
      } else {
	const matched = info.match(prizeReg);
	acc.prizeLocation = { x: parseInt(matched![1]), y: parseInt(matched![2]) };
      }
      return acc;
    }, { buttonA: { xMoves: 0, yMoves: 0 }, buttonB: { xMoves: 0, yMoves: 0 }, prizeLocation: { x: 0, y: 0 } });
  });
};

const play = (machine: Machine): PlayThrough[] => {

  const cache: Map<string, [number, number][]> = new Map();

  const goXAxis = (axPresses: number, bxPresses: number, xPrizeCoord: number): [number, number][] => {
    
    const key = `x-${axPresses}-${bxPresses}`;
   
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const calculatedXCoord = (axPresses * machine.buttonA.xMoves) + (bxPresses * machine.buttonB.xMoves);
    if (calculatedXCoord > xPrizeCoord) { 
      return []; 
    }
    if (calculatedXCoord === xPrizeCoord) { 
      return [[axPresses, bxPresses]];
    }

    let xResults: [number, number][] = [];

    if (calculatedXCoord + machine.buttonA.xMoves <= xPrizeCoord) {
       xResults = goXAxis(axPresses + 1, bxPresses, xPrizeCoord);
    }

    if (calculatedXCoord + machine.buttonB.xMoves <= xPrizeCoord) {
      xResults = [...xResults, ...goXAxis(axPresses, bxPresses + 1, xPrizeCoord)];
    }

    cache.set(key, xResults);

    return xResults;
  };

  const goYAxis = (ayPresses: number, byPresses: number, yPrizeCoord: number): [number, number][] => {

    const key = `y-${ayPresses}-${byPresses}`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const calculatedYCoord = (ayPresses * machine.buttonA.yMoves) + (byPresses * machine.buttonB.yMoves);
    if (calculatedYCoord > yPrizeCoord) return [];
    if (calculatedYCoord === yPrizeCoord) return [[ayPresses, byPresses]];


    let yResults: [number, number][] = [];

    if (calculatedYCoord + machine.buttonA.yMoves <= yPrizeCoord) {
      yResults = [...goYAxis(ayPresses + 1, byPresses, yPrizeCoord)];
    }

    if (calculatedYCoord + machine.buttonB.yMoves <= yPrizeCoord) {
      yResults = [...yResults, ...goYAxis(ayPresses, byPresses + 1, yPrizeCoord)];
    }

    cache.set(key, yResults);

    return yResults;
  };

  const abxCombinations: [number, number][] = goXAxis(0, 0, machine.prizeLocation.x);
  const abyCombinations: [number, number][] = goYAxis(0, 0, machine.prizeLocation.y);

  console.log(abxCombinations);
  console.log(abyCombinations);

  return abxCombinations.reduce((acc: PlayThrough[], abx) => {
    if (abyCombinations.some((aby: [number, number]) => abx[0] === aby[0] && abx[1] === aby[1])) {
      console.log('found a match');
      return [...acc, { aButtonPresses: abx[0], bButtonPresses: abx[1] }]
    }
    return acc;
  }, []);

};

const input = readInput();

/*
const fewestTokensToWinAllPossiblePrizes = 
  input.map(play).map((playThroughs) => {
    return playThroughs.reduce((acc, pt) => {
      const tokenCount = (pt.aButtonPresses * 3) + (pt.bButtonPresses * 1);
      if (tokenCount < acc) return tokenCount;
      return acc;
    }, Number.MAX_SAFE_INTEGER);
  }).reduce((acc, tokens) => acc + tokens);
  */

console.log(play(input[0]));
