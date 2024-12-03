"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    return fs.readFileSync(path.join(__dirname, "../inputs/day-3-input.txt"), 'utf-8');
};
var isDigit = function (char) {
    var digitRegex = /^-?\d$/;
    return digitRegex.test(char);
};
var parseMul = function (mul) {
    // parse numbers from string that looks like mul(123,123)
    var regex = /^mul\((\d{1,3}),(\d{1,3})\)$/;
    return { x: parseInt(mul.match(regex)[1]), y: parseInt(mul.match(regex)[2]) };
};
var getAllMuls = function (input, enableDoInstruct) {
    if (enableDoInstruct === void 0) { enableDoInstruct = false; }
    var mulFuncStartWithNumRegex = /^mul\(\d{1,3}$/;
    var mulFuncStartWithNumWithRemRegex = /^mul\(\d{1,2}$/; //mul(1 or mul(12
    var mulFuncStartWithNumAndCommaRegex = /^mul\(\d{1,3},$/; //mul(1, or mul(12, or mul(123,
    var mulFuncStartWithNumCommaAndNumRegex = /^mul\(\d{1,3},\d{1,3}$/; //mul(1,1 or mul(1,12 or mul(12, 1 or mul(12, 12 or mul(123, 1 or mul(123, 12
    var mulFuncStartWithNumCommaAndNumWithRemRegex = /^mul\(\d{1,3},\d{1,2}$/; //mul(1,1 or mul(1,12 or mul(12, 1 or mul(12, 12 or mul(123, 1 or mul(123, 12
    var chars = input.split('');
    var result = chars.reduce(function (acc, c) {
        if (c === "d") {
            if (acc.doFunc !== "")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "d", mulFunc: "" });
        }
        else if (c === "o") {
            if (acc.doFunc !== "d")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "do", mulFunc: "" });
        }
        else if (c === "n") {
            if (acc.doFunc !== "do")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "don", mulFunc: "" });
        }
        else if (c === "'") {
            if (acc.doFunc !== "don")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "don'", mulFunc: "" });
        }
        else if (c === "t") {
            if (acc.doFunc !== "don'")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "don't", mulFunc: "" });
        }
        else if (c === "m") {
            if (acc.mulFunc !== "")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "", mulFunc: "m" });
        }
        else if (c === "u") {
            if (acc.mulFunc !== "m")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "", mulFunc: "mu" });
        }
        else if (c === "l") {
            if (acc.mulFunc !== "mu")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "", mulFunc: "mul" });
        }
        else if (c === "(") {
            if (acc.mulFunc !== "mul"
                && acc.doFunc !== "do"
                && acc.doFunc !== "don't")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            if (acc.mulFunc === "mul")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "mul(" });
            if (acc.doFunc === "do")
                return __assign(__assign({}, acc), { doFunc: "do(", mulFunc: "" });
            if (acc.doFunc === "don't")
                return __assign(__assign({}, acc), { doFunc: "don't(", mulFunc: "" });
        }
        else if (isDigit(c)) {
            if (acc.mulFunc !== "mul("
                && !mulFuncStartWithNumWithRemRegex.test(acc.mulFunc)
                && !mulFuncStartWithNumAndCommaRegex.test(acc.mulFunc)
                && !mulFuncStartWithNumCommaAndNumWithRemRegex.test(acc.mulFunc))
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "", mulFunc: acc.mulFunc + c });
        }
        else if (c === ",") {
            if (!mulFuncStartWithNumRegex.test(acc.mulFunc))
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            return __assign(__assign({}, acc), { doFunc: "", mulFunc: acc.mulFunc + "," });
        }
        else if (c === ")") {
            if (!mulFuncStartWithNumCommaAndNumRegex.test(acc.mulFunc)
                && acc.doFunc !== "do(" && acc.doFunc !== "don't(")
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
            if (mulFuncStartWithNumCommaAndNumRegex.test(acc.mulFunc)) {
                var mul = parseMul(acc.mulFunc + ")");
                return __assign(__assign({}, acc), { doFunc: "", mulFunc: "", muls: __spreadArray(__spreadArray([], acc.muls, true), [__assign(__assign({}, mul), { enabled: true })], false) });
            }
            //if (acc.doFunc === "do(") return {...acc, enabled: true, doFunc: "", mulFunc: ""};
            //if (acc.doFunc === "don't(") return {...acc, enabled: false, doFunc: "", mulFunc: ""};
        }
        else {
            return __assign(__assign({}, acc), { doFunc: "", mulFunc: "" });
        }
    }, { enabled: true, doFunc: "", mulFunc: "", muls: [] });
    return [];
};
var day1p1Result = getAllMuls(readInput())
    .map(function (mul) { return mul.x * mul.y; })
    .reduce(function (acc, x) { return acc + x; });
var day1p2Result = getAllMuls(readInput(), true)
    .reduce(function (acc, mul) {
    if (mul.instruct === "do")
        return acc + (mul.x * mul.y);
    return acc;
}, 0);
console.log("Day 1 Part 1 Result: " + day1p1Result);
