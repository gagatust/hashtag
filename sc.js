"use strict";

let requestParameter = get("p");
if (typeof requestParameter !== 'undefined') {
    dump("!!");
    let srcTextEl = getById("srcText");
    srcTextEl.textContent = requestParameter;
}

function updateHashtag() {
    let srcTextEl = getById("srcText");
    dump(srcTextEl.value);
    
    //srcTextEl.value = " ПШ,  Граница  овала , 3 ;  4    1    \n2  , 5 ,,  ,7 , 4";

    let srcText = srcTextEl.value;
    let t = f(srcText);
    let dstTextEl = getById("dstText");
    dstTextEl.textContent = t;
    copyTextToClipboard(t);

    dump(get('p'));
}
function dump(x) {
    console.log(JSON.stringify(x));
}

function print(x) {
    console.log(x);
}

function getById(x) {
    return document.getElementById(x);
}

function removeDuplicateSpaces(x) {
    return x.replace(/ +(?= )/g, '');
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

function f(x) {
//    return x.split(/(?:;,| )+/);
    let a = removeUnwantedSpace(x);
    dump(a);
    let b = a.split(/[;,|\r\n]+/);
    dump(b);
    let c = b.map(item => item.trim());
    dump(c);
    let d = removeEmptyElements(c);
    dump(d);
    let f = d.map(e => removeSpaces(e));
    dump(f);
    dump(addHashtag(f));
    dump(wordListToHashTags(f));
    let g = wordListToHashTags(f);
    return g;
}

function removeEmptyElements(x) {
    return x.filter(item => item !== "");
}

function addHashtag(x) {
    return x.map(e => "#" + e);
}

function wordListToHashTags(x) {
    return  addHashtag(x).join(" | ");
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
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

//function getStrings(x) {
//    return x.split(/[\s,]+/);
//}

//function replaceLinebreaks(s, delimiter) {
//    return s.replace(/[\r\n]+/gm, delimiter);
//}
