import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-4-input.txt"), 'utf-8')
    .split("\n")
    .map((row) => row.split(""));
};

type CharOccurence = { x: number, y: number, char: string  };

type StringOccurence = { str: string, charOccurences: CharOccurence[], direction: Direction };

type Direction = "right" | "right-down" | "down" | "left-down" | "left" | "left-up" | "up" | "right-up";

const includesStringOccurence = (occurs: StringOccurence[], occur: StringOccurence) => {
  return occurs.some((o) => {
    return o.str === occur.str 
      && o.charOccurences.every((c, i) => c.x === occur.charOccurences[i].x 
      && c.y === occur.charOccurences[i].y 
      && c.char === occur.charOccurences[i].char);
  });
};

const findStringOccursInCharMatrix = (str: string, m: string[][], direction?: Direction[]): StringOccurence[] => {
  if (str === "") return [];

  if (str.length === 1) {
    return m.reduce((acc: StringOccurence[], row: string[], rowIndex: number) => {
      return [...acc, ...row.reduce((akk: StringOccurence[], c: string, colIndex: number) => {
        if (c === str) return [...akk, { str, charOccurences: [({ x: rowIndex, y: colIndex, char: c } as CharOccurence)], direction: ("right" as Direction) }];
	return akk;
      }, [])];
    }, []);
  }

  const result = m.reduce((acc: StringOccurence[], row: string[], rowIndex: number) => {
    return [...acc, ...row.reduce((akk: StringOccurence[], _: string, colIndex: number) => {
      const result = [...akk];

      if (!direction || direction.includes("right")) {
        const checkRight = str.split("").reduce((aqq: CharOccurence[], c, i) => {
          if (c === row.slice(colIndex)[i]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex, y: colIndex + i, char: c }]
	  }
	  return [];
        }, []);
        if (checkRight.length > 0) result.push({ str, charOccurences: checkRight, direction: "right" });
      }

      if (!direction || direction.includes("right-down")) {
        const checkRightDown = str.split("").reduce((aqq: CharOccurence[], c, i) => {
          if (c === m.slice(rowIndex)[i]?.slice(colIndex)[i]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex + i, y: colIndex + i, char: c }]
	  }
	  return [];
        }, []);
        if (checkRightDown.length > 0) result.push({ str, charOccurences: checkRightDown, direction: "right-down" });
      }

      if (!direction || direction.includes("down")) {
      const checkDown = str.split("").reduce((aqq: CharOccurence[], c, i) => {
          if (c === m.slice(rowIndex)[i]?.[colIndex]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex + i, y: colIndex, char: c }]
	  }
	  return [];
        }, []);
        if (checkDown.length > 0) result.push({ str, charOccurences: checkDown, direction: "down" });
      }


      if (!direction || direction.includes("left-down")) {
      const checkLeftDown = str.split("").reduce((aqq: CharOccurence[], c, i) => {
	  if (c === m.slice(rowIndex)[i]?.[colIndex - i]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex + i, y: colIndex - i, char: c }]
	  }
	  return [];
        }, []);
        if (checkLeftDown.length > 0) result.push({ str, charOccurences: checkLeftDown, direction: "left-down" });
      }

      if (!direction || direction.includes("left")) {
      const checkLeft = str.split("").reduce((aqq: CharOccurence[], c, i) => {
          if (c === row.slice(0, colIndex + 1).reverse()[i]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex, y: colIndex - i, char: c }]
	  }
	  return [];
        }, []);
        if (checkLeft.length > 0) result.push({ str, charOccurences: checkLeft, direction: "left" });
      }

      if (!direction || direction.includes("left-up")) {
      const checkLeftUp = str.split("").reduce((aqq: CharOccurence[], c, i) => {
	  if (c === m.slice(0, rowIndex + 1).reverse()[i]?.[colIndex - i]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex - i, y: colIndex - i, char: c }]
	  }
  	  return [];
        }, []);
        if (checkLeftUp.length > 0) result.push({ str, charOccurences: checkLeftUp, direction: "left-up" });
      }
  
      if (!direction || direction.includes("up")) {
        const checkUp = str.split("").reduce((aqq: CharOccurence[], c, i) => {
	  if (c === m.slice(0, rowIndex + 1).reverse()[i]?.[colIndex]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex - i, y: colIndex, char: c }]
	  }
	  return [];
        }, []);
        if (checkUp.length > 0) result.push({ str, charOccurences: checkUp, direction: "up" });
      }

      if (!direction || direction.includes("right-up")) {
        const checkRightUp = str.split("").reduce((aqq: CharOccurence[], c, i) => {
          if (c === m.slice(0, rowIndex + 1).reverse()[i]?.[colIndex + i]) {
	    return (i !== 0 && aqq.length === 0)  ? [] : [...aqq, { x: rowIndex - i, y: colIndex + i, char: c }]
	  }
	  return [];
        }, []);
        if (checkRightUp.length > 0) result.push({ str, charOccurences: checkRightUp, direction: "right-up" });
      }

      return result;
    }, [])];
  }, []);
  return result;
};

const day4p1Result = findStringOccursInCharMatrix("XMAS", readInput()).map((x) => {
  console.log(`String Occurence: str: ${x.str}, charOccurences: ${x.charOccurences.map((y) => `x: ${y.x}, y: ${y.y}, char: ${y.char}`).join(", ")}`);
  return x;
}).length;

const xResults = findStringOccursInCharMatrix("MAS", readInput(), ["right-down", "right-up", "left-down", "left-up"]);

/*
const xRightDownList = xResults.filter((o) => o.direction === "right-down");
const xRightUpList = xResults.filter((o) => o.direction === "right-up");
const xLeftUpList = xResults.filter((o) => o.direction === "left-up" );
const xLeftDownList = xResults.filter((o) => o.direction === "left-down" );

const xRightDownCount = xRightDownList.reduce((acc, so) => {
  const corLeftDownMas = so.charOccurences.reduce((acc: StringOccurence, co) => {
    if (co.char === "M") return {...acc, charOccurences: [...acc.charOccurences, { char: "M", x: co.x, y: co.y + 2 }] };
    if (co.char === "A") return {...acc, charOccurences: [...acc.charOccurences, { char: "A", x: co.x, y: co.y }] };
    if (co.char === "S") return {...acc, charOccurences: [...acc.charOccurences, { char: "S", x: co.x, y: co.y - 2}] };
    return acc;
  }, { str: so.str, charOccurences: [], direction: "left-down" })

  const corRightUpMas = so.charOccurences.reduce((acc: StringOccurence, co) => { 
    if (co.char === "M") return {...acc, charOccurences: [...acc.charOccurences, { char: "M", x: co.x +2, y: co.y }] };
    if (co.char === "A") return {...acc, charOccurences: [...acc.charOccurences, { char: "A", x: co.x, y: co.y }] };
    if (co.char === "S") return {...acc, charOccurences: [...acc.charOccurences, { char: "S", x: co.x - 2, y: co.y}] };
    return acc;
  }, { str: so.str, charOccurences: [], direction: "right-up" });

  if (includesStringOccurence(xLeftDownList, corLeftDownMas) || includesStringOccurence(xRightUpList, corRightUpMas)) return acc + 1;
  return acc;
}, 0);
*/

const occurencesOfA: CharOccurence[] = findStringOccursInCharMatrix("A", readInput())
  .reduce((acc: CharOccurence[], o) => {
  return [...acc, ...o.charOccurences];
}, []);
console.log("Occurences of A: " + occurencesOfA.map((o) => `{ x: ${o.x}, y: ${o.y}}`).join(", "));

const countAsInsideXMases = occurencesOfA.reduce((acc, o) => {
  const possibleRightDownMas: StringOccurence = { str: "MAS", charOccurences: [{ char: "M", x: o.x - 1, y: o.y - 1 }, { char: "A", x: o.x, y: o.y }, { char: "S", x: o.x + 1, y: o.y + 1 }], direction: "right-down" };
  const possibleRightUpMas: StringOccurence = { str: "MAS", charOccurences: [{ char: "M", x: o.x + 1, y: o.y - 1 }, { char: "A", x: o.x, y: o.y }, { char: "S", x: o.x - 1, y: o.y + 1 }], direction: "right-up" };
  const possibleLeftDownMas: StringOccurence = { str: "MAS", charOccurences: [{ char: "M", x: o.x - 1, y: o.y + 1 }, { char: "A", x: o.x, y: o.y }, { char: "S", x: o.x + 1, y: o.y - 1 }], direction: "left-down" };
  const possibleLeftUpMas: StringOccurence = { str: "MAS", charOccurences: [{ char: "M", x: o.x + 1, y: o.y + 1 }, { char: "A", x: o.x, y: o.y }, { char: "S", x: o.x - 1, y: o.y - 1 }], direction: "left-up" };

  if (includesStringOccurence(xResults, possibleRightDownMas) && includesStringOccurence(xResults, possibleLeftDownMas)) {
    return acc + 1;
  } else if (includesStringOccurence(xResults, possibleRightUpMas) && includesStringOccurence(xResults, possibleLeftUpMas)) {
    return acc + 1;
  } else if (includesStringOccurence(xResults, possibleRightDownMas) && includesStringOccurence(xResults, possibleRightUpMas)) {
    return acc + 1;
  } else if (includesStringOccurence(xResults, possibleLeftUpMas) && includesStringOccurence(xResults, possibleLeftDownMas)) {
    return acc + 1;
  } else {
    return acc;
  }
}, 0);

  


console.log("Day 4 Part 1 Result " + day4p1Result);

console.log("Day 4 Part 2 Result " + countAsInsideXMases);
