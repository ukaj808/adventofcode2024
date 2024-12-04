import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-4-input.txt"), 'utf-8')
    .split("\n")
    .map((row) => row.split(""));
};

type CharOccurence = { x: number, y: number, char: string  };

type StringOccurence = { str: string, charOccurences: CharOccurence[] };

const findStringOccursInCharMatrix = (str: string, m: string[][]): StringOccurence[] => {
  if (str === "") return [];
  const result = m.reduce((acc: StringOccurence[], row: string[], rowIndex: number) => {
    return [...acc, ...row.reduce((akk: StringOccurence[], _: string, colIndex: number) => {
      const result = [...akk];

      const checkRight = str.split("").reduce((aqq: CharOccurence[], c, i) => {
        if (c === row.slice(colIndex)[i]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex, y: colIndex + i, char: c }]
	}
	return [];
      }, []);
      if (checkRight.length > 0) result.push({ str, charOccurences: checkRight });

      const checkRightDown = str.split("").reduce((aqq: CharOccurence[], c, i) => {
        if (c === m.slice(rowIndex)[i]?.slice(colIndex)[i]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex + i, y: colIndex + i, char: c }]
	}
	return [];
      }, []);
      if (checkRightDown.length > 0) result.push({ str, charOccurences: checkRightDown });

      const checkDown = str.split("").reduce((aqq: CharOccurence[], c, i) => {
        if (c === m.slice(rowIndex)[i]?.[colIndex]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex + i, y: colIndex, char: c }]
	}
	return [];
      }, []);
      if (checkDown.length > 0) result.push({ str, charOccurences: checkDown });

      const checkLeftDown = str.split("").reduce((aqq: CharOccurence[], c, i) => {
	if (c === m.slice(rowIndex)[i]?.[colIndex - i]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex + i, y: colIndex - i, char: c }]
	}
	return [];
      }, []);
      if (checkLeftDown.length > 0) result.push({ str, charOccurences: checkLeftDown });

      const checkLeft = str.split("").reduce((aqq: CharOccurence[], c, i) => {
        if (c === row.slice(0, colIndex + 1).reverse()[i]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex, y: colIndex - i, char: c }]
	}
	return [];
      }, []);
      if (checkLeft.length > 0) result.push({ str, charOccurences: checkLeft });

      const checkLeftUp = str.split("").reduce((aqq: CharOccurence[], c, i) => {
	if (c === m.slice(0, rowIndex + 1).reverse()[i]?.[colIndex - i]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex - i, y: colIndex - i, char: c }]
	}
	return [];
      }, []);
      if (checkLeftUp.length > 0) result.push({ str, charOccurences: checkLeftUp });

      const checkUp = str.split("").reduce((aqq: CharOccurence[], c, i) => {
	if (c === m.slice(0, rowIndex + 1).reverse()[i]?.[colIndex]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex - i, y: colIndex, char: c }]
	}
	return [];
      }, []);
      if (checkUp.length > 0) result.push({ str, charOccurences: checkUp });

      const checkRightUp = str.split("").reduce((aqq: CharOccurence[], c, i) => {
        if (c === m.slice(0, rowIndex + 1).reverse()[i]?.[colIndex + i]) {
	  return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex - i, y: colIndex + i, char: c }]
	}
	return [];
      }, []);
      if (checkRightUp.length > 0) result.push({ str, charOccurences: checkRightUp });

      return result;
    }, [])];
  }, []);
  return result;
};

const day4p1Result = findStringOccursInCharMatrix("XMAS", readInput()).map((x) => {
  console.log(`String Occurence: str: ${x.str}, charOccurences: ${x.charOccurences.map((y) => `x: ${y.x}, y: ${y.y}, char: ${y.char}`).join(", ")}`);
  return x;
}).length;

console.log("Day 4 Part 1 Result " + day4p1Result);
