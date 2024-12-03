import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-3-input.txt"), 'utf-8')
};

const isDigit = (char: string): boolean => {
  const digitRegex = /^-?\d$/;
  return digitRegex.test(char);
}

const parseMul = (mul: string): Mul => {
 // parse numbers from string that looks like mul(123,123)
 const regex = /^mul\((\d{1,3}),(\d{1,3})\)$/;
 return { instruct: "do", x: parseInt(mul.match(regex)![1]), y: parseInt(mul.match(regex)![2]) };
};

type Mul = { instruct: "do" | "don't", x: number, y: number };
type MulAcc = { enabled: boolean, doFunc: string, mulFunc: string, muls: Mul[] };

const getAllMuls = (input: string): Mul[] => {
  const mulFuncStartWithNumRegex = /^mul\(\d{1,3}$/;
  const mulFuncStartWithNumWithRemRegex = /^mul\(\d{1,2}$/; //mul(1 or mul(12
  const mulFuncStartWithNumAndCommaRegex = /^mul\(\d{1,3},$/; //mul(1, or mul(12, or mul(123,
  const mulFuncStartWithNumCommaAndNumRegex = /^mul\(\d{1,3},\d{1,3}$/;//mul(1,1 or mul(1,12 or mul(12, 1 or mul(12, 12 or mul(123, 1 or mul(123, 12
  const mulFuncStartWithNumCommaAndNumWithRemRegex = /^mul\(\d{1,3},\d{1,2}$/;//mul(1,1 or mul(1,12 or mul(12, 1 or mul(12, 12 or mul(123, 1 or mul(123, 12

  const chars = input.split('');
  const result = chars.reduce((acc: MulAcc, c: string) => {
    if (c === "d") {
      if (acc.doFunc !== "") return { ...acc, doFunc: "", mulFunc: "" };
      return {
        ...acc,
	doFunc: "d",
	mulFunc: ""
      };
    } else if (c === "o") {
      if (acc.doFunc !== "d") return { ...acc, doFunc: "", mulFunc: "" };
      return {
	...acc,
	doFunc: "do",
        mulFunc: ""
      };
    } else if (c === "n") {
      if (acc.doFunc !== "do") return { ...acc, doFunc: "", mulFunc: "" };
      return {
	...acc,
	doFunc: "don",
        mulFunc: ""
      };
    } else if (c === "'") {
      if (acc.doFunc !== "don") return { ...acc, doFunc: "", mulFunc: "" };
      return {
	...acc,
	doFunc: "don'",
        mulFunc: ""
      };
    } else if (c === "t") {
      if (acc.doFunc !== "don'") return { ...acc, doFunc: "", mulFunc: "" };
      return {
	...acc,
	doFunc: "don't",
        mulFunc: ""
      };
    } else if (c === "m") {
      if (acc.mulFunc !== "") return { ...acc, doFunc: "", mulFunc: "" };
      return {
	...acc,
	doFunc: "",
        mulFunc: "m",
      };
    } else if (c ==="u") {
      if (acc.mulFunc !== "m") return { ...acc, doFunc: "", mulFunc: "" };
      return {
        ...acc,
	doFunc: "",
	mulFunc: "mu"
      }
    } else if (c === "l") {
      if (acc.mulFunc !== "mu") return { ...acc, doFunc: "", mulFunc: "" };
      return {
        ...acc,
	doFunc: "",
	mulFunc: "mul"
      }
    } else if (c === "(") {
      if (acc.mulFunc !== "mul" 
        && acc.doFunc !== "do" 
	&& acc.doFunc !== "don't") return { ...acc, doFunc: "", mulFunc: "" };
      if (acc.mulFunc === "mul") return { ...acc, doFunc: "", mulFunc: "mul(" };
      if (acc.doFunc === "do") return { ...acc, doFunc: "do(", mulFunc: "" };
      if (acc.doFunc === "don't") return { ...acc, doFunc: "don't(", mulFunc: "" };
      return { ...acc }; // impossible
    } else if (isDigit(c)) {
            if (acc.mulFunc !== "mul(" 
	  && !mulFuncStartWithNumWithRemRegex.test(acc.mulFunc)
	  && !mulFuncStartWithNumAndCommaRegex.test(acc.mulFunc)
	  && !mulFuncStartWithNumCommaAndNumWithRemRegex.test(acc.mulFunc)) return { ...acc, doFunc: "", mulFunc: "" };
      return { ...acc, doFunc: "", mulFunc: acc.mulFunc + c }
    } else if (c === ",") {
	if (!mulFuncStartWithNumRegex.test(acc.mulFunc)) return { ...acc, doFunc: "", mulFunc: "" };
	return { ...acc, doFunc: "", mulFunc: acc.mulFunc + "," };
    } else if (c === ")") {
	if (!mulFuncStartWithNumCommaAndNumRegex.test(acc.mulFunc)
	   && acc.doFunc !== "do(" 
           && acc.doFunc !== "don't(") return { ...acc, doFunc: "", mulFunc: "" };
	if (mulFuncStartWithNumCommaAndNumRegex.test(acc.mulFunc)) {
	  const mul = parseMul(acc.mulFunc + ")");
	  const instruct: "do" | "don't" = acc.enabled ? "do" : "don't"
	  return {...acc, doFunc: "", mulFunc: "", muls: [...acc.muls, { ...mul, instruct }]};
	}
	if (acc.doFunc === "do(") return {...acc, enabled: true, doFunc: "", mulFunc: ""};
	if (acc.doFunc === "don't(") return {...acc, enabled: false, doFunc: "", mulFunc: ""};
	return { ...acc };
    } else {
	return {
	  ...acc,
	  doFunc: "",
	  mulFunc: "",
	};
    }
  }, { enabled: true, doFunc: "", mulFunc: "", muls: []});
  return result.muls;
};

const day3p1Result = 
  getAllMuls(readInput())
  .map((mul) =>  mul.x * mul.y)
  .reduce((acc, x) => acc + x);

const day3p2Result =
  getAllMuls(readInput())
  .reduce((acc, mul) => {
    if (mul.instruct === "do") return acc + (mul.x * mul.y);
    return acc;
  }, 0);


console.log("Day 3 Part 1 Result: " + day3p1Result);
console.log("Day 3 Part 2 Result: " + day3p2Result);
