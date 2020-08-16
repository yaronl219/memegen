function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getIdxById(id, arr) {
    return arr.find(function(item) {
        return item.id === id
    })
}

function getHighestId(id, arr) {
    // if an array of objects contains a serial id, this finds the highest one
    var highestId = -1
    arr.forEach(item => {
        if (item[id] > highestId) highestId = item[id]
    });
    return highestId
}

function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function fadeInOutAnimation(el, transitionTime, timeToDisplay, topOpacity) {
    // this function will fade in and out a selected element.
    // the function requires that a hidden class will be established with display: none
    el.classList.toggle('hidden')
    var elOpacity = 0

    // fade in
    var opacityInterval = setInterval(() => {
        el.style.opacity = `${elOpacity}%`
        elOpacity += topOpacity / 20
    }, transitionTime / 20);

    // stop fade in
    setTimeout(() => {
        clearInterval(opacityInterval)
    }, transitionTime);

    setTimeout(() => {
        // fade out
        var opacityInterval = setInterval(() => {
            el.style.opacity = `${elOpacity}%`
            elOpacity -= topOpacity / 20
        }, transitionTime / 20);

        // stop fade out
        setTimeout(() => {
            clearInterval(opacityInterval)
                // rehide the element
            el.classList.toggle('hidden')
        }, transitionTime);

    }, timeToDisplay + transitionTime);
}