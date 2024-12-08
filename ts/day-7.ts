import * as fs from 'fs';
import * as path from 'path';

type Operator = "+" | "*";

const generateOperatorCombinations = (len: number) => {
    const operators = ["+", "*", "|"];
    const combinations = [];
    const totalCombinations = Math.pow(operators.length, len); // 3^length

    for (let i = 0; i < totalCombinations; i++) {
        let combination = '';
        let num = i;

        for (let j = 0; j < len; j++) {
            combination = operators[num % operators.length] + combination; // Choose operator
            num = Math.floor(num / operators.length); // Reduce the number
        }

        combinations.push(combination);
    }

    return combinations;
}

const readInput = (): [number, number[]][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-7-input.txt"), 'utf-8').split('\n')
    .filter((ln: string) => ln !== "")
    .reduce((acc: [number, number[]][], ln: string) => {
      const split = ln.split(":");
      const xs: [number, number[]] = [parseInt(split[0]), split[1].trim().split(" ").map((n) => parseInt(n))];
      return [...acc, xs];
    }, []);
};

const evaluate = (xs: number[], operators: string[]): number => {
  return xs.slice(1).reduce((acc: { total: number, opsLeft: string[] }, x) => {
    const op = acc.opsLeft.shift();
    if (op === "+") {
      acc.total = acc.total + x;
    } else if (op === "*") {
      acc.total = acc.total * x;
    } else {
	acc.total = parseInt(acc.total + '' + x);
    }
    return acc;
  }, { total: xs[0], opsLeft: [...operators] }).total;
};

const input = readInput();

const totalCalibrationResult = input.reduce((acc: number[], equation: [number, number[]]) => {
  const operatorConfigs = generateOperatorCombinations(equation[1].length - 1);
  console.log(operatorConfigs);
  return operatorConfigs.map((op) => op.split("")).reduce((akk: boolean, config: string[]) => {
    return akk || evaluate(equation[1], config) === equation[0];
  }, false) ? [...acc, equation[0]] : acc;
}, []).reduce((acc, x) => acc + x, 0);

console.log(totalCalibrationResult);
