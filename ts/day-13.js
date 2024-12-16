"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var readInput = function () {
    return fs.readFileSync(path.join(__dirname, "../inputs/day-13-input.txt"), 'utf-8')
        .trim()
        .split('\n\n')
        .map(function (line) { return line.split('\n'); })
        .map(function (machineInfo) {
        return machineInfo.reduce(function (acc, info, i) {
            var movesReg = /X\+(\d+), Y\+(\d+)/;
            var prizeReg = /X=(\d+), Y=(\d+)/;
            if (i === 0) {
                var matched = info.match(movesReg);
                acc.buttonA = { xMoves: parseInt(matched[1]), yMoves: parseInt(matched[2]) };
            }
            else if (i === 1) {
                var matched = info.match(movesReg);
                acc.buttonB = { xMoves: parseInt(matched[1]), yMoves: parseInt(matched[2]) };
            }
            else {
                var matched = info.match(prizeReg);
                acc.prizeLocation = { x: parseInt(matched[1]), y: parseInt(matched[2]) };
            }
            return acc;
        }, { buttonA: { xMoves: 0, yMoves: 0 }, buttonB: { xMoves: 0, yMoves: 0 }, prizeLocation: { x: 0, y: 0 } });
    });
};
var play = function (machine) {
    var cache = new Map();
    var goXAxis = function (axPresses, bxPresses, xPrizeCoord) {
        var key = "x-".concat(axPresses, "-").concat(bxPresses);
        if (cache.has(key)) {
            return cache.get(key);
        }
        var calculatedXCoord = (axPresses * machine.buttonA.xMoves) + (bxPresses * machine.buttonB.xMoves);
        if (calculatedXCoord > xPrizeCoord) {
            return [];
        }
        if (calculatedXCoord === xPrizeCoord) {
            return [[axPresses, bxPresses]];
        }
        var xResults = [];
        if (calculatedXCoord + machine.buttonA.xMoves <= xPrizeCoord) {
            xResults = goXAxis(axPresses + 1, bxPresses, xPrizeCoord);
        }
        if (calculatedXCoord + machine.buttonB.xMoves <= xPrizeCoord) {
            xResults = __spreadArray(__spreadArray([], xResults, true), goXAxis(axPresses, bxPresses + 1, xPrizeCoord), true);
        }
        cache.set(key, xResults);
        return xResults;
    };
    var goYAxis = function (ayPresses, byPresses, yPrizeCoord) {
        var key = "y-".concat(ayPresses, "-").concat(byPresses);
        if (cache.has(key)) {
            return cache.get(key);
        }
        var calculatedYCoord = (ayPresses * machine.buttonA.yMoves) + (byPresses * machine.buttonB.yMoves);
        if (calculatedYCoord > yPrizeCoord)
            return [];
        if (calculatedYCoord === yPrizeCoord)
            return [[ayPresses, byPresses]];
        var yResults = [];
        if (calculatedYCoord + machine.buttonA.yMoves <= yPrizeCoord) {
            yResults = __spreadArray([], goYAxis(ayPresses + 1, byPresses, yPrizeCoord), true);
        }
        if (calculatedYCoord + machine.buttonB.yMoves <= yPrizeCoord) {
            yResults = __spreadArray(__spreadArray([], yResults, true), goYAxis(ayPresses, byPresses + 1, yPrizeCoord), true);
        }
        cache.set(key, yResults);
        return yResults;
    };
    var abxCombinations = goXAxis(0, 0, machine.prizeLocation.x);
    var abyCombinations = goYAxis(0, 0, machine.prizeLocation.y);
    console.log(abxCombinations);
    console.log(abyCombinations);
    return abxCombinations.reduce(function (acc, abx) {
        if (abyCombinations.some(function (aby) { return abx[0] === aby[0] && abx[1] === aby[1]; })) {
            console.log('found a match');
            return __spreadArray(__spreadArray([], acc, true), [{ aButtonPresses: abx[0], bButtonPresses: abx[1] }], false);
        }
        return acc;
    }, []);
};
var input = readInput();
/*
const fewestTokensToWinAllPossiblePrizes =
  input.map(play).map((playThroughs) => {
    return playThroughs.reduce((acc, pt) => {
      const tokenCount = (pt.aButtonPresses * 3) + (pt.bButtonPresses * 1);
      if (tokenCount < acc) return tokenCount;
      return acc;
    }, Number.MAX_SAFE_INTEGER);
  }).reduce((acc, tokens) => acc + tokens);
  */
console.log(play(input[0]));
