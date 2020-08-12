function addLayer() {
    const canvasBase = document.querySelector('.canvas-container')
    const refCanvas = document.querySelector('.fake-canvas-base')
    const canvasWidth = 500
    const canvasHeight = 500
        // const canvasLeft = refCanvas.offsetLeft
        // const canvasTop = refCanvas.offsetTop
    const layerNumber = gLayers.length
    canvasBase.innerHTML += `<canvas class="canvas canvas-layer-${layerNumber}" width="${canvasWidth}" height="${canvasHeight}"></canvas>`
    const newLayer = document.querySelector(`.canvas-layer-${layerNumber}`)
    gLayers.push(newLayer)
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