'use strict'

var gCanvas;
var gCtx;
var gCanvasSize = { defaultWidth: 500, defaultHeight: 500, width: 500, height: 500, widthRatio: 1, heightRatio: 1, isSmall: false }
var gIsCanvasTarget = false
var gTimeInterval = { 'blink': 0, 'reposition': 0 };
var gTouchCoords;

function init() {
    toggleEventListeners(true)
    onGalleryInit()
}

function onShareMeme(elForm, ev) {
    const shareButton = document.querySelector('.share-btn')
    shareButton.classList.toggle('loading')
        // calling the upload img function
    renderAndUploadImg(elForm, ev)
        // changing back from loader after 2 seconds have passed

    setTimeout(() => {
        shareButton.classList.toggle('loading')
    }, 2000)
}

function onImgUploadClicked() {
    document.querySelector('.file-input').click()
}

function onSaveMeme() {
    saveMemeToStorage()
    setTimeout(() => savedMemesScreenInit(), 100)

}

function displayWarning(txt) {
    const warningEl = document.querySelector('.flashing-notice-modal')
    warningEl.innerText = txt
    fadeInOutAnimation(warningEl, 300, 3000, 90)

}

function onTouchStartAndEnd(ev, isTouchStart) {
    if (isTouchStart && ev.target === gCanvas) {
        gTouchCoords = { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY }
    } else {
        gTouchCoords = null;
    }
}

function onTouchMove(ev) {
    if (gTouchCoords && ev.target === gCanvas) {
        const clientX = ev.changedTouches[0].clientX
        const clientY = ev.changedTouches[0].clientY
        const movementX = clientX - gTouchCoords.x
        const movementY = clientY - gTouchCoords.y
        gTouchCoords = { x: gTouchCoords.x += movementX, y: gTouchCoords.y += movementY }
        dragImage(movementX, movementY, clientX - gCanvas.offsetLeft, clientY - gCanvas.offsetTop)
        renderMeme()
    }
}

function onMouseDrag(ev) {
    if (ev.buttons > 0 && ev.target === gCanvas) {
        dragImage(ev.movementX, ev.movementY, ev.clientX - gCanvas.offsetLeft, ev.clientY - gCanvas.offsetTop)
        renderMeme()
    }
}


function drawEditMarker(shouldStart) {
    const displayMarker = document.querySelector('.canvas-place-marker')
    const canvasLocation = document.querySelector('.canvas')


    if (shouldStart) {
        startInterval()
    } else {
        stopInterval()
    }

    function startInterval() {
        stopInterval()
        gTimeInterval.reposition = setInterval(() => {
            var displayMarkerParams = getTextEditParams()
            displayMarker.style.fontSize = `${displayMarkerParams.fontSize *1.4}px`
            displayMarker.style.top = `${displayMarkerParams.yCoord + canvasLocation.offsetTop }px`
            displayMarker.style.left = `${displayMarkerParams.xCoord+ canvasLocation.offsetLeft - 15}px`
        }, 10);
        gTimeInterval.blink = setInterval(() => {
            hideEditMarkerIfOutOfBounds()
            displayMarker.classList.toggle('hidden')
        }, 500)
    }

    function stopInterval() {
        clearInterval(gTimeInterval.blink)
        clearInterval(gTimeInterval.reposition)
        displayMarker.classList.add('hidden')
    }

}

function openHamburgerMenu() {
    const menuContainer = document.querySelector('.mobile-menu')
    menuContainer.classList.toggle('mobile-menu-displayed')
}

function closeHamburgerMenu() {
    const menuContainer = document.querySelector('.mobile-menu')
    menuContainer.classList.toggle('mobile-menu-displayed')

}

function highlightRelevantNavs(state) {
    // remove the selected class from the previously selected ones
    const elToUnselect = document.querySelectorAll('.nav-link-selected')
    elToUnselect.forEach(el => el.classList.remove('nav-link-selected'))

    // create an object of all items
    const elements = {
        memes: [document.querySelector('.header-link-memes'), document.querySelector('.mobile-nav-memes')],
        gallery: [document.querySelector('.header-link-gallery'), document.querySelector('.mobile-nav-gallery')],
        about: [document.querySelector('.header-link-about'), document.querySelector('.mobile-nav-about')]
    }

    // if state was found in the elements object
    if (!elements[state]) return
        // add the selected class
    elements[state].forEach(el => el.classList.add('nav-link-selected'))



}

function onWindowClick(event) {
    // if user clicked within the canvas - trigger the line selection and focus on the hidden line for inline editing
    if (event.target === gCanvas) {
        document.querySelector('.hidden-text-line').focus()
        onSelectLineDirectly(event)
    } else {
        if (gCanvas) {
            drawEditMarker(false)
            renderMeme(false, false)
        }
    }
}

function onSelectLineDirectly(event) {
    // console.log(event)
    const xAxis = event.offsetX
    const yAxis = event.offsetY
    selectLineDirectly(xAxis, yAxis)
    updateTextController()
    drawEditMarker(true)

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
    drawImgFromlocal(true)

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
    renderMeme(true)
    getMemeLines()
}


function switchToSavedMemesScreen() {
    highlightRelevantNavs('memes')
    savedMemesScreenInit()
}

function onSwitchLine() {
    switchToNextLine()
    updateTextController()
}

function onChangeColor(el, kind) {
    const palette = document.querySelector('.color-pallete-modal')
    palette.classList.toggle('hidden')
    const color = el.style.backgroundColor
    console.log(color)
    if (kind === 'fill') {
        changeTextColor(color)
    } else {
        changeTextBorderColor(color)
    }
}

function onEnterColorText(el) {
    const elColorDisplay = document.querySelector('.color-picker-display')
    elColorDisplay.style.backgroundColor = el.value
}

function onAddLine() {
    const newLineIdx = createLine()
    renderMeme()
    switchToLineNumber(newLineIdx)
    updateTextController()
}

function onRemoveLine() {
    var newLine = removeLine()
    if (newLine === false) return displayWarning('Sorry, you cannot remove the last line', 250, 2000)
    switchToLineNumber(newLine)
    renderMeme()
    updateTextController()
}

function updateTextController() {
    const layerCounter = document.querySelector('.layer-counter')
    const lineObj = getCurrentLineAndLineCount()
    const currLine = lineObj.currLine
    const totalLines = lineObj.totalLines
    layerCounter.innerHTML = `<span class="chosen-line">${currLine+1}</span><span>/${totalLines}</span>`
    const currLineText = lineObj.txt
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
    highlightRelevantNavs(false)
    createCanvas()
    document.querySelector('.canvas-container').style.backgroundImage = `url(${getMemeImg(gMeme.selectedImgId)})`
}

function renderMeme(shouldDrawImage = false, shouldDrawOutline = true) {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    getMemeLines(shouldDrawOutline)
    if (shouldDrawImage) {
        drawImgFromlocal()
    }
}

function setTextLine(el) {
    const txt = el.value
    changeTextLine(txt)
    updateTextInputsValue(txt)
}

function updateTextInputsValue(txt) {
    const textInputs = document.querySelectorAll('.textline-edit-input')
    textInputs.forEach(input => input.value = txt)
}