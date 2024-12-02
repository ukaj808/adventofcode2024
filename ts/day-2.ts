import * as fs from 'fs';
import * as path from 'path';

const readInput = (): number[][] => {
  return fs.readFileSync(path.join(__dirname, "../inputs/day-2-input.txt"), 'utf-8')
    .split("\n")
    .filter((x) => x !== "")
    .reduce((acc: number[][], ln: string) => {
	const levels = ln.split(" ").map((x) => parseInt(x));
	acc.push(levels);
	return acc;
    }, []);
};

const isReportSafe = (report: number[]): boolean => {
  return report.reduce((acc: { trend: "-" | "+" | null, lastValue: number | null, safe: boolean }, level: number) => {
    if (!acc.safe) return {...acc, safe: false};
    if (acc.lastValue == null) return { ...acc, lastValue: level};
    if (!isAdjacentLevelSafe(acc.lastValue, level)) return { ...acc, safe: false };

    const currentTrend: "-" | "+" = level > acc.lastValue ? "+" : "-";

    if (acc.trend == null) return { ...acc, lastValue: level, trend: currentTrend};
    if (acc.trend !== currentTrend) return { ...acc, safe: false };


    return {...acc, lastValue: level, trend: currentTrend  }
  }, { trend: null, lastValue: null , safe: true }).safe;
};

const isAdjacentLevelSafe = (l1: number, l2: number): boolean => Math.abs(l1 - l2) <= 3 && Math.abs(l1 - l2) > 0;

const input = readInput();

const countSafeReports = input.reduce((acc: number, report: number[]) => isReportSafe(report) ? acc + 1 : acc, 0);

const countSafeReports2 = Array.from(input.reduce((acc: Map<number[], number[][]>, report: number[]) => {
  if (isReportSafe(report)) {
    acc.set(report, []);
    return acc;
  } 

  const possibilties: number[][] = report.map((_, i) => {
    return report.toSpliced(i, 1);
  });
  acc.set(report, possibilties);
  return acc;
}, new Map<number[], number[][]>()).entries()) 
  .reduce((acc, [_, v]) => { 
    if (v.length == 0) return acc + 1;
    if (v.some(isReportSafe)) return acc + 1;
    return acc;
  }, 0);


console.log("Day 1 Part 1 Result: " + countSafeReports);

console.log("Day 1 Part 2 Result: " + countSafeReports2);

