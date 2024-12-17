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
	acc.prizeLocation = { x: 10000000000000 + parseInt(matched![1]), y: 10000000000000 + parseInt(matched![2]) };
      }
      return acc;
    }, { buttonA: { xMoves: 0, yMoves: 0 }, buttonB: { xMoves: 0, yMoves: 0 }, prizeLocation: { x: 0, y: 0 } });
  });
};

const play = (machine: Machine): PlayThrough[] => {


  const winningPlayThroughs: PlayThrough[] = [];

  const maximumBButtonPresses = Math.min(Math.floor(machine.prizeLocation.x / machine.buttonB.xMoves), Math.floor(machine.prizeLocation.y / machine.buttonB.yMoves));

  for (let i = 0; i < maximumBButtonPresses;) {
    // 94a + 22b = 8400
    // 94a = 8400 - 22b
    // a = (8400 - 22b) / 94
    const aButtonPresses = (machine.prizeLocation.x - (machine.buttonB.xMoves * i)) / machine.buttonA.xMoves;
    if (aButtonPresses % 1 !== 0) {
      continue;
    } 
    const bButtonPresses = i;

    const calculatedY = (machine.buttonA.yMoves * aButtonPresses) + (machine.buttonB.yMoves * bButtonPresses);

    const doesYMatch = (machine.prizeLocation.y === calculatedY);
    if (doesYMatch) {
      console.log(`aButtonPresses: ${aButtonPresses}, bButtonPresses: ${bButtonPresses}`);
      winningPlayThroughs.push({ aButtonPresses, bButtonPresses });
    }
  }

  return winningPlayThroughs;

};

const input = readInput();

const fewestTokensToWinAllPossiblePrizes = 
  input.map(play).map((playThroughs) => {
    if (playThroughs.length === 0) return 0;
    return playThroughs.reduce((acc, pt) => {
      const tokenCount = (pt.aButtonPresses * 3) + (pt.bButtonPresses * 1);
      if (tokenCount < acc) return tokenCount;
      return acc;
    }, Number.MAX_SAFE_INTEGER);
  }).reduce((acc, tokens) => acc + tokens);

console.log(fewestTokensToWinAllPossiblePrizes);
