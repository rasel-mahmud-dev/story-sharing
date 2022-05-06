
function parseTextToHtml(text=""){

    let linkStartIndex = text.match("http")

    if(!linkStartIndex) return  text

    let matchedPart = text.substring(linkStartIndex.index, text.length)
    if(!matchedPart) return text

    let endIndex;

    // nearest white space
    let nearestWhiteSpace = matchedPart.indexOf(" ")
    if(nearestWhiteSpace === -1){
        endIndex = matchedPart.length
    } else {
        endIndex = nearestWhiteSpace
    }

    let a = text.substring(linkStartIndex.index, linkStartIndex.index + endIndex)
    let g = text.replace(a, `<a href=${a} target="blank">${a}</a>`)

    return g
}

export default parseTextToHtml