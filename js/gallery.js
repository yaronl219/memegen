'use strict'

function onGalleryInit() {
    highlightRelevantNavs('gallery')
    loadKeywords()
    renderGalleryScreen()
    renderKeywords()
    populateGallery(gImgs)

}

function onSelectKeyword(keyword) {
    selectKeyword(keyword)
    const searchInputField = document.querySelector('.search-bar-input')
    searchInputField.value = capitalizeString(keyword)
    onSearchInput(searchInputField)
}

function highlightKeyword(keyword) {
    const prevSelectedKeywords = document.querySelectorAll('.selected-keyword')
    prevSelectedKeywords.forEach(selectedEl => {
        selectedEl.classList.remove('selected-keyword')
    })

    const allKeywords = document.querySelectorAll('.keyword')
    allKeywords.forEach(wordEl => {
        if (wordEl.innerText.toLowerCase() === keyword) {
            wordEl.classList.add('selected-keyword')
        }
    })
}

function calculateKeywordFontSize(keywordArray) {
    const maxValue = keywordArray[0].timesSelected
    const minValue = keywordArray[keywordArray.length - 1].timesSelected

    return keywordArray.map((word) => {
        // normalizes the value according to the size of the array
        const normalizedValue = normalize(word.timesSelected, maxValue, minValue)
            // if the entire array is the same size - return 1
        const fontFactor = (!normalizedValue) ? 1 : 1 + normalizedValue
        return ({ keyword: word.keyword, fontSize: fontFactor })
    })

    function normalize(val, max, min) {
        return (val - min) / (max - min);
    }
}

function renderKeywords(keyword) {
    const keywordsAmount = (window.innerWidth <= 650) ? 3 : 5
    const keywords = getKeywordsToDisplay(keywordsAmount, keyword)
    var strHtml = ''
    if (keywords.length === 0) {
        strHtml += 'No Keywords...'
    } else {
        const wordsToRender = calculateKeywordFontSize(keywords)
        wordsToRender.forEach(word => {
            strHtml += `<div class="keyword" onclick="onSelectKeyword('${word.keyword}')" style="font-size: ${word.fontSize}rem;">
            ${capitalizeString(word.keyword)}
            </div>`
        })
    }

    const el = document.querySelector('.keywords-container')
    el.innerHTML = strHtml
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
    const inputValue = el.value.toLowerCase()
    const filteredList = filterByKeword(inputValue)
    renderKeywords(inputValue)
    highlightKeyword(inputValue)
    populateGallery(filteredList)
}


function renderGalleryScreen() {
    const el = document.querySelector('.main-container')
    el.innerHTML = `<div class="search-bar-container">
                        <input type="search" class="search-bar-input" oninput="onSearchInput(this)">
                        <div class="keywords-container"></div>
                    </div>
                    <div class="meme-gallery"></div>`
}