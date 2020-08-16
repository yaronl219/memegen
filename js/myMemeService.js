'use strict'

function saveMemeToStorage() {
    var img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = getMemeImg(gMeme.selectedImgId)
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        getMemeLines(false)
        var savedMemes = loadMemesFromStorage()
        var memeToSave = { memeDetails: gMeme, coverImage: gCanvas.toDataURL('image/png') }
        savedMemes[makeId()] = memeToSave
        saveToStorage('savedMemes', savedMemes)
    }
}

function removeMemeFromStorage(id) {
    var savedMemes = loadMemesFromStorage()
    delete savedMemes[id]
    saveToStorage('savedMemes', savedMemes)
}

function getSavedMemeImgUrlById(id) {
    const savedMemes = loadMemesFromStorage()
    return savedMemes[id].memeDetails.selectedImgId
}

function setSavedMeme(id) {
    const savedMemes = loadMemesFromStorage()
    gMeme = savedMemes[id].memeDetails
}

function loadMemesFromStorage() {
    const savedMemes = loadFromStorage('savedMemes')
    if (!savedMemes) return {}
    return savedMemes
}