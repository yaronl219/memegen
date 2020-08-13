function addLayer() {
    const canvasBase = document.querySelector('.canvas-container')
    const canvasWidth = gCanvasSize.width
    const canvasHeight = gCanvasSize.height
    const layerNumber = gLayers.length
    canvasBase.innerHTML += `<canvas class="canvas canvas-layer" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
        // const refCanvas = document.querySelector('.fake-canvas-base')
        // const canvasLeft = refCanvas.offsetLeft
        // const canvasTop = refCanvas.offsetTop
    canvasBase.innerHTML += `<canvas class="canvas canvas-layer-${layerNumber}" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
    const newLayer = document.querySelector(`.canvas-layer-${layerNumber}`)
        // gLayers.push(newLayer)
}

function switchToLayer(layerNumber) {
    const reqLayer = document.querySelector(`.canvas-layer-${layerNumber}`)
    gCanvas = reqLayer
    gCtx = reqLayer.getContext('2d')
}



function debugTest() {
    switchToLayer(1)
    drawText(50, 50)
    switchToLayer(2)
    drawText(150, 150)
}