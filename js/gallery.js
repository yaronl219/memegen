function populateGallery(arr) {
    const galleryEl = document.querySelector('.meme-gallery')
    strHtml = ''
    arr.forEach(image => {
        // strHtml += `<div class="gallery-image" style="background-image: url("${image.url}");"></div>`
        strHtml += `<img class="gallery-image" src="${image.url}" onclick="selectImageAndStartEdit(${image.id})" />`
    })
    galleryEl.innerHTML = strHtml
}

function getAspectRatio(imgId) {
    const imgAspectRatio = calculateAspectRatio(imgId)

}



function selectImageAndStartEdit(imgId) {
    gMeme.selectedImgId = imgId
    renderMemeEditScreen()
    updateTextController()
    startMemeEdit()
    renderMeme()
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