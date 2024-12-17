"use strict";
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
                acc.prizeLocation = { x: 10000000000000 + parseInt(matched[1]), y: 10000000000000 + parseInt(matched[2]) };
            }
            return acc;
        }, { buttonA: { xMoves: 0, yMoves: 0 }, buttonB: { xMoves: 0, yMoves: 0 }, prizeLocation: { x: 0, y: 0 } });
    });
};
var play = function (machine) {
    var winningPlayThroughs = [];
    var maximumBButtonPresses = Math.min(Math.floor(machine.prizeLocation.x / machine.buttonB.xMoves), Math.floor(machine.prizeLocation.y / machine.buttonB.yMoves));
    for (var i = 0; i < maximumBButtonPresses;) {
        // 94a + 22b = 8400
        // 94a = 8400 - 22b
        // a = (8400 - 22b) / 94
        var aButtonPresses = (machine.prizeLocation.x - (machine.buttonB.xMoves * i)) / machine.buttonA.xMoves;
        if (aButtonPresses % 1 !== 0) {
            continue;
        }
        var bButtonPresses = i;
        var calculatedY = (machine.buttonA.yMoves * aButtonPresses) + (machine.buttonB.yMoves * bButtonPresses);
        console.log("calculatedY: ".concat(calculatedY, ", prizeY: ").concat(machine.prizeLocation.y));
        var doesYMatch = (machine.prizeLocation.y === calculatedY);
        if (doesYMatch) {
            console.log("aButtonPresses: ".concat(aButtonPresses, ", bButtonPresses: ").concat(bButtonPresses));
            winningPlayThroughs.push({ aButtonPresses: aButtonPresses, bButtonPresses: bButtonPresses });
        }
    }
    return winningPlayThroughs;
};
var input = readInput();
var fewestTokensToWinAllPossiblePrizes = input.map(play).map(function (playThroughs) {
    if (playThroughs.length === 0)
        return 0;
    return playThroughs.reduce(function (acc, pt) {
        var tokenCount = (pt.aButtonPresses * 3) + (pt.bButtonPresses * 1);
        if (tokenCount < acc)
            return tokenCount;
        return acc;
    }, Number.MAX_SAFE_INTEGER);
}).reduce(function (acc, tokens) { return acc + tokens; });
console.log(fewestTokensToWinAllPossiblePrizes);
