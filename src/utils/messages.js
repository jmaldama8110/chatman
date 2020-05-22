
const generateTextObject = (nickname,text) => {
    return {
        nickname,
        text,
        createdAt: new Date().getTime()
    }
}

const generateGeolocationObject = (nickname,url) => {
    return {
        nickname,
        url,
        createdAt: new Date().getTime()
    }

}

module.exports = {  
    generateTextObject,
    generateGeolocationObject
}