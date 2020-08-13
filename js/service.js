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
            left: 250
        },
        {
            txt: 'Me too',
            size: 40,
            align: 'center',
            textColor: 'white',
            borderColor: 'black',
            fontFamily: 'Impact',
            top: 400,
            left: 250
        }
    ]
}


function getEditBox() {

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
    return true
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

function switchToLineNumber(num) {
    if (num >= gMeme.lines.length) return
    gMeme.selectedLineIdx = num
}

function switchToNextLine() {
    const currentLine = gMeme.selectedLineIdx
    let nextLine = currentLine + 1
    if (nextLine >= gMeme.lines.length) nextLine = 0
    gMeme.selectedLineIdx = nextLine
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
}

function getMemeLines() {
    gMeme.lines.forEach((line, idx) => {
        drawText(idx, line.left, line.top)
    });
}

function changeTextLine(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    renderMeme()
}

function getMemeImg(id) {
    const reqItem = getIdxById(id, gImgs)
    return reqItem.url
}


function drawText(idx, x, y) {
    const text = gMeme.lines[idx].txt
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = gMeme.lines[idx].borderColor;
    gCtx.fillStyle = gMeme.lines[idx].textColor;
    gCtx.font = `${gMeme.lines[idx].size}px ${gMeme.lines[idx].fontFamily}`;
    gCtx.textAlign = gMeme.lines[idx].align;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
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