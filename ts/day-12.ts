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

const calcSides = (region: Region): number => {
  console.log("Calculating sides for region with plant: " + region.plant);

  const hasRight = (index: [number, number], r: Region) => {
    const i = r.indexes.findIndex((ix) => ix[0] === index[0] && ix[1] === index[1]);
    const rest = r.indexes.toSpliced(i, 1);
    return rest.some((ix) => ix[0] === index[0] && ix[1] === index[1] + 1);
  };

  const hasDown = (index: [number, number], r: Region) => {
    const i = r.indexes.findIndex((ix) => ix[0] === index[0] && ix[1] === index[1]);
    const rest = r.indexes.toSpliced(i, 1);
    return rest.some((ix) => ix[0] === index[0] + 1 && ix[1] === index[1]);
  }

  const hasLeft = (index: [number, number], r: Region) => {
    const i = r.indexes.findIndex((ix) => ix[0] === index[0] && ix[1] === index[1]);
    const rest = r.indexes.toSpliced(i, 1);
    return rest.some((ix) => ix[0] === index[0] && ix[1] === index[1] - 1);
  }

  const hasUp = (index: [number, number], r: Region) => {
    const i = r.indexes.findIndex((ix) => ix[0] === index[0] && ix[1] === index[1]);
    const rest = r.indexes.toSpliced(i, 1);
    return rest.some((ix) => ix[0] === index[0] - 1 && ix[1] === index[1]);
  }

  const buildFencedRegion =  (region: Region): string[][] => {
    const rowLength = region.indexes.reduce(((acc, [x, _]) => {
      if (x > acc) return x;
      return acc;
    }), 0) + 1;
    const colLength = region.indexes.reduce(((acc, [_, y]) => {
      if (y > acc) return y;
      return acc;
    }), 0) + 1;
    let fencedRegion = Array.from({length: rowLength + 2 }, () => Array.from({length: colLength + 2}, () => "."));
    fencedRegion = fencedRegion.map((row, x) => row.map((val, y) => {
      if (region.indexes.some((idx) => idx[0] === x && idx[1] === y)) {
        return region.plant;
      }
      return val;
    }));
    return fencedRegion;
  };

  const trace = (start: [number, number], direction: string, acc: number, visited: Set<string>): number => {
    console.log("Turns: " + acc);
    console.log(`Current position: x:${start[0]} y:${start[1]}`);
    if (visited.has(`${start[0]}-${start[1]}-${direction}`)) return acc;
    visited.add(`${start[0]}-${start[1]}-${direction}`);
    //var waitTill = new Date(new Date().getTime() + 2 * 1000);
    //while(waitTill > new Date()){}
    if (direction === "right") {
      if (hasRight(start, region)) {
	console.log("Going right");
        return trace([start[0], start[1] + 1], "right", acc, visited);
      } else if (hasUp(start, region)) {
	console.log("Going Up");
	return trace([start[0] - 1, start[1]], "up", acc + 1, visited);
      } else if (hasDown(start, region)) {
	console.log("Going down");
	return trace([start[0] + 1, start[1]], "down", acc + 1, visited);
      } else {
	console.log("U-Turn! Going left");
	return trace([start[0], start[1] - 1], "left", acc + 2, visited);
      }
    } else if (direction === "down") {
	if (hasRight(start, region)) {
	  console.log("Going right");
	  return trace([start[0], start[1] + 1], "right", acc + 1, visited);
	} else if (hasDown(start, region)) {
	  console.log("Going down");
	  return trace([start[0] + 1, start[1]], "down", acc, visited);
	} else if (hasLeft(start, region)) {
	  console.log("Going left");
	  return trace([start[0], start[1] - 1], "left", acc + 1, visited);
	} else {
	  console.log("U-Turn! Going up");
	  return trace([start[0] - 1, start[1]], "up", acc + 2, visited);
	}
    } else if (direction === "left") {
        if (hasDown(start, region)) {
	  console.log("Going down");
	  return trace([start[0] + 1, start[1]], "down", acc + 1, visited);
	} else if (hasLeft(start, region)) {
	  console.log("Going left");
	  return trace([start[0], start[1] - 1], "left", acc, visited);
	} else if (hasUp(start, region)) {
	  console.log("Going up");
	  return trace([start[0] - 1, start[1]], "up", acc + 1, visited);
	} else {
	  console.log("U-Turn! Going right");
	  return trace([start[0], start[1] + 1], "right", acc + 2, visited);
	}
    } else {
	if (hasUp(start, region)) {
	  console.log("Going up");
	  return trace([start[0] - 1, start[1]], "up", acc, visited);
	} else if (hasRight(start, region)) {
	  console.log("Going right");
	  return trace([start[0], start[1] + 1], "right", acc + 1, visited);
	} else if (hasLeft(start, region)) {
	  console.log("Going left");
	  return trace([start[0], start[1] - 1], "left", acc + 1, visited);
	} else {
	  console.log("U-Turn! Going down");
	  return trace([start[0] + 1, start[1]], "down", acc + 2, visited);
	}
    }
  };
  return trace(region.indexes[0], "right", 0, new Set<string>());
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

const regions = mapGarden([], readInput()).regions;

const scoredRegions: ScoredRegion[] = 
  regions.map((r) => {
    return { plant: r.plant, area: calcArea(r), perimeter: calcPerimeter(r), sides: calcSides(r) };
  });

scoredRegions.forEach((r) => {
  console.log(`Plant: ${r.plant} Area: ${r.area} Perimeter: ${r.perimeter} Side: ${r.sides}`);
});

const totalPrice = scoredRegions.reduce((acc, r) => acc + (r.area * r.perimeter), 0);

console.log("Total price: " + totalPrice);

const totalPrice2 = scoredRegions.reduce((acc, r) => acc + (r.area * r.sides), 0);	

console.log("Total price 2: " + totalPrice2);
