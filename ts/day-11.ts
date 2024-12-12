import * as fs from 'fs';
import * as path from 'path';

const readInput = (): number[] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-11-input.txt"), 'utf-8')
  .trim()
  .split(' ')
  .map((n) => parseInt(n));
};

const genCacheKey = (stone: number, times: number) => `${stone}-${times}`;


const blinkXTimes = (stones: number[], times: number): number[] => {
  const stoneBlinkCountMap: Map<number, number> = new Map();
  const cache: Map<string, number[]> = new Map();  
  let timesBlinked = 0;
  const blink = (stones: number[]): number[] => {
    timesBlinked+=1;
    return stones.reduce((acc: number[], stone) => { const stoneBlinkCount = stoneBlinkCountMap.get(stone);
      if (stoneBlinkCount) {
        stoneBlinkCountMap.set(stone, stoneBlinkCount+1);
      } else {
	stoneBlinkCountMap.set(stone, 1);
      }
      const cacheKey = genCacheKey(stone, stoneBlinkCountMap.get(stone)!);
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
      let result;
      if (stone === 0) {
        result = [...acc, 1];
      } else if (((stone+'').length % 2) === 0) {
          const stoneAsString = stone+'';
	  const newStones: [number, number] = 
	    [parseInt((stoneAsString).substring(0, stoneAsString.length / 2)),
	      parseInt(stoneAsString.substring(stoneAsString.length / 2, stoneAsString.length))];
            result = [...acc, ...newStones];
      } else {
          result = [...acc, stone * 2024];
      }
      cache.set(cacheKey, result);
      
      return result;
    }, []);
  };
  return Array.from({length: times}, () => blink)
    .reduce((acc, blink) => { 
      const result = blink(acc); 
      console.log(result); 
      return result; }, 
    stones);
};




const blink = (stones: number[], timesLeft: number, cache: Map<string, number>): number => {
  if (timesLeft === 0) {
    return stones.length;
  }
  let res: number = 0;
  for (let i = 0; i < stones.length; i++) {
    const stone = stones[i];
    if (cache.has(constructCacheKey(stone, timesLeft))) {
      res += cache.get(constructCacheKey(stone, timesLeft))!;
    } else {
    if (stone === 0) {
      const blinked = blink([1], timesLeft - 1, cache);
      cache.set(constructCacheKey(stone, timesLeft), blinked);
      res += blinked;
    } else if (((stone+'').length % 2) === 0) {
      const stoneAsString = stone+'';
      const newStones: [number, number] = 
        [parseInt((stoneAsString).substring(0, stoneAsString.length / 2)),
          parseInt(stoneAsString.substring(stoneAsString.length / 2, stoneAsString.length))];
	const blinked = blink([ ...newStones], timesLeft - 1, cache);
	cache.set(constructCacheKey(stone, timesLeft), blinked);
        res += blinked;
    } else {
      const blinked = blink([stone * 2024], timesLeft - 1, cache);
      cache.set(constructCacheKey(stone, timesLeft), blinked);
      res += blinked;
    }
    }
  }

  return res;
}

const constructCacheKey = (stone: number, times: number) => {
  return `${stone}-${times}`;
};

/*

const cache: Map<string, number[]> = new Map();
const stones = readInput();
let result: number[] = [];

for (let i = 0; i < stones.length; i++) {
  const stone = stones[i];
  let stonesArr = [stone];
  for (let blinkCount = 1; blinkCount <= 75; blinkCount++) {
    const cacheKey = constructCacheKey(stone, blinkCount);
    if (cache.has(cacheKey)) {
      console.log("Cache hit");
      stonesArr = cache.get(cacheKey)!;
    } else {
      console.log("Cache miss, setting value: " + cacheKey);
      stonesArr = blink(stonesArr);
      cache.set(cacheKey, [...stonesArr]);
    }
  }
  result = [...result, ...stonesArr];
}

console.log("Day 1 Part 1 Result: " + result.length);


  else if (((stone+'').length % 2) === 0) {
    const stoneAsString = stone+'';
    const newStones: [number, number] = 
	  [parseInt((stoneAsString).substring(0, stoneAsString.length / 2)),
	    parseInt(stoneAsString.substring(stoneAsString.length / 2, stoneAsString.length))]; return [...blinkStone(newStones[0]), ...blinkStone(newStones[1])];
  }
  */

let input = readInput();

console.log(blink(input, 75, new Map()));

