import * as fs from 'fs';
import * as path from 'path';

type PageOrderingRules = [number, number][]

const readInput = (): { rules: Map<number, number[]>, updates: number[][] } => {
  const split1 = fs.readFileSync(path.join(__dirname, "../inputs/day-5-input.txt"), 'utf-8')
    .split("\n\n")
  const rules = 
    split1[0]
    .split("\n")
    .reduce((acc, ln) => {
      const nums = ln.split("|");
      const firstNum = parseInt(nums[0]);
      const secNum = parseInt(nums[1]);
      if (acc.has(firstNum)) {
        acc.set(firstNum, [...acc.get(firstNum)!, secNum]);
	return acc;
      }
      acc.set(firstNum, [secNum]);
      return acc;
    }, new Map<number, number[]>());
  const updates = 
    split1[1]
    .split("\n")
    .filter((ln) => ln.length > 0)
    .reduce((acc: number[][], ln) => {
      return [...acc, ln.split(",").map((s) => parseInt(s))]
    }, [])
  return { rules, updates };
};

const isUpdateCorrect = (rules: Map<number, number[]>, update: number[]): boolean => {
  let result = true;

  for (let i = 0; i < update.length; i++) {
    const rule = rules.get(update[i])!;
    if (!rule) {
      continue;
    }
    for (let j = 0; j < rule.length; j++) {
      const indexOfRuleNum = update.findIndex((n) => n === rule[j]);
      if (indexOfRuleNum === -1) {
	continue;
      }
      result = result && (i < indexOfRuleNum)
    }
  };
  return result;
}

const fixIncorrectUpdate = (rules: Map<number, number[]>, update: number[]): number[] => {
  for (let i = 0; i < update.length;) {
    const rulesForUpdateNum = rules.get(update[i]);
    if (!rulesForUpdateNum){ 
       i++;
       continue;
    }
    let reset = false;
    for (let j = 0; j < rulesForUpdateNum.length; j++) {
      const indexOfRuleNum = update.findIndex((n) => n === rulesForUpdateNum[j]);
      if (indexOfRuleNum === -1) continue;
      if (i < indexOfRuleNum) continue;
      [update[i], update[indexOfRuleNum]] = [update[indexOfRuleNum], update[i]]
      reset = true;
      break;
    }
    if (reset) {
      i = 0;
      continue;
    }
    i++;
  };
  return update;
};

const input = readInput();

const middleNumbersOfCorrectUpdates = 
  input.updates
  .filter((u) => { 
     return isUpdateCorrect(input.rules, u) 
  })
  .map((u) => u[Math.floor(u.length / 2)]);

const middleNumbersOfCorrectedUpdates = input.updates
  .filter((u) => !isUpdateCorrect(input.rules, u))
  .map((u) => fixIncorrectUpdate(input.rules, u))
  .map((u) => u[Math.floor(u.length / 2)]);


console.log("Day 5 Part 1 Result: " + middleNumbersOfCorrectUpdates.reduce((acc, n) => acc + n));

console.log("Day 5 Part 2 Result: " + middleNumbersOfCorrectedUpdates.reduce((acc, n) => acc + n));
