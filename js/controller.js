'use strict'

var gCanvas;
var gCtx;
var gCanvasSize = { defaultWidth: 500, defaultHeight: 500, width: 500, height: 500, widthRatio: 1, heightRatio: 1, isSmall: false }
var gIsCanvasTarget = false



function init() {
    toggleEventListeners(true)
    switchToGalleryScreen()
}

// function onKeyPress(event) {
//     if (!gIsCanvasTarget) return
//     const currKey = event.key
//     getInCanvasKeyPress(currKey)
// }

function openHamburgerMenu() {
    const menuContainer = document.querySelector('.mobile-menu')
    menuContainer.classList.toggle('mobile-menu-displayed')
}

function closeHamburgerMenu() {
    const menuContainer = document.querySelector('.mobile-menu')
    menuContainer.classList.toggle('mobile-menu-displayed')

}

function highlightRelevantNavs(state) {
    // create an object of all items
    const elements = {
            memes: [document.querySelector('.header-link-memes'), document.querySelector('.mobile-nav-memes')],
            gallery: [document.querySelector('.header-link-gallery'), document.querySelector('.mobile-nav-gallery')],
            about: [document.querySelector('.header-link-about'), document.querySelector('.mobile-nav-about')]
        }
        // collate all keys to an array except for the chosen one
    let possibleLinks = []
    for (const key in elements) {
        if (key !== state) possibleLinks.push(key)
    }
    // remove the selected from them
    possibleLinks.forEach(el => {
        elements[el].forEach(element => {
            element.classList.remove('nav-link-selected')
        })
    });
    // highlight the chosen one if exists
    if (elements[state]) {
        elements[state].forEach(el => el.classList.add('nav-link-selected'))
    }

}

function onWindowClick(event) {
    // if user clicked within the canvas - trigger the line selection
    if (event.target === gCanvas) {
        gIsCanvasTarget = true
        document.querySelector('.hidden-text-line').focus()
        onSelectLineDirectly(event)
    } else {
        gIsCanvasTarget = false
    }
}

function onSelectLineDirectly(event) {
    const xAxis = event.offsetX
    const yAxis = event.offsetY
    selectLineDirectly(xAxis, yAxis)
    updateTextController()

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
    highlightRelevantNavs('gallery')
    renderGalleryScreen()
    populateGallery()
}

function resetMeme() {
    gCanvasSize = { defaultWidth: 500, defaultHeight: 500, width: 500, height: 500, widthRatio: 1, heightRatio: 1, isSmall: false }
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
    var newLine = removeLine()
    if (newLine === false) return console.log('cannot delete last row')
    renderMeme()
    switchToLineNumber(newLine)
    updateTextController()
}

function updateTextController() {
    const layerCounter = document.querySelector('.layer-counter')
    const lineObj = getCurrentLineAndLineCount()
    const currLine = lineObj.currLine
    const totalLines = lineObj.totalLines
    layerCounter.innerHTML = `<span class="chosen-line">${currLine+1}</span><span>/${totalLines}</span>`

    // const textInputField = document.querySelector('.textline-edit-input')
    const currLineText = lineObj.txt
        // textInputField.value = currLineText
    updateTextInputsValue(currLineText)
}

function onChangeFont() {
    const fontSelectionEl = document.querySelector('.select-dropdown')
    changeLineFont(fontSelectionEl.value)
    renderMeme()
}

function onEditTextLineParameters(clickedButton) {
    changeTextParameters(clickedButton)
    renderMeme()
}

function startMemeEdit() {
    // create amount of layers equivilent to the amount chose
    // addLayer()
    // switchToLayer(0)
    // var canvas = document.querySelector('.canvas-layer-0')
    highlightRelevantNavs(false)
    createCanvas()
    document.querySelector('.canvas-container').style.backgroundImage = `url(${getMemeImg(gMeme.selectedImgId)})`
}

function renderMeme() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    drawImgFromlocal()
}

function setTextLine(el) {
    const txt = el.value
    changeTextLine(txt)
    updateTextInputsValue(txt)
}



function updateTextInputsValue(txt) {
    // TODO: to update also in updateTextController()
    const textInputs = document.querySelectorAll('.textline-edit-input')
    textInputs.forEach(input => input.value = txt)
}