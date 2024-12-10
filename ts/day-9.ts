import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-9-input.txt"), 'utf-8').trim();
};

const expand = (input: string): string[] => {
  let result = [];
  const chars = input.split("");
  for (let i = 0, j = 0; i < chars.length; i+=2, j++) {
    const lengthOfFile = parseInt(chars[i]);
    const lengthOfFreeSpace = parseInt(chars[i+1] ? chars[i+1] : "0");
    const id = j;
    result.push(...Array(lengthOfFile).fill(id+''));
    if (lengthOfFreeSpace > 0) {
      result.push(...Array(lengthOfFreeSpace).fill("."));
    }
  }
  return result;
};

const compress = (input: string[]): string[] => {
  const inputCopy = [...input];
  const numCount = inputCopy.filter((s) => s !== ".").length;
  while (inputCopy.slice(0, numCount).some((s) => s === ".")) {
    const firstEmptySpace = inputCopy.findIndex((s) => s === ".");
    const lastNumber = inputCopy.findLastIndex((s) => /^\d+$/.test(s));
    [inputCopy[firstEmptySpace], inputCopy[lastNumber]] = [inputCopy[lastNumber], inputCopy[firstEmptySpace]];
  }
  return inputCopy;
}

const compress2 = (input: string[]): string[] => {
  const inputCopy = [...input];
  const files: { id: string, index: [number, number] }[] = [];
  for (let i = 0; i < inputCopy.length;) {
    let startingIndex;
    if (inputCopy[i] !== ".") {
      startingIndex = i;
    }
    if (startingIndex !== undefined) {
      let endingIndex = i;
      for (let j = i+1; j < inputCopy.length; j++) {
        if (inputCopy[j] == inputCopy[i]) {
	  endingIndex = j;
	  continue; 
	} else {
	  break;
	}
      }
      files.push({ id: inputCopy[startingIndex], index: [startingIndex, endingIndex] });
      i = endingIndex + 1;
    } else i++;
  }

  let spaces: [number, number][] = [];
  for (let i = 0; i < inputCopy.length;) {
    let startingIndex;
    if (inputCopy[i] === ".") {
      startingIndex = i;
    }
    if (startingIndex !== undefined) {
      let endingIndex = i;
      for (let j = i+1; j < inputCopy.length; j++) {
	if (inputCopy[j] === ".") {
	  endingIndex = j;
	  continue;
	} else {
	  break;
	}
      }
      spaces.push([startingIndex, endingIndex]);
      i = endingIndex + 1;
    } else i++;
  }

  const filesReversed = [...files.reverse()];

  for (let i = 0; i < filesReversed.length; i++) {
    const file = filesReversed[i];
    const fileSize = file.index[1] - file.index[0] + 1;
    const spacesToTheLeft = spaces.filter(([start, end]) => end < file.index[0]);
    const space = spacesToTheLeft.find(([start, end]) => end - start + 1 >= fileSize);
    if (space !== undefined) {
      inputCopy.splice(space[0], fileSize, ...inputCopy.slice(file.index[0], file.index[1] + 1));
      inputCopy.splice(file.index[0], fileSize, ...Array(fileSize).fill("."));
      // modify the space value
      space[0] = space[0] + fileSize;
      spaces = spaces.filter(([start, end]) => start <= end);
    }
  }

  return inputCopy;
}

const checksum = (input: string[]): number => {
  return input.reduce((acc, s, i) => {
    if (s === ".") return acc;
    return acc + (parseInt(s) * i) ;
  }, 0);
}


// console.log("Day 9 Part 1 Result: " + checksum(compress(expand(readInput()))));
console.log("Day 9 Part 2 Result: " + checksum(compress2(expand(readInput()))));
