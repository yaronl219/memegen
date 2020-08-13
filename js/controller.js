'use strict'

var gCanvas;
var gCtx;
var gLayers = []
var gCanvasSize = { defaultWidth: 500, defaultHeight: 500, width: 500, height: 500, widthRatio: 1, heightRatio: 1, isSmall: false }


function openHamburgerMenu() {
    const menuContainer = document.querySelector('.mobile-menu')
        // menuContainer.classList.toggle('hidden')
    menuContainer.classList.toggle('mobile-menu-displayed')
}

function closeHamburgerMenu() {
    const menuContainer = document.querySelector('.mobile-menu')
    menuContainer.classList.toggle('mobile-menu-displayed')
        // menuContainer.classList.toggle('hidden')

}


function drawEditBox() {

}

function checkWindowWidth() {
    const windowWidth = window.innerWidth
    if (windowWidth < 650 && !gCanvasSize.isSmall) {
        gCanvasSize.isSmall = true
        resizeCanvas(gCanvasSize.defaultWidth * 0.7, gCanvasSize.defaultHeight * 0.7)
        repositionOnResize(0.7, 0.7)
    } else if (windowWidth >= 650 && gCanvasSize.isSmall) {
        gCanvasSize.isSmall = false
        repositionOnResize(gCanvasSize.defaultWidth / gCanvasSize.width, gCanvasSize.defaultHeight / gCanvasSize.height)
        resizeCanvas(gCanvasSize.defaultWidth, gCanvasSize.defaultHeight)
    }
}

function onDownload(elLink) {
    const download = gCanvas.toDataURL('image/png')
    elLink.href = download
    elLink.download = "canvas.png"
}

function resizeCanvas(width, height) {
    gCanvasSize.width = width
    gCanvasSize.height = height
    const widthRatio = gCanvasSize.width / gCanvasSize.defaultWidth
    const heightRatio = gCanvasSize.height / gCanvasSize.defaultHeight
    gCanvasSize.widthRatio = widthRatio
    gCanvasSize.heightRatio = heightRatio
    gCanvas.height = height
    gCanvas.width = width
    renderMeme()
}

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

    document.querySelector('.canvas-container').style.backgroundImage = `url(${getMemeImg(gMeme.selectedImgId)})`
}

function renderMeme() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    drawImgFromlocal()
}

function setTextLine() {
    const txt = document.querySelector('.textline-edit-input').value
    changeTextLine(txt)
}