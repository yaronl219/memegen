'use strict'

var gKeywords = {}



var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [{
            txt: 'I\'m a text placeholder',
            size: 40,
            align: 'center',
            textColor: 'white',
            borderColor: 'black',
            fontFamily: 'Impact',
            top: 100,
            left: 250,
            boundingBox: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
        },
        {
            txt: 'Me too',
            size: 40,
            align: 'center',
            textColor: 'white',
            borderColor: 'black',
            fontFamily: 'Impact',
            top: 400,
            left: 250,
            boundingBox: {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
        }
    ]
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
    var lineObject = {
        txt: 'Edit text',
        size: 40,
        align: 'center',
        textColor: 'white',
        borderColor: 'black',
        fontFamily: 'Impact',
        top: newLineTop,
        left: Math.round(canvasWidth / 2)
    }
    gMeme.lines.push(lineObject)
        // return the amount of lines (now the last row)
    return amountOfLines
}

function getCurrentLineAndLineCount() {
    return { currLine: gMeme.selectedLineIdx, totalLines: gMeme.lines.length, txt: gMeme.lines[gMeme.selectedLineIdx].txt }
}

function changeLineFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = font
}

function selectLineDirectly(x, y) {
    console.log(x, y)
    for (var i = gMeme.lines.length - 1; i >= 0; i--) {
        const boundingBox = gMeme.lines[i].boundingBox
        if (boundingBox.left <= x && boundingBox.top <= y && boundingBox.left + boundingBox.width >= x && boundingBox.top + boundingBox.height >= y) {
            switchToLineNumber(i)
        }
    }
}

function switchToLineNumber(num) {
    if (num >= gMeme.lines.length) return
    gMeme.selectedLineIdx = num
    renderMeme()
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

function drawImgFromlocal() {
    var img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = getMemeImg(gMeme.selectedImgId)
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        getMemeLines()
    }
}

function changeTextParameters(param) {

    switch (param) {
        case '+':
            gMeme.lines[gMeme.selectedLineIdx].size += 2
            break;
        case '-':
            gMeme.lines[gMeme.selectedLineIdx].size -= 2
            break;
        case 'up':
            gMeme.lines[gMeme.selectedLineIdx].top -= 5
            break;
        case 'down':
            gMeme.lines[gMeme.selectedLineIdx].top += 5
            break;
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].left -= 5
            break;
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].left += 5
            break;
        case 'alignLeft':
            gMeme.lines[gMeme.selectedLineIdx].align = 'left'
            break;
        case 'alignCenter':
            gMeme.lines[gMeme.selectedLineIdx].align = 'center'
            break;
        case 'alignRight':
            gMeme.lines[gMeme.selectedLineIdx].align = 'right'
            break;
    }
    updateBoundingBoxParams()
}

function getMemeLines() {
    gMeme.lines.forEach((line, idx) => {
        drawText(idx, line.left, line.top)
    });
    updateBoundingBoxParams()
    drawOutlineBox()
}

function changeTextLine(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    renderMeme()
    drawOutlineBox()
}

function getMemeImg(id) {
    const reqItem = getIdxById(id, gImgs)
    return reqItem.url
}

function updateBoundingBoxParams() {
    gMeme.lines.forEach((line, idx) => {
        // const textSize = drawText(currLineIdx, gMeme.lines[currLineIdx].left, gMeme.lines[currLineIdx].top,false)
        const currLineBoundingBox = drawOutlineBox(idx, false)
        line.boundingBox.left = currLineBoundingBox.boundingBoxLeft
        line.boundingBox.top = currLineBoundingBox.boundingBoxTop
        line.boundingBox.height = currLineBoundingBox.boundingBoxHeight
        line.boundingBox.width = currLineBoundingBox.boundingBoxWidth
    })
}

function drawOutlineBox(line = gMeme.selectedLineIdx, draw = true) {
    const fixedPadding = 15
    const currLineIdx = line
    const textSize = drawText(currLineIdx, gMeme.lines[currLineIdx].left, gMeme.lines[currLineIdx].top, false)
    const boundingBoxTop = gMeme.lines[currLineIdx].top - textSize.actualBoundingBoxAscent - fixedPadding
    const boundingBoxLeft = gMeme.lines[currLineIdx].left - textSize.actualBoundingBoxLeft - fixedPadding
    const boundingBoxWidth = textSize.width + (fixedPadding * 2)
    const boundingBoxHeight = textSize.actualBoundingBoxAscent + (fixedPadding * 2)

    if (draw) {
        gCtx.lineWidth = '1';
        gCtx.strokeStyle = 'white'
        gCtx.setLineDash([6, 2])
        gCtx.strokeRect(boundingBoxLeft, boundingBoxTop, boundingBoxWidth, boundingBoxHeight)
        gCtx.lineWidth = '1';
        gCtx.strokeStyle = 'black'
        gCtx.setLineDash([6, 2])
        gCtx.strokeRect(boundingBoxLeft - 1, boundingBoxTop - 1, boundingBoxWidth + 1, boundingBoxHeight + 1)
    }
    return { boundingBoxTop, boundingBoxLeft, boundingBoxWidth, boundingBoxHeight }
}


function drawText(idx, x, y, draw = true) {
    const text = gMeme.lines[idx].txt
    gCtx.lineWidth = '2';
    gCtx.setLineDash([1, 0])
    gCtx.strokeStyle = gMeme.lines[idx].borderColor;
    gCtx.fillStyle = gMeme.lines[idx].textColor;
    gCtx.font = `${gMeme.lines[idx].size}px ${gMeme.lines[idx].fontFamily}`;
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

    gCanvas.addEventListener('click', () => onSelectLineDirectly(event))

}


function flattenImage() {
    //  grabs the first layer
    // var baseLayer = document.querySelector('.canvas-layer-0')
    var baseLayer = drawImgFromlocal()
    var baseCtx = baseLayer.getContext('2d')

    var newLayer = document.querySelector('.canvas-layer-1')
        // appends every layer by order to the first layer
    for (var i = 1; i < gLayers.length; i++) {
        newLayer = document.querySelector(`.canvas-layer-${i}`)
        baseCtx.drawImage(newLayer, 0, 0)
    }
    // convert to url
    var dataUrl = baseLayer.toDataURL()
    console.log(dataUrl);
    // return it
    return dataUrl
}