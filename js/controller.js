'use strict'

var gCanvas;
var gCtx;
var gCanvasSize = { defaultWidth: 500, defaultHeight: 500, width: 500, height: 500, widthRatio: 1, heightRatio: 1, isSmall: false }
var gTouchCoords;
var gTimeInterval = { 'blink': 0, 'reposition': 0 };
var gCurrImage;

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
    }, 3000)
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
        dragLine(movementX, movementY, clientX - gCanvas.offsetLeft, clientY - gCanvas.offsetTop)
        renderMeme()
    }
}

function onMouseDrag(ev) {
    if (ev.buttons > 0 && ev.target === gCanvas) {
        dragLine(ev.movementX, ev.movementY, ev.clientX - gCanvas.offsetLeft, ev.clientY - gCanvas.offsetTop)
        renderMeme()
    }
}


function drawEditMarker(shouldStart) {
    const displayMarker = document.querySelector('.canvas-place-marker')
    const canvasLocation = document.querySelector('.canvas')


    if (shouldStart) {
        (startInterval())
    } else {
        (stopInterval())
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
            // if gCanvas is not null - means we are in the edit meme screen
            drawEditMarker(false)
            renderMeme(false, false)
        }
    }
}

function onSelectLineDirectly(event) {
    selectLineDirectly(event.offsetX, event.offsetY)
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
    renderMeme(false)
    downloadMeme()
}

function resizeCanvas(width, height) {
    gCanvasSize.width = width
    gCanvasSize.height = height
    gCanvasSize.widthRatio = gCanvasSize.width / gCanvasSize.defaultWidth
    gCanvasSize.heightRatio = gCanvasSize.height / gCanvasSize.defaultHeight
    gCanvas.height = height
    gCanvas.width = width
    renderMeme(true)
    getMemeLines()
}


function switchToSavedMemesScreen() {
    highlightRelevantNavs('memes')
    savedMemesScreenInit()
}

function selectLineDirectly(x, y) {
    const selectedLine = isClickedPixelLine(x, y)
    if (selectedLine === false) return
    switchToLineNumber(selectedLine)
    renderMeme()
}

function onChangeColor(el, kind) {
    const palette = document.querySelector('.color-pallete-modal')
    palette.classList.toggle('hidden')
    const color = el.style.backgroundColor

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
    const line = getCurrentLineAndLineCount()
    const currLine = line.currLine
    const totalLines = line.totalLines
    layerCounter.innerHTML = `<span class="chosen-line">${currLine+1}</span><span>/${totalLines}</span>`
    const currLineText = line.txt
    updateTextInputsValue(currLineText)
}

function onChangeFont() {
    const fontSelectionEl = document.querySelector('.select-dropdown')
    changeLineFont(fontSelectionEl.value)
    renderMeme()
}

function onChangeFontSize(val) {
    changeFontSize(val)
}

function onChangeTextAlignment(clickedButton) {
    changeTextAlignment(clickedButton)
    renderMeme()
}

function onSwitchLine() {
    switchToNextLine()
    updateTextController()
}

function startMemeEdit() {
    highlightRelevantNavs(false)
    createCanvas()
}

function renderMeme(shouldDrawOutline = true) {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    drawImage()
    getMemeLines(shouldDrawOutline)

}

function drawImage() {
    gCtx.drawImage(gCurrImage, 0, 0, gCanvas.width, gCanvas.height)
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


function initMemeEditor() {
    getAspectRatio()
    checkWindowWidth()
    renderMeme()
    scrollToTop()
    updateTextInputsValue(getFirstLineOfText())
}

function renderImage() {

    gCurrImage = new Image()
    gCurrImage.crossOrigin = 'anonymous'
    gCurrImage.src = getMemeImg(getSelectedImgId())

    gCurrImage.onload = () => {
        let font = new FontFaceObserver('impact');
        font.load().then(initMemeEditor);

    }
}

function toggleEventListeners(shouldAdd) {
    if (shouldAdd) {
        document.addEventListener('click', () => onWindowClick(event))
        document.addEventListener('mousemove', () => onMouseDrag(event))
        document.addEventListener('touchmove', () => onTouchMove(event))
        document.addEventListener('touchstart', () => onTouchStartAndEnd(event, true))
        document.addEventListener('touchend', () => onTouchStartAndEnd(event, false))

    } else {
        document.removeEventListener('click', () => onWindowClick(event))
    }
}