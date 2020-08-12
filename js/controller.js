'use strict'

var gCanvas;
var gCtx;
var gLayers = []

function switchToGalleryScreen() {
    renderGalleryScreen()
    populateGallery()
}

function onSwitchLine() {
    switchToNextLine()
    updateTextController()
}

function onAddLine() {
    const newLineIdx = createLine()
    renderMeme()
    switchToLineNumber(newLineIdx)
    updateTextController()
}

function onRemoveLine() {
    if (!removeLine()) return console.log('cannot delete last row')
    renderMeme()
    switchToLineNumber(0)
    updateTextController()
}

function updateTextController() {
    const layerCounter = document.querySelector('.layer-counter')
    const lineObj = getCurrentLineAndLineCount()
    const currLine = lineObj.currLine
    const totalLines = lineObj.totalLines
    layerCounter.innerHTML = `<span class="chosen-line">${currLine+1}</span><span>/${totalLines}</span>`

    const textInputField = document.querySelector('.textline-edit-input')
    const currLineText = lineObj.txt
    textInputField.value = currLineText
}

function onChangeFont() {
    const fontSelectionEl = document.querySelector('.select-dropdown')
    changeLineFont(fontSelectionEl.value)
    renderMeme()
}

function editTextLineParameters(clickedButton) {
    changeTextParameters(clickedButton)
    renderMeme()
}

function startMemeEdit() {
    // create amount of layers equivilent to the amount chose
    addLayer()
    switchToLayer(0)
    var canvas = document.querySelector('.canvas-layer-0')
    canvas.style.backgroundImage = `url(${getMemeImg(gMeme.selectedImgId)})`
}

function renderMeme() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    drawImgFromlocal()
}

function setTextLine() {
    const txt = document.querySelector('.textline-edit-input').value
    changeTextLine(txt)
}