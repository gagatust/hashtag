"use strict";

let dev = false;
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
    let y = x.replace(/\-/g, ' ');
    let a = removeUnwantedSpace(y);
    let b = removeSpecialChars(a);
    let c = splitGroups(b);
    let d = c.map(item => item.trim());
    let e = d.map(item => removeStartedWithNumer(item));
    let f = removeEmptyElements(e);
    let g = f.map(t => toCamelCase(t));
    let h = removeDuplicates(g);
    let i = wordListToHashTags(h);
    return i;
}

function removeUnwantedSpace(x) {
    return removeDuplicateSpaces(x).trim();
}

function removeDuplicateSpaces(x) {
    return x.replace(/ +(?= )/g, '');
}

function removeStartedWithNumer(x) {
    return x.replace(/^[0-9].*/g, '');
}

function splitGroups(x) {
    return x.split(/[»«–—“„”’‘;,#\.\|\r\n]+/g);
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
    return x.replace(/[!?$%&~<>`'":=\\\^\?\[\]\(\)\{\}\+\-\*/]/g, "");
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
        let testData2 = " ПШ,  Граница  овала , мир ;  ток    мой    \n2  , я ,,  ,он , кто";
        let testResult = "#ПШ | #ГраницаОвала";
        let testResult2 = "#ПШ | #ГраницаОвала | #Мир | #ТокМой | #Я | #Он | #Кто";
        let testResult3 = "#УланУдэ | #КомсомольскНаАмуре | #НижнийТагил | #РостовНаДону | #МинеральныеВоды";

        assert(isEqualArrays(splitGroups(testData), [" ПШ", "  Граница  овала ", " 3 ", "  4    1    ", "2  ", " 5 ", "  ", "7 ", " 4"]));
        assert(isEqualArrays(splitGroups(testResult), ["", "ПШ ", " ", "ГраницаОвала"]));
        assert(isEqualArrays(splitGroups(testResult2), ["", "ПШ ", " ", "ГраницаОвала ", " ", "Мир ", " ", "ТокМой ", " ", "Я ", " ", "Он ", " ", "Кто"]));

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
        assert(textToHashtag('Иногда "слово" заключают в верхние ровные символы.') === "#ИногдаСловоЗаключаютВВерхниеРовныеСимволы");
        assert(removeSpecialChars("sd( fda) adf[d][@35%&?<>:sdf!f|\\asd/ sdf+ = d#`~sdf\" ^ fg * #  ; , ds. d$fg")
                === "sd fda adfd@35sdff|asd sdf  d#sdf  fg  #  ; , ds. dfg");

        assert(toCamelCase("новый год ") === "НовыйГод");
        assert(toCamelCase("хэштег генератор") === "ХэштегГенератор");
        assert(toCamelCase("программа  по генерации хэштегов") === "ПрограммаПоГенерацииХэштегов");
        assert(toCamelCase(" иркутск  и иркутская область   ключевые   слова\t должны быть ")
                === "ИркутскИИркутскаяОбластьКлючевыеСловаДолжныБыть");

        assert(removeStartedWithNumer("программа") === "программа");
        assert(removeStartedWithNumer("123") === "");
        assert(removeStartedWithNumer("123программа") === "");
        assert(removeStartedWithNumer("программа123") === "программа123");

        debug("finish test");
    }
}