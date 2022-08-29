const WeightedMarkovGenerator = require('weighted-markov-generator').WeightedMarkovGenerator;

// Page Setup

function clearElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function addElement(parent, etype, className="", idName="") {
    let e = document.createElement(etype);
    parent.appendChild(e);
    e.className = className;
    e.setAttribute("id", idName);
    return e;
}

function setupInputRow() {
    let inputRow = document.getElementById("input-row");
    let inputCol = addElement(inputRow, "div", "col");
    inputCol.style.padding = "0px";
    let slRow = addElement(inputCol, "div", "row");
    let ncRow = addElement(inputCol, "div", "row");
    let swRow = addElement(inputCol, "div", "row");
    let ewRow = addElement(inputCol, "div", "row");
    slRow.style.margin = "5px 0px";
    ncRow.style.margin = "5px 0px";
    swRow.style.margin = "5px 0px";
    ewRow.style.margin = "5px 0px";
    let slInputDiv = addElement(slRow, "div", "col-sm-6");
    let slInputText = addElement(slRow, "p", "font-italic text-muted");
    slInputText.textContent = "markov chain length";
    let ncInputDiv = addElement(ncRow, "div", "col-sm-6");
    let ncInputText = addElement(ncRow, "p", "font-italic text-muted");
    ncInputText.textContent = "output length";
    let swInputDiv = addElement(swRow, "div", "col-sm-6");
    let swInputText = addElement(swRow, "p", "font-italic text-muted");
    swInputText.textContent = "starts with [optional]";
    let ewInputDiv = addElement(ewRow, "div", "col-sm-6");
    let ewInputText = addElement(ewRow, "p", "font-italic text-muted");
    ewInputText.textContent = "ends with [optional]";
    let slInput = addElement(slInputDiv, "input", "form-control", "sl-input");
    let ncInput = addElement(ncInputDiv, "input", "form-control", "nc-input");
    let swInput = addElement(swInputDiv, "input", "form-control", "sw-input");
    let ewInput = addElement(ewInputDiv, "input", "form-control", "ew-input");
    slInput.value = "5";
    ncInput.value = "200";
    ewInput.value = ".";
}

function setupOutbox() {
    let outbox = document.getElementById("outbox");
    outbox.style.borderStyle = "dashed";
    outbox.style.background = "#eee";
    let outText = addElement(outbox, "p", "", "output-text");
    outText.style.padding = "10px";
    outText.textContent = "output comes here";
}

function addOutput(text) {
    let outbox = document.getElementById("outbox");
    outbox.style.borderStyle = "solid";
    clearElements(outbox);
    let outText = addElement(outbox, "p", "", "output-text");
    outText.style.padding = "10px";
    outText.textContent = text;
}

setupInputRow();
setupOutbox();

// Generate Logic

function readValues() {
    let seedTextArea = document.getElementById("seed-text");
    let slInput = document.getElementById("sl-input");
    let ncInput = document.getElementById("nc-input");
    let swInput = document.getElementById("sw-input");
    let ewInput = document.getElementById("ew-input");
    let st = seedTextArea.value;
    let sl = parseInt(slInput.value);
    let nc = parseInt(ncInput.value);
    let sw = swInput.value;
    let ew = ewInput.value;
    return {
        "seedText": st,
        "seedLength": sl,
        "numChar": nc,
        "startsWith": sw,
        "endsWith": ew
    }
}

function outputValues() {
    let params = readValues();
    console.log("Creating a new markov generator");
    let generator = new WeightedMarkovGenerator(params["seedLength"]);
    params["seedText"].split(/\r?\n/).forEach(text => {
        text = text.trim();
        generator.seedText(text);
    });
    try {
        let generatedText = generator.generateText(params["numChar"], params["startsWith"], params["endsWith"]);
        addOutput(generatedText);
    } catch (e) {
        alert(e.message);
    }
}

function setupMainButton() {
    let mainButton = document.getElementById("main-button");
    mainButton.onclick = () => {
        outputValues();
    }
}

setupMainButton();

// Prepopulated examples

const EXAMPLE_MAP = {
    "Robin Hood": "/examples/robin_hood.txt",
    "Trump Speech": "/examples/trump_speech.txt",
    "Navy Seal Copypasta": "/examples/navy_seal_copypasta.txt",
    "武松打虎": "/examples/wusong.txt",
    "War and Peace": "/examples/war_and_peace.txt"
}

function buildSelect() {
    let select = document.getElementById("select-existing");
    for (const name in EXAMPLE_MAP) {
        let option = addElement(select, "option");
        option.setAttribute("value", name);
        option.textContent = name
    }
    select.onchange = function () {
        let name = select.value;
        if (name in EXAMPLE_MAP) {
            loadText(EXAMPLE_MAP[name]);
        } else {
            let seedTextArea = document.getElementById("seed-text");
            seedTextArea.value = "";
        }
    }
}

function loadText(path) {
    let seedTextArea = document.getElementById("seed-text");
    if (!(location.hostname == "0.0.0.0")) {
        path = `/markov${path}`
    }
    let request = new XMLHttpRequest();
    request.onload = function () {
        let result = this.response;
        seedTextArea.value = result;
    }
    request.open('GET', path);
    request.send();
}

buildSelect();
