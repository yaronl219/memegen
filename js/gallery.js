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
    checkWindowWidth()
}


function filterByKeword(keyword) {
    // TODO - make it work
}


var gImgs = [{
        id: 1,
        url: 'meme-imgs-square/1.jpg',
        keywords: ['trump', 'politics']
    }, {
        id: 2,
        url: 'meme-imgs-square/2.jpg',
        keywords: ['dogs', 'cute']
    }, {
        id: 3,
        url: 'meme-imgs-square/3.jpg',
        keywords: ['dogs', 'cute', 'baby', 'sleeping']
    }, {
        id: 4,
        url: 'meme-imgs-square/4.jpg',
        keywords: ['cats', 'cute', 'sleeping']
    }, {
        id: 5,
        url: 'meme-imgs-square/5.jpg',
        keywords: ['baby', 'success']
    },
    {
        id: 6,
        url: 'meme-imgs-square/6.jpg',
        keywords: ['aliens']
    }, {
        id: 7,
        url: 'meme-imgs-square/7.jpg',
        keywords: ['baby', 'staring', 'surprised']
    }, {
        id: 8,
        url: 'meme-imgs-square/8.jpg',
        keywords: ['tell me more', 'willy wonka', 'hatter']
    },
    {
        id: 9,
        url: 'meme-imgs-square/9.jpg',
        keywords: ['baby', 'cunning']
    }, {
        id: 10,
        url: 'meme-imgs-square/10.jpg',
        keywords: ['barack obama', 'laughing']
    }, {
        id: 11,
        url: 'meme-imgs-square/11.jpg',
        keywords: ['kissing', 'boxing', 'gay']
    }, {
        id: 12,
        url: 'meme-imgs-square/12.jpg',
        keywords: ['שלא יעבדו עליכם', 'pointing']
    }, {
        id: 13,
        url: 'meme-imgs-square/13.jpg',
        keywords: ['alcohol', 'cheers', 'leonardo dicaprio', 'gatsby']
    }, {
        id: 14,
        url: 'meme-imgs-square/14.jpg',
        keywords: ['morpheus', 'matrix', 'what if i told you', 'sunglasses']
    }, {
        id: 15,
        url: 'meme-imgs-square/15.jpg',
        keywords: ['lord of the rings', 'one does not', 'boromir']
    }, {
        id: 16,
        url: 'meme-imgs-square/16.jpg',
        keywords: ['picard', 'star trek', 'laughing']
    }, {
        id: 17,
        url: 'meme-imgs-square/17.jpg',
        keywords: ['putin', 'two', 'victory', 'authority', 'russian']
    }, {
        id: 18,
        url: 'meme-imgs-square/18.jpg',
        keywords: ['buzz lightyear', 'everywhere', 'toy story', 'woody']
    },



]