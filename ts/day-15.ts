import * as fs from 'fs';
import * as path from 'path';

type Input = {
  warehouse: string[][],
  moves: string[],
  robotStartingPosition: { x: number, y: number }
}

const findRobotPos = (warehouse: string[][]): {x:number,y:number} => {
  const row = warehouse.findIndex((row) => row.some((c) => c === '@'));
  const col = warehouse[row].findIndex((c) => c === '@');
  return {x:row,y:col};
};

const readInput = (): Input => {
  const input = fs.readFileSync(path.join(__dirname, "../inputs/day-15-input.txt"), 'utf-8')
    .trim()
    .split('\n\n')
  const warehouse = 
    input[0].split('\n').map((ln) => ln.split(''));
  const moves = input[1].split('').filter((c) => c !== '\n');
  const robotStartingPosition = findRobotPos(warehouse);
  return { warehouse, moves, robotStartingPosition };
};
const moveRobot2 = (currentPosition: { x: number, y: number }, warehouse: string[][], direction: string): { warehouse: string[][], robotNewPosition: { x: number, y: number } } => {
  let robotNewPosition;
  const warehouseCopy = warehouse.map((row) => row.slice());

  const possibleNextPosition = direction === ">" ? { x: currentPosition.x , y: currentPosition.y + 1 } : direction === "v" ? { x: currentPosition.x + 1 , y: currentPosition.y } : direction === "<" ? { x: currentPosition.x , y: currentPosition.y - 1 } : { x: currentPosition.x - 1, y: currentPosition.y };
  const possibleNextPositionValue = warehouse[possibleNextPosition.x][possibleNextPosition.y];

  const swapValues = () => {
    [warehouseCopy[currentPosition.x][currentPosition.y], 
     warehouseCopy[possibleNextPosition.x][possibleNextPosition.y]] =
     [warehouseCopy[possibleNextPosition.x][possibleNextPosition.y],
      warehouseCopy[currentPosition.x][currentPosition.y]]
  }

  const shiftBoxes = (pos: {x: number, y: number}): boolean => {
    const collectBoxCoordinates = (p: {x: number, y:number}): [{x:number,y:number},{x:number,y:number}][] => {
      const val = warehouseCopy[p.x]?.[p.y];
      let result: [{x:number, y:number},{x:number, y:number}][] = [];
      if (val !== "[" && val !== "]") return [];
      else if (val === "[") {
        console.log(`Collecting box coordinates at ${p.x},${p.y}`);
	const posOfClosingBracket = {x:p.x, y:p.y+1};
        if (direction === ">") {
	  const nextNextPos = {x:posOfClosingBracket.x, y:posOfClosingBracket.y+1};
	  result = [...result, [{x:p.x, y:p.y},posOfClosingBracket], ...collectBoxCoordinates(nextNextPos)];
	} else if (direction === "v") {
	  const nextNextPosOfOpeningBracket = {x:p.x+1,y:p.y};
	  const nextNextPosOfClosingBracket = {x:posOfClosingBracket.x+1, y:posOfClosingBracket.y}
	  if (warehouseCopy[nextNextPosOfOpeningBracket.x]?.[nextNextPosOfOpeningBracket.y] === "[" ) {
	    result = [...result, [{x:p.x,y:p.y},posOfClosingBracket], ...collectBoxCoordinates(nextNextPosOfOpeningBracket)];
	  } else {
	    result = [...result, [{x:p.x,y:p.y},posOfClosingBracket], ...collectBoxCoordinates(nextNextPosOfOpeningBracket), ...collectBoxCoordinates(nextNextPosOfClosingBracket)];
	  }
	} else {
	  const nextNextPosOfOpeningBracket = {x:p.x-1,y:p.y};
	  const nextNextPosOfClosingBracket = {x:posOfClosingBracket.x-1,y:posOfClosingBracket.y};
	  if (warehouseCopy[nextNextPosOfOpeningBracket.x]?.[nextNextPosOfOpeningBracket.y] === "[" ) {
	    result = [...result, [{x:p.x,y:p.y},posOfClosingBracket], ...collectBoxCoordinates(nextNextPosOfOpeningBracket)];
	  } else {
	    result = [...result, [{x:p.x,y:p.y},posOfClosingBracket], ...collectBoxCoordinates(nextNextPosOfOpeningBracket), ...collectBoxCoordinates(nextNextPosOfClosingBracket)];
	  }
	}
      } else {
        console.log(`Collecting box coordinates at ${p.x},${p.y}`);
	const posOfOpeningBracket = {x:p.x, y:p.y-1};
	if (direction === "<") {
	  const nextNextPos = {x:posOfOpeningBracket.x, y:posOfOpeningBracket.y-1};
	  result = [...result, [posOfOpeningBracket,{x:p.x, y:p.y}], ...collectBoxCoordinates(nextNextPos)];
	} else if (direction === "v") {
	  const nextNextPosOfClosingBracket = {x:p.x+1,y:p.y};
	  const nextNextPosOfOpeningBracket = {x:posOfOpeningBracket.x+1,y:posOfOpeningBracket.y};
	  if (warehouseCopy[nextNextPosOfClosingBracket.x][nextNextPosOfClosingBracket.y] === "]") {
	    result = [...result, [posOfOpeningBracket,{x:p.x,y:p.y}], ...collectBoxCoordinates(nextNextPosOfClosingBracket)];
	  } else {
	    result = [...result, [posOfOpeningBracket,{x:p.x,y:p.y}], ...collectBoxCoordinates(nextNextPosOfClosingBracket), ...collectBoxCoordinates(nextNextPosOfOpeningBracket)];
	  }
	} else {
	  const nextNextPosOfClosingBracket = {x:p.x-1,y:p.y};
	  const nextNextPosOfOpeningBracket = {x:posOfOpeningBracket.x-1,y:posOfOpeningBracket.y}; 
	  if (warehouseCopy[nextNextPosOfClosingBracket.x][nextNextPosOfClosingBracket.y] === "]") {
	    result = [...result, [posOfOpeningBracket,{x:p.x,y:p.y}], ...collectBoxCoordinates(nextNextPosOfClosingBracket)];
	  } else {
	    result = [...result, [posOfOpeningBracket,{x:p.x,y:p.y}], ...collectBoxCoordinates(nextNextPosOfClosingBracket), ...collectBoxCoordinates(nextNextPosOfOpeningBracket)];
	  }
	}
      }
      return result;
    }
    const hashSet: Set<string> = new Set();
    let boxCoordinates = collectBoxCoordinates(pos);
    boxCoordinates = boxCoordinates.filter(([openingBracket, closingBracket]) => {
      const key = `${openingBracket.x},${openingBracket.y}-${closingBracket.x},${closingBracket.y}`;
      if (hashSet.has(key)) return false;
      hashSet.add(key);
      return true;
    });


    console.log(`Box coordinates: ${boxCoordinates.map((c) => `(${c[0].x},${c[0].y})-(${c[1].x},${c[1].y})`).join(' ')}`);

    const canMoveBoxes = boxCoordinates.every(([openingBracket, closingBracket]) => {
      if (direction === ">") {
        return warehouseCopy[closingBracket.x][closingBracket.y + 1] !== "#";
      } else if (direction === "v") {
	return warehouseCopy[openingBracket.x+1][openingBracket.y] !== "#" && warehouseCopy[closingBracket.x+1][closingBracket.y] !== "#";
      } else if (direction === "<") {
	return warehouseCopy[openingBracket.x][openingBracket.y - 1] !== "#";
      } else {
	return warehouseCopy[openingBracket.x-1][openingBracket.y] !== "#" && warehouseCopy[closingBracket.x-1][closingBracket.y] !== "#";
      }
    });

    if (canMoveBoxes) {
     console.log("Moving boxes!!!");
      if (direction === ">") {
	boxCoordinates = boxCoordinates.sort((a, b) => {
	  if (a[1].y > b[1].y) {
	    return 1;
	  } else if (a[1].y < b[1].y) {
	    return -1;
	  } else {
	    return 0;
	  }
	});
        for (let i = boxCoordinates.length - 1; i >= 0; i--) {
	  const boxCoordinate = boxCoordinates[i];
	  console.log(`Swapping values at ${boxCoordinate[1].x},${boxCoordinate[1].y} and ${boxCoordinate[1].x},${boxCoordinate[1].y + 1}`);
	  // move closing bracket
	  [warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y +1], warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y]] =
          [warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y], warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y +1]];
          // move opening bracket
	  console.log(`Swapping values at ${boxCoordinate[0].x},${boxCoordinate[0].y} and ${boxCoordinate[0].x},${boxCoordinate[0].y + 1}`);	
	  [warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y +1], warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y]] =
          [warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y], warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y +1]];
	}
      } else if (direction === "v") {
	boxCoordinates = boxCoordinates.sort((a, b) => {
	  if (a[1].x > b[1].x) {
	    return 1;
	  } else if (a[1].x < b[1].x) {
	    return -1;
	  } else {
	    return 0;
	  }
	});
	for (let i = boxCoordinates.length - 1; i >= 0; i--) {
	  const boxCoordinate = boxCoordinates[i];
	  // move closing bracket
	  [warehouseCopy[boxCoordinate[1].x + 1][boxCoordinate[1].y], warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y]] =
	  [warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y], warehouseCopy[boxCoordinate[1].x + 1][boxCoordinate[1].y]];
	  // move opening bracket
	  [warehouseCopy[boxCoordinate[0].x + 1][boxCoordinate[0].y], warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y]] =
	  [warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y], warehouseCopy[boxCoordinate[0].x + 1][boxCoordinate[0].y]];
	}
      } else if (direction === "<") {
	boxCoordinates = boxCoordinates.sort((a, b) => {
	  if (a[1].y > b[1].y) {
	    return -1;
	  } else if (a[1].y < b[1].y) {
	    return 1;
	  } else {
	    return 0;
	  }
	});
	for (let i = boxCoordinates.length - 1; i >= 0; i--) {
	  const boxCoordinate = boxCoordinates[i];
	  // move opening bracket
	  [warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y - 1], warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y]] =
	  [warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y], warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y - 1]];
	  // move closing bracket
	  [warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y - 1], warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y]] =
          [warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y], warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y - 1]];
	}
      } else {
	boxCoordinates = boxCoordinates.sort((a, b) => {
	  if (a[1].x > b[1].x) {
	    return -1;
	  } else if (a[1].x < b[1].x) {
	    return 1;
	  } else {
	    return 0;
	  }
	});
	for (let i = boxCoordinates.length - 1; i >= 0; i--) {
          const boxCoordinate = boxCoordinates[i];
	  // move closing bracket
	  [warehouseCopy[boxCoordinate[1].x - 1][boxCoordinate[1].y], warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y]] =
	  [warehouseCopy[boxCoordinate[1].x][boxCoordinate[1].y], warehouseCopy[boxCoordinate[1].x - 1][boxCoordinate[1].y]];
	  // move opening bracket
	  [warehouseCopy[boxCoordinate[0].x - 1][boxCoordinate[0].y], warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y]] =
	  [warehouseCopy[boxCoordinate[0].x][boxCoordinate[0].y], warehouseCopy[boxCoordinate[0].x - 1][boxCoordinate[0].y]];
	}
      }
      return true;
    }
    console.log("Can't move boxes");
    return false;
  }

  if (possibleNextPositionValue === ".") { 
    swapValues();
    robotNewPosition = possibleNextPosition;
  } else if (possibleNextPositionValue === "#") {
    robotNewPosition = currentPosition;
  } else {
    const wereShifted = shiftBoxes(possibleNextPosition);
    if (wereShifted) {
      swapValues();
      robotNewPosition = possibleNextPosition;
    } else {
      robotNewPosition = currentPosition;
    }
  }

  return { robotNewPosition, warehouse: warehouseCopy };

};


const moveRobot = (currentPosition: { x: number, y: number }, warehouse: string[][], direction: string): { warehouse: string[][], robotNewPosition: { x: number, y: number } } => {
  
  let robotNewPosition;
  const warehouseCopy = warehouse.map((row) => row.slice());

  const possibleNextPosition = direction === ">" ? { x: currentPosition.x , y: currentPosition.y + 1 } : direction === "v" ? { x: currentPosition.x + 1 , y: currentPosition.y } : direction === "<" ? { x: currentPosition.x , y: currentPosition.y - 1 } : { x: currentPosition.x - 1, y: currentPosition.y };
  const possibleNextPositionValue = warehouse[possibleNextPosition.x][possibleNextPosition.y];

  const swapValues = () => {
    [warehouseCopy[currentPosition.x][currentPosition.y], 
     warehouseCopy[possibleNextPosition.x][possibleNextPosition.y]] =
     [warehouseCopy[possibleNextPosition.x][possibleNextPosition.y],
      warehouseCopy[currentPosition.x][currentPosition.y]]
  }

  const shiftBoxes = (pos: {x: number, y: number}): boolean => {
    let value = warehouseCopy[pos.x][pos.y];
    let valuePos = { x: pos.x, y: pos.y };

    while (value === "O") {
      if (direction === ">") { 
	valuePos = { x: valuePos.x, y: valuePos.y + 1 };
      }
      else if (direction === "v") { 
	valuePos = { x: valuePos.x + 1, y: valuePos.y };
      }
      else if (direction === "<") { 
	valuePos = { x: valuePos.x, y: valuePos.y - 1 };
      } else {
	valuePos = { x: valuePos.x - 1, y: valuePos.y };
      }
      value = warehouseCopy[valuePos.x][valuePos.y]; 
    }


    if (value === ".") {
      if (direction === ">") {
        for (let i = valuePos.y; i > pos.y; i--) {
	  [warehouseCopy[pos.x][i], warehouseCopy[pos.x][i - 1]] =
	   [warehouseCopy[pos.x][i - 1], warehouseCopy[pos.x][i]]
	}
      } else if (direction === "v") {
        for (let i = valuePos.x; i > pos.x; i--) {
	  [warehouseCopy[i][pos.y], warehouseCopy[i - 1][pos.y]] =
	   [warehouseCopy[i - 1][pos.y], warehouseCopy[i][pos.y]]
	}
      } else if (direction === "<") {
	for (let i = valuePos.y; i < pos.y; i++) {
	  [warehouseCopy[pos.x][i], warehouseCopy[pos.x][i + 1]] =
	   [warehouseCopy[pos.x][i + 1], warehouseCopy[pos.x][i]]
	}
      } else {
	for (let i = valuePos.x; i < pos.x; i++) {
	  [warehouseCopy[i][pos.y], warehouseCopy[i + 1][pos.y]] =
	   [warehouseCopy[i + 1][pos.y], warehouseCopy[i][pos.y]]
	}
      }
      return true;
    } else return false;
  }

  if (possibleNextPositionValue === ".") { 
    swapValues();
    robotNewPosition = possibleNextPosition;
  } else if (possibleNextPositionValue === "#") {
    robotNewPosition = currentPosition;
  } else {
    const wereShifted = shiftBoxes(possibleNextPosition);
    if (wereShifted) {
      swapValues();
      robotNewPosition = possibleNextPosition;
    } else {
      robotNewPosition = currentPosition;
    }
  }

  return { warehouse: warehouseCopy, robotNewPosition }
}

const gpsCoordinate = (pos: { x: number, y: number }): number => (100 * pos.x) + pos.y;

const input = readInput();

const widenWarehouse = (warehouse: string[][]): string[][] => {
  return warehouse.map((row) => {
    return row.map((val) => {
      if (val === "#") return ["#","#"];
      else if (val === "O") return ["[","]"];
      else if (val === ".") return [".","."];
      else return ["@","."]
    }).flat();
  });
};

const warehouseWidened = widenWarehouse(input.warehouse);

const widenedInput: Input = {
  warehouse: warehouseWidened,
  moves: input.moves,
  robotStartingPosition: findRobotPos(warehouseWidened)
};

const warehouseUpdated = input.moves.reduce((acc, m) => {
  const updated = moveRobot(acc.robotPosition, acc.warehouse, m);
  return { robotPosition: updated.robotNewPosition, warehouse: updated.warehouse };
}, { robotPosition: input.robotStartingPosition,  warehouse: input.warehouse });

const boxGpsCoordinates: number =
  warehouseUpdated.warehouse.reduce((acc: {x:number,y:number}[], row, i) => {
    return [...acc, 
	    ...row.reduce((akk: {x:number,y:number}[], val, j) => {
	      if (val === "O") return [...akk, { x: i, y: j }];
	      return akk;
	    }, [])]
  }, []).map(gpsCoordinate).reduce((acc, gps) => acc + gps);

console.log("Before updates");

widenedInput.warehouse.forEach((row) => console.log(row.join('')));

const widenedWarehouseUpdated = widenedInput.moves.reduce((acc, m) => {
  const updated = moveRobot2(acc.robotPosition, acc.warehouse, m);
  console.log(`Move: ${m}`);
  updated.warehouse.forEach((row) => console.log(row.join('')));
  updated.warehouse.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === "[" && updated.warehouse[i][j+1] !== "]") throw new Error(`Invalid warehouse state at ${i},${j}`);
    });
  });
  return { robotPosition: updated.robotNewPosition, warehouse: updated.warehouse };
}, { robotPosition: widenedInput.robotStartingPosition,  warehouse: widenedInput.warehouse });

const widenedBoxGpsCoordinatesSum: number =
  widenedWarehouseUpdated.warehouse.reduce((acc: {x:number,y:number}[], row, i) => {
    return [...acc, 
	    ...row.reduce((akk: {x:number,y:number}[], val, j) => {
	      if (val === "[") return [...akk, { x: i, y: j }];
	      return akk;
	    }, [])]
  }, []).map(gpsCoordinate).reduce((acc, gps) => acc + gps);

console.log(`Box GPS coordinates: ${widenedBoxGpsCoordinatesSum}`);
