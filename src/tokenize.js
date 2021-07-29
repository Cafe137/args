function tokenize(string, offset = 0) {
    const argv = []
    let quotes = false
    let token = ''
    let previous = null
    for (const character of string) {
        if (character === ' ' && token && !quotes) {
            argv.push(token)
            token = ''
        } else if (quotes && character === quotes && previous !== '\\') {
            quotes = false
            if (token === '') {
                argv.push('')
            }
        } else if (!quotes && ['"', "'"].includes(character) && previous !== '\\') {
            quotes = character
        } else if (character !== '\\' && (token || character !== ' ' || quotes)) {
            token += character
        }
        previous = character
    }
    if (token) {
        argv.push(token)
    }
    const opensNext = !token && !quotes && string.endsWith(' ')
    return { argv: argv.slice(offset), quotes, token, opensNext }
}

module.exports = { tokenize }
