"use strict";

let dev = false;
test();
testTrace();

let delimiter;
let toSingleWord;
let delimiterCode = getSafeIntUrlParams("d");
let toSingleWordCode = getSafeIntUrlParams("w");
fillSrcTextByUrlParams();
updateGlobalParams();

function fillSrcTextByUrlParams() {
    let requestParameter = getSafeUrlParams("p");
    if (requestParameter !== "") {
        requestParameter += "\n";
    }
    getSrc().textContent = requestParameter;
}

function updateGlobalParams() {
    delimiter = getDelimiter(delimiterCode);
    toSingleWord = getToSingleWord(toSingleWordCode);
}

function updateHashtag() {
    let srcText = getSrcText();
    let t = textToHashtag(srcText, delimiter, toSingleWord);
    getDst().textContent = t;
    copyTextToClipboard(t);
}

function updateUrl() {
    let srcText = getSrcText();
    let t = textToUrl(srcText);
    let a = '<a href="' + t + '">' + t + '</a>';
    getDst().innerHTML = a;
    copyTextToClipboard(t);
}

function getSrcText() {
    return getSrc().value;
}

function getSrc() {
    return getById("srcText");
}

function getDst() {
    return getById("dstText");
}

function textToHashtag(x, delimiter = " | ", toSingleWord = toCamelCaseClass) {
    let g = getGroups(x);
    let h = g.map(t => toSingleWord(t));
    let i = wordListToHashTags(h, delimiter);
    return i;
}

function textToUrl(x) {
    let g = getGroups(x);
    let wordkeys = g.join(",");
    let url = getUrlWithoutParameters();
    if (wordkeys !== "") {
        url += "?p=" + wordkeys;
    }
    return url;
}

function getToSingleWord(x) {
    switch (x) {
        case 0:
            return toCamelCaseClass;
        case 1:
            return toCamelCaseVariable;
    }
    return toCamelCaseClass;
}

function getDelimiter(x) {
    switch (x) {
        case 0:
            return " ";
        case 1:
            return " | ";
    }
    return " | ";
}

function getGroups(x) {
    let y = replaceSpecialCharsToSpace(x);
    let a = removeUnwantedSpace(y);
    let b = replaceSpecialCharsToDelimiter(a, ",");
    let c = splitGroups(b);
    let d = c.map(item => item.trim());
    let e = d.map(item => removeNumbers(item));
    let f = removeEmptyElements(e);
    let g = removeDuplicates(f);
    return g;
}

function removeUnwantedSpace(x) {
    return removeDuplicateSpaces(x).trim();
}

function removeDuplicateSpaces(x) {
    return x.replace(/ +(?= )/g, '');
}

function removeNumbers(x) {
    return x.replace(/^[\d ]+$/g, '');
}

function splitGroups(x) {
    return x.split(/[,]+/g);
}

function removeEmptyElements(x) {
    return x.filter(item => item !== "");
}

function addHashtag(x) {
    return x.map(e => e.charAt(0) === "@" ? e : "#" + e);
}

function wordListToHashTags(x, delimiter) {
    return addHashtag(x).join(delimiter);
}

//Base methods

function getSafeIntUrlParams(paramName) {
    return parseInt(getSafeUrlParams(paramName));
}

function getSafeUrlParams(paramName) {
    let param = getUrlParams(paramName);
    if (typeof param !== 'undefined') {
        debug(paramName + " parameter is set: " + param);
        return param;
    }
    return "";
}

/**
 * Получить параметр из utl
 * @param {string} name имя параметра
 * @returns {string}
 */
function getUrlParams(name) {
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

function getUrlWithoutParameters() {
    return location.protocol + '//' + location.host + location.pathname;
}

function removeDuplicates(x) {
    let array = x.map(t => [t.toString().toLowerCase(), t]);
    let map = new Map(array);
    return [...map.values()];
}

function toCamelCaseClass(str) {
    return toCamelCaseVariable(
            str.replace(/./, x => x.toUpperCase())
            );
}

function toCamelCaseVariable(str) {
    return str
            .replace(/\s+./g, x => x.toUpperCase())
            .replace(/\s/g, '');
}

function replaceSpecialCharsToSpace(x) {
    return x.replace(/[&/\+\-\*]+/g, " ");
}

function replaceSpecialCharsToDelimiter(x, d) {
    let a = replaceQuotesAndBracketsToDelimiter(x, d);
    return a.replace(/[–—−‒―%;:,#~=\\\.\?\!\|\^\$\r\n\t]+/g, d);
}

function replaceQuotesAndBracketsToDelimiter(x, y) {
    return x.replace(/[`'"»«“„”’‘<>\[\]\(\)\{\}]+/g, y);
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
        assert(isEqualArrays(removeDuplicates(["qw", "Qw", "io"]), ["Qw", "io"]));
        assert(isEqualArrays(removeDuplicates(["qw", "qw", "io"]), ["qw", "io"]));

        assert(wordListToHashTags(["Ток", "кот", "2019"], " | ") === "#Ток | #кот | #2019");
        assert(wordListToHashTags(["Ток", "кот", "2019"], " ") === "#Ток #кот #2019");

        let testData = " ПШ,  Граница  овала , 3 ;  4    1    \n2  , 5 ,,  ,7 , 4";
        let testData2 = " ПШ,  Граница  овала , мир ;  ток    мой    \n2  , я ,,  ,он , кто";
        let testDataSpecialChars = "кто( здесь) вот[и][@35%он&она?они<кот>видит:мышь!мы|или\\тут/ не+ равно= по#в`ко~от\"во ^ кем *у #  тех; кто, там. d$fg";
        let testResult = "#ПШ | #ГраницаОвала";
        let testResult2 = "#ПШ | #ГраницаОвала | #Мир | #ТокМой | #Я | #Он | #Кто";
        let testResult3 = "#УланУдэ | #КомсомольскНаАмуре | #НижнийТагил | #РостовНаДону | #МинеральныеВоды";

        assert(isEqualArrays(splitGroups("Мир,труд, май"), ["Мир", "труд", " май"]));
        assert(isEqualArrays(splitGroups("Мир,труд,, май"), ["Мир", "труд", " май"]));

        assert(textToHashtag(testData) === testResult);
        assert(textToHashtag(testData2) === testResult2);
        assert(textToHashtag(testResult) === testResult);
        assert(textToHashtag(testResult2) === testResult2);
        assert(textToHashtag("улан-удэ, комсомольск-на-амуре, нижний тагил, ростов-на-Дону, минеральные Воды") === testResult3);
        assert(textToHashtag("Улан-Удэ, Комсомольск-на-Амуре, Нижний Тагил, Ростов-на-Дону, Минеральные Воды") === testResult3);
        assert(textToHashtag("«Французские» - называются ещё «Треугольными», больше всего известны под термином «Ёлочки», иногда носят имя «Угловых кавычек»")
                === "#Французские | #НазываютсяЕщё | #Треугольными | #БольшеВсегоИзвестныПодТермином | #Ёлочки | #ИногдаНосятИмя | #УгловыхКавычек");
        assert(textToHashtag("“Английские двойные” или ‘Одиночные’ – известны как “лапки”, расположенные в верхней части.")
                === "#АнглийскиеДвойные | #Или | #Одиночные | #ИзвестныКак | #Лапки | #РасположенныеВВерхнейЧасти");
        assert(textToHashtag("„Немецкие“ – имеют второе название - „развёрнутые лапки“")
                === "#Немецкие | #ИмеютВтороеНазвание | #РазвёрнутыеЛапки");
        assert(textToHashtag('Иногда "слово" заключают в верхние ровные символы.') === "#Иногда | #Слово | #ЗаключаютВВерхниеРовныеСимволы");
        assert(textToHashtag("5 человек") === "#5Человек");
        assert(textToHashtag(" 11 09 событие") === "#1109Событие");
        assert(textToHashtag(testDataSpecialChars) ===
                "#Кто | #Здесь | #Вот | #И | @35 | #ОнОна | #Они | #Кот | #Видит | #Мышь | #Мы | #Или | #ТутНеРавно | #По | #В | #Ко | #От | #Во | #КемУ | #Тех | #Там | #D | #Fg");
        assert(textToHashtag("вам, тебе") === "#Вам | #Тебе");
        assert(textToHashtag("вам, тебе", " ") === "#Вам #Тебе");
        assert(textToHashtag("вам, тебе", ", ") === "#Вам, #Тебе");

        assert(replaceSpecialCharsToDelimiter("Вот:пир,мир", ",") === "Вот,пир,мир");
        assert(replaceSpecialCharsToDelimiter(testDataSpecialChars, ",")
                === "кто, здесь, вот,и,@35,он&она,они,кот,видит,мышь,мы,или,тут/ не+ равно, по,в,ко,от,во , кем *у ,  тех, кто, там, d,fg");
        assert(replaceSpecialCharsToDelimiter("я–мы—он−она‒они―ты", ",")
                === "я,мы,он,она,они,ты");

        assert(replaceSpecialCharsToSpace(testDataSpecialChars)
                === "кто( здесь) вот[и][@35%он она?они<кот>видит:мышь!мы|или\\тут  не  равно= по#в`ко~от\"во ^ кем  у #  тех; кто, там. d$fg");

        assert(toCamelCaseClass("новый год ") === "НовыйГод");
        assert(toCamelCaseClass("хэштег генератор") === "ХэштегГенератор");
        assert(toCamelCaseClass("программа  по генерации хэштегов") === "ПрограммаПоГенерацииХэштегов");
        assert(toCamelCaseClass(" иркутск  и иркутская область   ключевые   слова\t должны быть ")
                === "ИркутскИИркутскаяОбластьКлючевыеСловаДолжныБыть");

        assert(toCamelCaseVariable("новый год ") === "новыйГод");
        assert(toCamelCaseVariable("хэштег генератор") === "хэштегГенератор");
        assert(toCamelCaseVariable("программа  по генерации хэштегов") === "программаПоГенерацииХэштегов");

        assert(getToSingleWord(0).name === "toCamelCaseClass");
        assert(getToSingleWord(1).name === "toCamelCaseVariable");
        assert(getToSingleWord(8).name === "toCamelCaseClass");

        assert(removeNumbers("программа") === "программа");
        assert(removeNumbers("123") === "");
        assert(removeNumbers("1 3") === "");
        assert(removeNumbers("1 ") === "");
        assert(removeNumbers(" 1") === "");
        assert(removeNumbers(" 1 78a") === " 1 78a");
        assert(removeNumbers("1 a") === "1 a");
        assert(removeNumbers("123программа") === "123программа");
        assert(removeNumbers("программа123") === "программа123");

        assert(replaceQuotesAndBracketsToDelimiter("'wer'''", "0") === "0wer0");

        assert(isEqualArrays(addHashtag(["gj", "sf", "er@se", "@qw", "we", "as@j", "@w"]), ["#gj", "#sf", "#er@se", "@qw", "#we", "#as@j", "@w"]));

        debug("finish test");
    }
}

function testTrace() {
}