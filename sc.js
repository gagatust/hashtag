"use strict";
let dev = true;
let requestParameter = get("p");

if (typeof requestParameter !== 'undefined') {
    debug("request parameters are exist")
    let srcTextEl = getById("srcText");
    srcTextEl.textContent = requestParameter;
}

test();

function updateHashtag() {
    let srcTextEl = getById("srcText");
    let srcText = srcTextEl.value;
    let t = textToHashtag(srcText);
    let dstTextEl = getById("dstText");
    dstTextEl.textContent = t;
    copyTextToClipboard(t);
}
function dump(x) {
    console.log(JSON.stringify(x));
}

function debug(x) {
    if (dev) {
        dump(x);
    }
}

function print(x) {
    console.log(x);
}

function assert(x) {
    console.assert(x, x);
}

function getById(x) {
    return document.getElementById(x);
}

function removeDuplicateSpaces(x) {
    return x.replace(/ +(?= )/, '');
}

function removeUnwantedSpace(x) {
    return removeDuplicateSpaces(x).trim();
}

function removeSpaces(x) {
    return x.replace(/ /g, '');
}

function format(x) {
    return removeUnwantedSpace(replaceLinebreaks(x, ","));
}

function textToHashtag(x) {
    let a = removeUnwantedSpace(x);
    let b = a.split(/[;,|\r\n]+/);
    let c = b.map(item => item.trim());
    let d = removeEmptyElements(c);
    let e = d.map(t => removeSpaces(t));
    let f = removeDuplicates(e);
    let g = wordListToHashTags(f);
    return g;
}

function splitGroups(x) {
    return x.split(/[;,|\r\n]+/g);
}

function removeEmptyElements(x) {
    return x.filter(item => item !== "");
}

function addHashtag(x) {
    return x.map(e => "#" + e);
}

function wordListToHashTags(x, delimiter = " | ") {
    return addHashtag(x).join(delimiter);
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        debug('Copying text command was ' + msg);
    } catch (err) {
        debug('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function removeDuplicates(x) {
    return [...new Set(x)];
}

function isEqualArrays(x, y) {
    return (JSON.stringify(x) === JSON.stringify(y));
}

function test() {
    if (dev) {
        debug("start test")
        assert(true);
        assert(isEqualArrays([1, 5, 6], [1, 5, 6]));
        assert(isEqualArrays(removeDuplicates([1, 6, 5, 6, 5, 1]), [1, 6, 5]));
        assert(isEqualArrays(removeDuplicates(["пш", 6, 5, "пш", 5, "кот"]), ["пш", 6, 5, "кот"]));
        assert(wordListToHashTags(["Ток", "кот", "2019"]) === "#Ток | #кот | #2019");
        let testData = " ПШ,  Граница  овала , 3 ;  4    1    \n2  , 5 ,,  ,7 , 4";
        assert(isEqualArrays(splitGroups(testData), [" ПШ", "  Граница  овала ", " 3 ", "  4    1    ", "2  ", " 5 ", "  ", "7 ", " 4"]));
        assert(textToHashtag(testData) === "#ПШ | #Границаовала | #3 | #41 | #2 | #5 | #7 | #4");
        debug("finish test")
    }
}