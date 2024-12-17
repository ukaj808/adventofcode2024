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
  indexes: [number, number][];
  area: number;
  perimeter: number;
  sides: number;
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

const calcSides = (region: Region): { sides: number, traceCoordinates: [number, number][] } => {
  console.log("Calculating sides for region with plant: " + region.plant);

  const placeRegionOntoBiggerEmptyGrid = (r: Region, gardenPlots: string[][]): { gardenPlotsNew: string[][], start: [number, number] } => {
    const gardenPlotsCopy = gardenPlots.map((row) => row.map((p) => ".")); 
    region.indexes.forEach((idx) => gardenPlotsCopy[idx[0]][idx[1]] = region.plant);

    // add an extra row and column to the left right and bottom
    gardenPlotsCopy.unshift(new Array(gardenPlotsCopy[0].length).fill("."));
    gardenPlotsCopy.push(new Array(gardenPlotsCopy[0].length).fill("."));
    gardenPlotsCopy.forEach((row) => {
      row.unshift(".");
      row.push(".");
    });

    let start: [number, number] = [0, 0];

    outer:
    for (let i = 0; i < gardenPlotsCopy.length; i++) {
      inner:
      for (let j = 0; j < gardenPlotsCopy[0].length; j++) {
        if (gardenPlotsCopy[i][j] === region.plant) {
	  start = [i, j];
	  break outer;
	}
      }
    }

    start = [start[0] - 1, start[1]];


    return { gardenPlotsNew: gardenPlotsCopy, start };
  };


  const simMap = placeRegionOntoBiggerEmptyGrid(region, readInput());
  // console.log(simMap.start);
  
  if (region.plant === "C") {
     console.log("Sim map:");
     console.log(simMap.gardenPlotsNew);
  }

  const trace = (start: [number, number]): { sides: number, traceCoordinates: [number, number][] } => {
    const currentPosition = [...start];
    let direction = "right";
    let acc: number = 0;
    let accArray: [number, number][] = [start];
    let go = true;

    while (go) {
      accArray.push([currentPosition[0], currentPosition[1]]);
      if (region.plant === "C") {
	console.log("Current position: " + currentPosition[0] + " " + currentPosition[1] + " Direction: " + direction);
      }
      if (direction === "right") {
	if (simMap.gardenPlotsNew[currentPosition[0]][currentPosition[1] + 1] === "." && simMap.gardenPlotsNew[currentPosition[0] + 1][currentPosition[1] + 1] === region.plant) {
	  currentPosition[1] = currentPosition[1] + 1;
	} else if (simMap.gardenPlotsNew[currentPosition[0]][currentPosition[1] + 1] === region.plant) {
	  console.log("Turning up");
	  direction = "up";
	  acc = acc + 1;
	} else {
	  console.log("Turning down");
	  currentPosition[0] = currentPosition[0] + 1;
	  currentPosition[1] = currentPosition[1] + 1;
	  direction = "down";
	  acc = acc + 1;
	}
      } else if (direction === "up") {
	if (simMap.gardenPlotsNew[currentPosition[0] - 1][currentPosition[1]] === "." && simMap.gardenPlotsNew[currentPosition[0] - 1][currentPosition[1] + 1] === region.plant) {
	  console.log("Continuing up");
	  currentPosition[0] = currentPosition[0] - 1;
	} else if (simMap.gardenPlotsNew[currentPosition[0] - 1][currentPosition[1]] === region.plant) {
	  console.log("Turning left");
	  direction = "left";
	  acc = acc + 1;
	} else {
	  console.log("Turning right");
	  currentPosition[0] = currentPosition[0] - 1;
	  currentPosition[1] = currentPosition[1] + 1;
	  direction = "right";
	  acc = acc + 1;
      }
    } else if (direction === "down") {
        if (simMap.gardenPlotsNew[currentPosition[0] + 1][currentPosition[1]] === "." && simMap.gardenPlotsNew[currentPosition[0] + 1][currentPosition[1] - 1] === region.plant) {
	  console.log("Continuing down");
	  currentPosition[0] = currentPosition[0] + 1;
	} else if (simMap.gardenPlotsNew[currentPosition[0] + 1][currentPosition[1]] === region.plant) {
	  console.log("Turning right");
	  direction = "right";
	  acc = acc + 1;
	} else {
	  console.log("Turning left");
	  currentPosition[0] = currentPosition[0] + 1;
	  currentPosition[1] = currentPosition[1] - 1;
	  direction = "left";
	  acc = acc + 1;
	}
    } else if (direction === "left") {
       if (simMap.gardenPlotsNew[currentPosition[0]][currentPosition[1] - 1] === "." && simMap.gardenPlotsNew[currentPosition[0] - 1][currentPosition[1] - 1] === region.plant) {
	 console.log("Continuing left");
         currentPosition[1] = currentPosition[1] - 1;
       } else if (simMap.gardenPlotsNew[currentPosition[0]][currentPosition[1] - 1] === region.plant) {
	 console.log("Turning down");
	 direction = "down";
	 acc = acc + 1;
       } else {
	 console.log("Turning up");
	 currentPosition[0] = currentPosition[0] - 1;
	 currentPosition[1] = currentPosition[1] - 1;
	 direction = "up";
	 acc = acc + 1;
       }
    }

    if (currentPosition[0] === start[0] && currentPosition[1] === start[1]) go = false;
}
    return { sides: acc, traceCoordinates: accArray };

  };

  return trace(simMap.start);
};

const mapGarden = 
  (regions: Region[], gardenPlots: string[][]): { regions: Region[], gardenPlots: string[][] } => {
  
  const firstPlantRowIndex = gardenPlots.findIndex((row) => row.some((p) => p !== "."));
  if (firstPlantRowIndex === -1) return { regions, gardenPlots };
  const firstPlantColIndex = gardenPlots[firstPlantRowIndex].findIndex((p) => p !== ".");

  const gardenDimensions: [number, number] = [gardenPlots.length, gardenPlots[0].length];

  const plant = gardenPlots[firstPlantRowIndex][firstPlantColIndex];


  const mapRegion = (row: number, col: number, gardenDimensions: [number, number], plant: string, mappedIndexes: Set<string>): Region => {
    if (mappedIndexes.has(`${row}-${col}`)) return { plant, indexes: [] };
    if (row < 0 || row > gardenDimensions[0] - 1) return { plant, indexes: [] };
    if (col < 0 || col > gardenDimensions[1] - 1) return { plant, indexes: [] };
    if (gardenPlots[row][col] !== plant) return { plant, indexes: [] };

    
    let indexes: [number, number][] = [[row, col]];
    mappedIndexes.add(`${row}-${col}`);
    
    indexes = [...indexes, ...mapRegion(row, col + 1, gardenDimensions, plant, mappedIndexes).indexes];
    indexes = [...indexes, ...mapRegion(row + 1, col, gardenDimensions, plant, mappedIndexes).indexes];
    indexes = [...indexes, ...mapRegion(row, col - 1, gardenDimensions, plant, mappedIndexes).indexes];
    indexes = [...indexes, ...mapRegion(row - 1, col, gardenDimensions, plant, mappedIndexes).indexes];

    return { plant, indexes };
  }

  const newRegion = mapRegion(firstPlantRowIndex, firstPlantColIndex, gardenDimensions, plant, new Set<string>());


  const updatedGardenPlots = 
    gardenPlots
      .map((row, x) => 
        row.map((p, y) => {
	  if (newRegion.indexes.some((idx) => x === idx[0] && y === idx[1])) return ".";
	  return p;
    }));

    return mapGarden([...regions, newRegion], updatedGardenPlots);

}

const regions = mapGarden([], readInput()).regions;

const regionTraces: { sides: number, traceCoordinates: [number, number][] }[] = [];

const scoredRegions: ScoredRegion[] = 
  regions.map((r) => {
    const sides = calcSides(r);
    regionTraces.push(sides);
    return { plant: r.plant, area: calcArea(r), perimeter: calcPerimeter(r), sides: sides.sides, indexes: r.indexes };
  });

const rescoredRegions: ScoredRegion[] = scoredRegions.map((r) => {
  const regionTracesAnother = regionTraces.filter((rt) => rt.traceCoordinates.every((rt2) => r.indexes.some((idx) => idx[0] === (rt2[0] - 1) && idx[1] === (rt2[1] - 1))));
  if (regionTracesAnother.length === 0) return r;
  const newSides = r.sides + regionTracesAnother.reduce((acc, rt) => acc + rt.sides, 0);
  console.log("New sides: " + newSides);
  return { plant: r.plant, area: r.area, perimeter: r.perimeter, sides: newSides, indexes: r.indexes };
});

const totalPrice = scoredRegions.reduce((acc, r) => acc + (r.area * r.perimeter), 0);

console.log("Total price: " + totalPrice);

const totalPrice2 = rescoredRegions.reduce((acc, r) => acc + (r.area * r.sides), 0);	

console.log("Total price 2: " + totalPrice2);
