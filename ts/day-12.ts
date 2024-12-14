import * as fs from 'fs';
import * as path from 'path';

const readInput = (): string[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-12-input.txt"), 'utf-8')
  .trim()
  .split('\n')
  .map((ln) => ln.split(''));
};


type Region = {
  plant: string;
  indexes: [number, number][];
}; 

type ScoredRegion = {
  plant: string;
  area: number;
  perimeter: number;
  sides: number;
}

const rotateLeft = <T>(array: T[][]): T[][] => {
    var result: T[][] = [];
    array.forEach(function (a, i, aa) {
        a.forEach(function (b, j, bb) {
            result[j] = result[j] || [];
            result[j][aa.length - i - 1] = b;
        });
    });
    return result;
}

const calcArea = (region: Region): number => region.indexes.length;

const calcPerimeter = (region: Region): number => {
  return region.indexes.reduce((acc, idx, i, orig) => {
    const rest = orig.toSpliced(i, 1);
    const indexesToCheck: [number, number][] = [[idx[0], idx[1]+1], [idx[0]+1, idx[1]], [idx[0], idx[1]-1], [idx[0]-1, idx[1]]];
    const score = indexesToCheck.reduce((akk, neighbor) => {
      if (rest.some((index) => neighbor[0] === index[0] && neighbor[1] === index[1])) return akk;
      return akk+1;
    }, 0);
    return acc + score;
  }, 0);
};


const splitShotHit = (index: [number, number], gardenPlots: string[][], region: Region, side: "left" | "bottom" | "right" | "top"): false | [number, number][] => {
  const goUp = (i: [number, number], gp: string[][]): false | [number, number] => {
    if (region.plant === "R") {
      //console.log(`split shot hit against plant: ${region.plant} going up at x: ${i[0]} y: ${i[1]}`);
    }
    if (i[1] < 0) { 
	//if (region.plant === "R") console.log("hit the left side of the garden");
	return false;
    }
    if (i[0] < 0) { 
       //if (region.plant === "R") console.log("hit the top of the garden");
       return false; 
    }
    if (gp[i[0]][i[1]] !== "." && gp[i[0]][i[1]] !== undefined) return [i[0], i[1]];
    return goUp([i[0] - 1, i[1]], gp);
  }
  const goDown = (i: [number, number], gp: string[][]): false | [number, number] => {
    if (region.plant === "R") {
      //console.log(`split shot hit against plant: ${region.plant} going down at x: ${i[0]} y: ${i[1]}`);
    }
    if (i[0] >= (gp.length - 1)) { 
      //console.log("hit the bottom of the garden");
      return false; 
    }
    if (gp[i[0]][i[1]] !== "." && gp[i[0]][i[1]] !== undefined) return [i[0], i[1]];
    return goDown([i[0]+1, i[1]], gp);
  }

  const hitGoingUp = goUp([index[0] - 1, index[1]], gardenPlots);
  const hitGoingDown = goDown([index[0] + 1, index[1]], gardenPlots);

  const calcRicochets = (upStart: [number, number], downStart: [number, number], gp: string[][]): [number, number][] => {
    const collectLeft = (i: [number, number], gp: string[][], res: [number, number][]): [number, number][] => {
      if (i[1] < 0) return res;
      if (gp[i[0]][i[1]] === "." || gp[i[0]][i[1]] === undefined) {
        return res;
      }
      return collectLeft([i[0], i[1] - 1], gp, [...res, i]);
    }

    const topRicochets = collectLeft(upStart, gp, []);
    const bottomRicochets = collectLeft(downStart, gp, []);

    return [...topRicochets, ...bottomRicochets];
  };


  if (hitGoingUp instanceof Array && hitGoingDown instanceof Array) {
    const ricochets = calcRicochets(hitGoingUp, hitGoingDown, gardenPlots);
    // console.log("Split shot hit for plant: " + region.plant + " at x: " + index[0] + " y: " + index[1] + " conming from the " + side);
    return ricochets;
  }
  else return false;

};

const calcSides = (region: Region, gardenPlots: string[][]): number => {


  // Create copy of matrix with only the region planted
  const gardenPlotsCopy = gardenPlots.map((row) => row.map((p) => ".")); 
  region.indexes.forEach((idx) => gardenPlotsCopy[idx[0]][idx[1]] = region.plant);

  // Create an array of values by hitting the left side of the region and counting the last empty space until the plant
  let leftSide: [number, number][] = gardenPlotsCopy.map((row, i) => {
    return [i, row.findIndex((p) => p === region.plant)]
  });
  leftSide = leftSide.filter((val) => val[1] !== -1);
  const leftSideRicochets: Set<string> = new Set<string>();

  // Map numbers in array that are a valley to a peak
  //
  let leftSideSplitShotScore = 0;

  leftSideSplitShotScore = leftSide.reduce((acc, val) => {
    const valley: [number, number] = [val[0], val[1] - 1];
    const splitShot = splitShotHit(valley, gardenPlotsCopy, region, "left");
    if (splitShot) {
      splitShot.forEach((val) => leftSideRicochets.add(`${val[0]}-${val[1]}`));
    }
    if (splitShot) return acc + 2;
    else return acc;
  }, 0);
  
  let leftSideStraightShotScore: number;

  if (leftSide.every(([_, val]) => val === leftSide[0][1])) {
    leftSideStraightShotScore = 1;
  } else {
    leftSideStraightShotScore = leftSide.slice(1).reduce((acc, val) => {
      if (val[1] !== acc.lastValue[1]) {
	return { lastValue: val, score: acc.score + 1 };
      }
      return acc;
    }, {lastValue: leftSide[0], score: 1}).score;;
  };

  let bottomSide: [number, number][] = gardenPlotsCopy[gardenPlotsCopy.length - 1].map((p, i) => {
    let row = gardenPlotsCopy.length - 1;
    for (row; row >= 0; row--) {
      if (gardenPlotsCopy[row][i] !== ".") return [row, i];
    }
    return [-1, i];;
  });
  bottomSide = bottomSide.filter((val) => val[0] !== -1);

  const bottomSideRicochets: Set<string> = new Set<string>();

  let bottomSideSplitShotScore = 0;

  bottomSideSplitShotScore = bottomSide.reduce((acc, val) => {
    const valley: [number, number] = [val[0], val[1] - 1];
    const splitShot = splitShotHit(valley, gardenPlotsRotatedOnce, region, "bottom");
    if (splitShot) {
      splitShot.forEach((val) => bottomSideRicochets.add(`${val[0]}-${val[1]}`));
    }
    if (splitShot) return acc + 2;
    else return acc;
  }, 0);

  let bottomSideStraightShotScore: number;

  if (bottomSide.every((val) => val === bottomSide[0])) {
    bottomSideStraightShotScore = 1;
  } else {
    bottomSideStraightShotScore = bottomSide.slice(1).reduce((acc, val) => {
      if (val[1] !== acc.lastValue[1]) {
	if (leftSideRicochets.has(`${val[0]}-${val[1]}`)) return acc;
	return { lastValue: val, score: acc.score + 1 };
      }
      return acc;
    }
    , {lastValue: bottomSide[0], score: 1}).score;
  }

  const gardenPlotsRotatedTwice = rotateLeft(gardenPlotsRotatedOnce);

  let rightSide: [number, number][] = gardenPlotsRotatedTwice.map((row, i) => {
    return [i, row.findIndex((p) => p === region.plant)]
  });
  rightSide = rightSide.filter((val) => val[1] !== -1);
  const rightSideRicochets: Set<string> = new Set<string>();


  let rightSideSplitShotScore = 0;

  rightSideSplitShotScore = rightSide.reduce((acc, val) => {
    const valley: [number, number] = [val[0], val[1] - 1];
    const splitShot = splitShotHit(valley, gardenPlotsRotatedTwice, region, "right");
    if (splitShot) {
      splitShot.forEach((val) => rightSideRicochets.add(`${val[0]}-${val[1]}`));
    }
    if (splitShot) return acc + 2;
    else return acc;
  }, 0);

  let rightSideStraightShotScore: number;

  if (rightSide.every((val) => val === rightSide[0])) {
    rightSideStraightShotScore = 1;
  } else {
    rightSideStraightShotScore = rightSide.slice(1).reduce((acc, val) => {
      if (val[1] !== acc.lastValue[1]) {
	return { lastValue: val, score: acc.score + 1 };
      }
      return acc;
    }
    , {lastValue: rightSide[0], score: 1}).score;
  }

  const gardenPlotsRotatedThrice = rotateLeft(gardenPlotsRotatedTwice);

  let topSide: [number, number][] = gardenPlotsRotatedThrice.map((row, i) => {
    return [i, row.findIndex((p) => p === region.plant)]
  });
  topSide = topSide.filter((val) => val[1] !== -1);
  const topSideRicochets: Set<string> = new Set<string>();

  let topSideSplitShotScore = 0;

  topSideSplitShotScore = topSide.reduce((acc, val) => {
    const valley: [number, number] = [val[0], val[1] - 1];
    const splitShot = splitShotHit(valley, gardenPlotsRotatedThrice, region, "top");
    if (splitShot) {
      splitShot.forEach((val) => topSideRicochets.add(`${val[0]}-${val[1]}`));
    }
    if (splitShot) return acc + 2;
    else return acc;
  }, 0);

  let topSideStraightShotScore: number;

  if (topSide.every((val) => val === topSide[0])) {
    topSideStraightShotScore = 1;
  } else {
    topSideStraightShotScore = topSide.slice(1).reduce((acc, val) => {
	if (leftSideRicochets.has(`${val[0]}-${val[1]}`)) return acc;
      if (val[1] !== acc.lastValue[1]) {
	return { lastValue: val, score: acc.score + 1 };
      }
      return acc;
    }
    , {lastValue: topSide[0], score: 1}).score;
  }

  return leftSideStraightShotScore +
       leftSideSplitShotScore +
	bottomSideStraightShotScore +
	bottomSideSplitShotScore +
	rightSideStraightShotScore +
	rightSideSplitShotScore +
	topSideStraightShotScore +
	topSideSplitShotScore;
  
};

const mapGarden = 
  (regions: Region[], gardenPlots: string[][]): { regions: Region[], gardenPlots: string[][] } => {
  
  const firstPlantRowIndex = gardenPlots.findIndex((row) => row.some((p) => p !== "."));
  if (firstPlantRowIndex === -1) return { regions, gardenPlots };
  const firstPlantColIndex = gardenPlots[firstPlantRowIndex].findIndex((p) => p !== ".");

  const gardenDimensions: [number, number] = [gardenPlots.length, gardenPlots[0].length];

  const plant = gardenPlots[firstPlantRowIndex][firstPlantColIndex];

  //console.log("Mapping plant: " + plant + " starting at x:" + firstPlantRowIndex + " y:" + firstPlantColIndex);

  const mapRegion = (row: number, col: number, gardenDimensions: [number, number], plant: string, mappedIndexes: Set<string>): Region => {
    if (mappedIndexes.has(`${row}-${col}`)) return { plant, indexes: [] };
    if (row < 0 || row > gardenDimensions[0] - 1) return { plant, indexes: [] };
    if (col < 0 || col > gardenDimensions[1] - 1) return { plant, indexes: [] };
    //console.log("Checking x:" + row + " y:" + col);
    if (gardenPlots[row][col] !== plant) return { plant, indexes: [] };

    //console.log("Mapping plant, continuing at x:" + row + " y:" + col);
    
    let indexes: [number, number][] = [[row, col]];
    mappedIndexes.add(`${row}-${col}`);
    
    indexes = [...indexes, ...mapRegion(row, col + 1, gardenDimensions, plant, mappedIndexes).indexes];
    indexes = [...indexes, ...mapRegion(row + 1, col, gardenDimensions, plant, mappedIndexes).indexes];
    indexes = [...indexes, ...mapRegion(row, col - 1, gardenDimensions, plant, mappedIndexes).indexes];
    indexes = [...indexes, ...mapRegion(row - 1, col, gardenDimensions, plant, mappedIndexes).indexes];

    return { plant, indexes };
  }

  const newRegion = mapRegion(firstPlantRowIndex, firstPlantColIndex, gardenDimensions, plant, new Set<string>());

  //console.log("New Region: " + newRegion.plant + " Indexes: " + newRegion.indexes.map((idx) => `x:${idx[0]}, y:${idx[1]} `).join(""));

  const updatedGardenPlots = 
    gardenPlots
      .map((row, x) => 
        row.map((p, y) => {
	  if (newRegion.indexes.some((idx) => x === idx[0] && y === idx[1])) return ".";
	  return p;
    }));

    return mapGarden([...regions, newRegion], updatedGardenPlots);

}

const input = readInput();

const regions = mapGarden([], input).regions;

const scoredRegions: ScoredRegion[] = 
  regions.map((r) => {
    return { plant: r.plant, area: calcArea(r), perimeter: calcPerimeter(r), sides: calcSides(r, input) };
  });

scoredRegions.forEach((r) => {
  console.log(`Plant: ${r.plant} Area: ${r.area} Perimeter: ${r.perimeter} Side: ${r.sides}`);
});

const totalPrice = scoredRegions.reduce((acc, r) => acc + (r.area * r.perimeter), 0);

console.log("Total price: " + totalPrice);

const totalPrice2 = scoredRegions.reduce((acc, r) => acc + (r.area * r.sides), 0);	

console.log("Total price 2: " + totalPrice2);
