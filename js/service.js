'use strict'


var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [getDefaultLine()]
}

function resetMeme() {
    gCanvasSize = { defaultWidth: 500, defaultHeight: 500, width: 500, height: 500, widthRatio: 1, heightRatio: 1, isSmall: false }
}

function getDefaultLine() {
    return {
        txt: 'Edit me',
        size: 46,
        align: 'center',
        textColor: 'white',
        borderColor: 'black',
        fontFamily: 'impact',
        top: 100,
        left: 250,
        boundingBox: {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        }
    }
}

function resetLines() {
    gMeme.lines = [getDefaultLine()]
}

function dragLine(x, y, clientX, clientY) {
    var selectedLine = isClickedPixelLine(clientX, clientY)
    if (selectedLine === false) return
    switchToLineNumber(selectedLine)
    gMeme.lines[selectedLine].top += y
    gMeme.lines[selectedLine].left += x

}

function hideEditMarkerIfOutOfBounds() {
    const elMarker = document.querySelector('.canvas-place-marker')
    const canvasBounds = {
        left: gCanvas.offsetLeft,
        right: gCanvas.offsetLeft + gCanvas.offsetWidth,
        top: gCanvas.offsetTop,
        bottom: gCanvas.offsetTop + gCanvas.offsetHeight
    }

    const elMarkerContainer = document.querySelector('.canvas-place-marker-container')
        // if out of bounds
    if (parseInt(elMarker.style.left) < canvasBounds.left ||
        parseInt(elMarker.style.top) < canvasBounds.top ||
        parseInt(elMarker.style.left) > canvasBounds.right ||
        parseInt(elMarker.style.bottom) > canvasBounds.bottom) {
        elMarkerContainer.classList.add('hidden')
    } else {
        elMarkerContainer.classList.remove('hidden')

    }

}

function checkIfDragOutOfBounds(x, y, selectedLine) {
    // checks if target is out of bounds and returns true if out
    const newXCoords = gMeme.lines[selectedLine].left + x
    const newYCoords = gMeme.lines[selectedLine].top + y
    const boundingBox = gMeme.lines[selectedLine].boundingBox
    if (newXCoords - (boundingBox.width / 2) < 0 ||
        newYCoords - (boundingBox.height / 2) < 0 ||
        newXCoords + (boundingBox.width / 2) > gCanvas.width ||
        newYCoords + (boundingBox.height / 2) > gCanvas.height) {
        return true
    }

    return false
}

function getTextEditParams() {
    const currLine = gMeme.lines[gMeme.selectedLineIdx]
    const yCoord = currLine.boundingBox.top
    const xCoord = currLine.boundingBox.left + currLine.boundingBox.width
    const fontSize = currLine.size
    return { xCoord, yCoord, fontSize }
}


function changeFontSize(val) {
    const oper = (val === '+') ? 2 : -2
    gMeme.lines[gMeme.selectedLineIdx].size += oper

}

function repositionOnResize(width, height) {
    gMeme.lines.forEach(line => {
        line.top = line.top * height
        line.left = line.left * width
        line.size = line.size * ((height + width) / 2)
    });
}

function removeLine() {
    if (gMeme.lines.length === 1) return false
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    let newLine = gMeme.selectedLineIdx - 1
    if (newLine < 0) newLine = 0

    return newLine
}


function createLine() {
    const amountOfLines = gMeme.lines.length
    const canvasHeight = gCanvas.height
    const canvasWidth = gCanvasSize.width
    var newLineTop;
    if (amountOfLines === 0) {
        newLineTop = Math.round(canvasHeight * 0.2)
    } else if (amountOfLines === 1) {
        newLineTop = Math.round(canvasHeight * 0.8)
    } else {
        newLineTop = Math.round(canvasHeight / 2)
    }
    var line = getDefaultLine()
    line.top = newLineTop
    line.left = Math.round(canvasWidth / 2)
    gMeme.lines.push(line)
        // return the amount of lines (now the last row)
    return amountOfLines
}

function getCurrentLineAndLineCount() {
    return { currLine: gMeme.selectedLineIdx, totalLines: gMeme.lines.length, txt: gMeme.lines[gMeme.selectedLineIdx].txt }
}

function changeTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].textColor = color
}

function changeTextBorderColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].borderColor = color
}

function changeLineFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = font
}

function isClickedPixelLine(x, y) {
    // checks if the click pixel has a line in it
    for (var i = gMeme.lines.length - 1; i >= 0; i--) {
        const boundingBox = gMeme.lines[i].boundingBox
        if (boundingBox.left <= x && boundingBox.top <= y && boundingBox.left + boundingBox.width >= x && boundingBox.top + boundingBox.height >= y) {
            return i
        }
    }
    return false
}



function switchToLineNumber(num) {
    if (num >= gMeme.lines.length) return
    gMeme.selectedLineIdx = num
    drawOutlineBox()
}

function switchToNextLine() {
    const currentLine = gMeme.selectedLineIdx
    let nextLine = currentLine + 1
    if (nextLine >= gMeme.lines.length) nextLine = 0
    gMeme.selectedLineIdx = nextLine
    renderMeme()
    drawOutlineBox()
}


function getSelectedImgId() {
    return gMeme.selectedImgId
}


function downloadMeme() {
    const download = gCanvas.toDataURL('image/png')
    let elLink = document.createElement('a')
    elLink.href = download
    elLink.download = "my meme.png"
    document.body.appendChild(elLink)
    elLink.click()
    document.body.removeChild(elLink)
}

function changeTextAlignment(align) {
    const currLine = gMeme.lines[gMeme.selectedLineIdx]
    switch (align) {
        case 'alignLeft':
            currLine.align = 'left'
            currLine.left = 1
            break;
        case 'alignCenter':
            currLine.align = 'center'
            currLine.left = Math.round(gCanvasSize.width / 2)
            break;
        case 'alignRight':
            currLine.align = 'right'
            currLine.left = gCanvasSize.width - 1
            break;
    }
    updateBoundingBoxParams()
}

function getMemeLines(shouldDrawOutline = true) {
    gMeme.lines.forEach((line, idx) => {
        drawText(idx, line.left, line.top)
    });
    updateBoundingBoxParams()

    if (shouldDrawOutline) {
        drawOutlineBox()
    }
}

function changeTextLine(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    renderMeme()
    drawOutlineBox()
}

function getFirstLineOfText() {
    return getLineText(0)
}

function getLineText(lineIdx) {
    return gMeme.lines[lineIdx].txt
}

function getMemeImg(id) {
    const reqItem = getIdxById(id, gImgs)
    return reqItem.url
}

function updateBoundingBoxParams() {
    gMeme.lines.forEach((line, idx) => {
        // const textSize = drawText(currLineIdx, gMeme.lines[currLineIdx].left, gMeme.lines[currLineIdx].top,false)
        const currLineBoundingBox = calculateOutlineBox(idx)
        line.boundingBox.left = currLineBoundingBox.boundingBoxLeft
        line.boundingBox.top = currLineBoundingBox.boundingBoxTop
        line.boundingBox.height = currLineBoundingBox.boundingBoxHeight
        line.boundingBox.width = currLineBoundingBox.boundingBoxWidth
    })
}

function calculateOutlineBox(line = gMeme.selectedLineIdx) {
    const fixedPadding = 15
    const currLineIdx = line
    const textSize = drawText(currLineIdx, gMeme.lines[currLineIdx].left, gMeme.lines[currLineIdx].top, false)
    const boundingBoxTop = gMeme.lines[currLineIdx].top - textSize.actualBoundingBoxAscent - fixedPadding
    const boundingBoxLeft = gMeme.lines[currLineIdx].left - textSize.actualBoundingBoxLeft - fixedPadding
    const boundingBoxWidth = textSize.width + (fixedPadding * 2)
    const boundingBoxHeight = textSize.actualBoundingBoxAscent + (fixedPadding * 2)

    return { boundingBoxTop, boundingBoxLeft, boundingBoxWidth, boundingBoxHeight }
}

function drawOutlineBox(line = gMeme.selectedLineIdx) {
    const boundingBoxSize = calculateOutlineBox()
    gCtx.lineWidth = '1';
    gCtx.strokeStyle = 'white'
    gCtx.setLineDash([6, 2])
    gCtx.strokeRect(boundingBoxSize.boundingBoxLeft, boundingBoxSize.boundingBoxTop, boundingBoxSize.boundingBoxWidth, boundingBoxSize.boundingBoxHeight)
    gCtx.lineWidth = '1';
    gCtx.strokeStyle = 'black'
    gCtx.setLineDash([6, 2])
    gCtx.strokeRect(boundingBoxSize.boundingBoxLeft - 1, boundingBoxSize.boundingBoxTop - 1, boundingBoxSize.boundingBoxWidth + 1, boundingBoxSize.boundingBoxHeight + 1)

}


function drawText(idx, x, y, draw = true) {
    const text = gMeme.lines[idx].txt
    gCtx.lineWidth = '2';
    gCtx.setLineDash([1, 0])
    gCtx.font = `${gMeme.lines[idx].size}px ${gMeme.lines[idx].fontFamily}`;
    gCtx.strokeStyle = gMeme.lines[idx].borderColor;
    gCtx.fillStyle = gMeme.lines[idx].textColor;
    gCtx.textAlign = gMeme.lines[idx].align;
    if (draw) {
        gCtx.fillText(text, x, y);
        gCtx.strokeText(text, x, y);
    }
    return gCtx.measureText(text)
}


function createCanvas() {
    const canvasBase = document.querySelector('.canvas-container')
    const canvasWidth = gCanvasSize.width
    const canvasHeight = gCanvasSize.height

    canvasBase.innerHTML += `<canvas class="canvas canvas-layer" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
    gCanvas = document.querySelector('.canvas-layer')
    gCtx = gCanvas.getContext('2d')
}