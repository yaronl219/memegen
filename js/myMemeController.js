'use strict'

function savedMemesScreenInit() {
    highlightRelevantNavs('memes')
    const savedMemes = loadMemesFromStorage()
    if (Object.entries(savedMemes).length === 0) {
        renderMemeScreenEmptyState()
    } else {
        renderSavedMemes(savedMemes)
    }
}

function onRemoveMeme(id) {
    removeMemeFromStorage(id)
    setTimeout(() => savedMemesScreenInit(), 100)
}

function renderSavedMemes(memeObject) {
    const el = document.querySelector('.main-container')
    var strHtml = '<div class="meme-gallery"><ul class=img-wrapper>'
    for (const key in memeObject) {
        strHtml += `<li class="saved-meme-list-item"><img class="gallery-image" src="${memeObject[key].coverImage}" onclick="selectSavedMemeAndStartEditing('${key}')" /><div class="remove-meme" onclick="onRemoveMeme('${key}')">✕</div></li>`
            // console.log(memeObject[key].coverImage)
    }
    strHtml += '</ul></div>'
    el.innerHTML = strHtml
}

function renderMemeScreenEmptyState() {
    const el = document.querySelector('.main-container')
    el.innerHTML = `<div class="empty-state-container">
                        <h1>WHY U HAVE NO MEMES</h1>
                        <a onclick="onGalleryInit()">Go create some now</a>
                    </div>`
}

function selectSavedMemeAndStartEditing(id) {
    setSavedMeme(id)
    renderMemeEditScreen()
    updateTextController()
    startMemeEdit()
    renderMeme()
    checkWindowWidth()
}