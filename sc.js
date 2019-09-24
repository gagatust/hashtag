"use strict";

let dev = true;
test();

fillSrcTextByUrlParams();

function fillSrcTextByUrlParams() {
    let requestParameter = get("p");
    if (typeof requestParameter !== 'undefined') {
        debug("request parameters are exist");
        let srcTextEl = getById("srcText");
        srcTextEl.textContent = requestParameter;
    }
}

function updateHashtag() {
    let srcTextEl = getById("srcText");
    let srcText = srcTextEl.value;
    let t = textToHashtag(srcText);
    let dstTextEl = getById("dstText");
    dstTextEl.textContent = t;
    copyTextToClipboard(t);
}

function textToHashtag(x) {
    let a = removeUnwantedSpace(x);
    let m = removeSpecialChars(a);
    a = m;
    let b = a.split(/[;,.|\r\n]+/g);
    let c = b.map(item => item.trim());
    let d = removeEmptyElements(c);
    let e = d.map(t => removeSpaces(t));
    let f = removeDuplicates(e);
    let g = wordListToHashTags(f);
    return g;
}

function removeUnwantedSpace(x) {
    return removeDuplicateSpaces(x).trim();
}

function removeDuplicateSpaces(x) {
    return x.replace(/ +(?= )/g, '');
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

//Base methods

/**
 * Получить параметр из utl
 * @param {string} name имя параметра
 * @returns {string}
 */
function get(name) {
    name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search);
    if (name) {
        return decodeURIComponent(name[1]);
    }
}

/**
 * Получить объект по id
 * @param {string} x id
 * @returns {Element}
 */
function getById(x) {
    return document.getElementById(x);
}

function removeDuplicates(x) {
    return [...new Set(x)];
}

function removeSpaces(x) {
    return x.replace(/[ \t]/g, '');
}

function toCamelCase(str) {
    return str
            .replace(/./, x => x.toUpperCase())
            .replace(/\s+./g, x => x.toUpperCase())
            .replace(/\s/g, '');

}

function removeSpecialChars(x) {
    return x.replace(/[!?#$%&~<>`'":=\|\\\^\?\[\]\(\)\{\}\+\-\*/]/g, "");
}

function isEqualArrays(x, y) {
    return (JSON.stringify(x) === JSON.stringify(y));
}

function print(x) {
    console.log(x);
}

function assert(x) {
    console.assert(x, x);
}

function dump(x) {
    console.log(JSON.stringify(x));
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

function debug(x) {
    if (dev) {
        dump(x);
    }
}

/**
 * Test
 */
function test() {
    if (dev) {
        debug("start test");
        assert(true);
        assert(isEqualArrays([1, 5, 6], [1, 5, 6]));
        assert(isEqualArrays(removeDuplicates([1, 6, 5, 6, 5, 1]), [1, 6, 5]));
        assert(isEqualArrays(removeDuplicates(["пш", 6, 5, "пш", 5, "кот"]), ["пш", 6, 5, "кот"]));
        assert(wordListToHashTags(["Ток", "кот", "2019"]) === "#Ток | #кот | #2019");
        let testData = " ПШ,  Граница  овала , 3 ;  4    1    \n2  , 5 ,,  ,7 , 4";
        assert(isEqualArrays(splitGroups(testData), [" ПШ", "  Граница  овала ", " 3 ", "  4    1    ", "2  ", " 5 ", "  ", "7 ", " 4"]));
        assert(textToHashtag(testData) === "#ПШ | #Границаовала | #3 | #41 | #2 | #5 | #7 | #4");
        assert(removeSpecialChars("sd( fda) adf[d][@35%&?<>:sdf!f|\\asd/ sdf+ = d#`~sdf\" ^ fg * #  ; , ds. d$fg") === "sd fda adfd@35sdffasd sdf  dsdf  fg    ; , ds. dfg");
        assert(toCamelCase("новый год ") === "НовыйГод");
        assert(toCamelCase("хэштег генератор") === "ХэштегГенератор");
        assert(toCamelCase("программа  по генерации хэштегов") === "ПрограммаПоГенерацииХэштегов");
        assert(toCamelCase(" иркутск  и иркутская область   ключевые   слова\t должны быть ") === "ИркутскИИркутскаяОбластьКлючевыеСловаДолжныБыть");
        debug("finish test");
    }
}