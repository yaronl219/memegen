function populateGallery() {
    const galleryEl = document.querySelector('.meme-gallery')
    strHtml = ''
    gImgs.forEach(image => {
        // strHtml += `<div class="gallery-image" style="background-image: url("${image.url}");"></div>`
        strHtml += `<img class="gallery-image" src="${image.url}" onclick="selectImageAndStartEdit(${image.id})" />`
    })
    galleryEl.innerHTML = strHtml
}

function selectImageAndStartEdit(imgId) {
    gMeme.selectedImgId = imgId
    renderMemeEditScreen()
    updateTextController()
    startMemeEdit(1)
    renderMeme()
}