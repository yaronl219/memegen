function makeID(array, id) {
    var highestId = 0
    for (const id in array) {
        if (id > highestId) {
            highestId = id
        }
    }
    return highestId
}

function getIdxById(id, arr) {
    return arr.find(function(item) {
        return item.id === id
    })
}