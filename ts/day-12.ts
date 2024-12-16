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

const calcSides = (region: Region, gardenPlots: string[][]): number => {
  // Create copy of matrix with only the region planted
  const gardenPlotsCopy = gardenPlots.map((row) => row.map((p) => ".")); 
  region.indexes.forEach((idx) => gardenPlotsCopy[idx[0]][idx[1]] = region.plant);

  // Create an array of values by hitting the left side of the region and counting the last empty space until the plant
  const leftSide = gardenPlotsCopy.map((row) => {
    return row.findIndex((p) => p === region.plant)
  }).filter((val) => val !== -1);

  // Map numbers in array that are a valley to a peak
  
  let leftSideScore: number;

  if (leftSide.every((val) => val === leftSide[0])) {
    leftSideScore = 1;
  } else {
    leftSideScore = leftSide.slice(1).reduce((acc, val) => {
      if (val !== acc.lastValue) {
	return { lastValue: val, score: acc.score + 2 };
      }
      return acc;
    }, {lastValue: leftSide[0], score: 1}).score;;
  };

  console.log("Left side cols: " + leftSide.map((val) => val).join(", "));
  console.log("Left side score: " + leftSideScore + "For plant: " + region.plant);

  const gardenPlotsRotatedOnce = rotateLeft(gardenPlotsCopy);

  const bottomSide = gardenPlotsRotatedOnce.map((row) => {
    return row.findIndex((p) => p === region.plant);
  }).filter((val) => val !== -1);

  let bottomSideScore: number;

  if (bottomSide.every((val) => val === bottomSide[0])) {
    bottomSideScore = 1;
  } else {
    bottomSideScore = bottomSide.slice(1).reduce((acc, val) => {
      if (val !== acc.lastValue) {
	return { lastValue: val, score: acc.score + 2 };
      }
      return acc;
    }
    , {lastValue: bottomSide[0], score: 1}).score;
  }

  console.log("Bottom side cols: " + bottomSide.map((val) => val).join(", "));
  console.log("Bottom side score: " + bottomSideScore + "For plant: " + region.plant);

  const gardenPlotsRotatedTwice = rotateLeft(gardenPlotsRotatedOnce);

  const rightSide = gardenPlotsRotatedTwice.map((row) => {
    return row.findIndex((p) => p === region.plant);
  }).filter((val) => val !== -1);

  let rightSideScore: number;

  if (rightSide.every((val) => val === rightSide[0])) {
    rightSideScore = 1;
  } else {
    rightSideScore = rightSide.slice(1).reduce((acc, val) => {
      if (val !== acc.lastValue) {
	return { lastValue: val, score: acc.score + 2 };
      }
      return acc;
    }
    , {lastValue: rightSide[0], score: 1}).score;
  }

  console.log("Right side cols: " + rightSide.map((val) => val).join(", "));
  console.log("Right side score: " + rightSideScore + "For plant: " + region.plant);

const gardenPlotsRotatedThrice = rotateLeft(gardenPlotsRotatedTwice);

  const topSide = gardenPlotsRotatedThrice.map((row) => {
    return row.findIndex((p) => p === region.plant);
  }).filter((val) => val !== -1);

  let topSideScore: number;

  if (topSide.every((val) => val === topSide[0])) {
    topSideScore = 1;
  } else {
    topSideScore = topSide.slice(1).reduce((acc, val) => {
      if (val !== acc.lastValue) {
	return { lastValue: val, score: acc.score + 2 };
      }
      return acc;
    }
    , {lastValue: topSide[0], score: 1}).score;
  }
  
  console.log("Top side cols: " + topSide.map((val) => val).join(", "));
  console.log("Top side score: " + topSideScore + "For plant: " + region.plant);

return leftSideScore + bottomSideScore + rightSideScore + topSideScore;
  
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
