function filterMatches(entries, start) {
    return entries.filter(entry => entry.startsWith(start))
}

function parsePath(word) {
    const lastSlash = word.lastIndexOf('/')
    if (lastSlash === -1) {
        return { dir: '', base: word }
    }
    return { dir: word.slice(0, lastSlash), base: word.slice(lastSlash + 1) }
}

async function completePath(word) {
    const fs = require('fs')
    const { dir, base } = parsePath(word)
    const entries = await fs.promises.readdir(dir || '.').catch(x => [])
    const matches = filterMatches(entries, base)
    const results = []
    for (const match of matches) {
        const path = (dir ? dir + '/' : '') + match
        const stats = await fs.promises.stat(path)
        results.push(stats.isDirectory() ? path + '/' : path)
    }
    return results
}

module.exports = { completePath }
