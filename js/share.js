function renderAndUploadImg(elForm, ev) {
    ev.preventDefault();
    drawImgFromlocal(false)
    setTimeout(() => {
        uploadImg(elForm)
    }, 1000)
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
    fetch('ca-upload.com/here/upload.php', {
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