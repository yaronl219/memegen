'use strict'

function onGalleryInit() {
    highlightRelevantNavs('gallery')
    renderGalleryScreen()
    populateGallery(gImgs)
}

function populateGallery(arr) {
    const galleryEl = document.querySelector('.meme-gallery')
    var strHtml = '<ul class=img-wrapper>'
    arr.forEach(image => {
        // strHtml += `<div class="gallery-image" style="background-image: url("${image.url}");"></div>`
        strHtml += `<li><img class="gallery-image" src="${image.url}" onclick="selectImageAndStartEdit(${image.id})" /></li>`
    })
    strHtml += '</ul>'
    galleryEl.innerHTML = strHtml
}

function getAspectRatio(imgId) {
    const imgAspectRatio = calculateAspectRatio(imgId)
    const widthRatio = 500 / imgAspectRatio.imgWidth
    const newWidth = 500
    const newHeight = imgAspectRatio.imgHeight * widthRatio
    gCanvasSize.defaultWidth = newWidth
    gCanvasSize.defaultHeight = newHeight
    gCanvasSize.width = newWidth
    gCanvasSize.height = newHeight
    const resizeBy = (window.innerWidth < 650) ? 0.7 : 1
    resizeCanvas(newWidth * resizeBy, newHeight * resizeBy)
    repositionOnResize(1, (newHeight * resizeBy / 500))
}



function selectImageAndStartEdit(imgId) {
    gMeme.selectedImgId = imgId
    renderMemeEditScreen()
    updateTextController()
    resetLines()
    resetMeme()
    startMemeEdit()
    changeLineFont('Custom-Impact')
    getAspectRatio(imgId)
    checkWindowWidth()

}

function onSearchInput(el) {
    const inputValue = el.value
    const filteredList = filterByKeword(inputValue.toLowerCase())
    populateGallery(filteredList)
}


function renderGalleryScreen() {
    const el = document.querySelector('.main-container')
    el.innerHTML = `<div class="search-bar-container">
                        <input type="search" class="search-bar-input" oninput="onSearchInput(this)">
                    </div>
                    <div class="meme-gallery"></div>`
}