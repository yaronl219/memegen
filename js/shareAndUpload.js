function renderAndUploadImg(elForm, ev) {
    ev.preventDefault();
    renderMeme(false)
    uploadImg(elForm)

}

function uploadImg(elForm) {
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('https://ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function(res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function(err) {
            console.error(err)
        })
}


// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev)
}

function loadImageFromInput(ev, onImageReady) {
    // document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function(event) {
        var img = new Image();
        // img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
        const imgData = img.src
        addImageToGallery(imgData)

    }
    reader.readAsDataURL(ev.target.files[0]);
}