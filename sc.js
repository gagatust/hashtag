"use strict";
let srcTextEl = getById("srcText");
srcTextEl.textContent = "       1    \n2  ";
let srcText = srcTextEl.textContent;
let srcTextWithoutDuplocateSpace = removeDuplicateSpaces(srcText);
let strings = removeDuplicateSpaces(srcText);
srcTextEl.textContent = strings;
srcText = strings;
console.log(JSON.stringify(srcText));

function getById(x) {
    return document.getElementById(x);
}

function removeDuplicateSpaces(x) {
    //return x.replace(/\s+/g,' ');
    return x.replace(/ +(?= )/g, '');
}

function removeUnwantedSpace(x) {
    return removeDuplicateSpaces(x).trim();
}

function getStrings(x) {
    return x.split(/[\s,]+/);
}