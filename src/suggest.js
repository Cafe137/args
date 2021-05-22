function getSiblingOptions(name, entries) {
    return entries.find(entry => entry.fullPath === name).options
}

function isOptionSpecified(line, option) {
    if (line.includes('--' + option.key + ' ')) {
        return true
    }
    if (option.alias && line.includes('-' + option.alias + ' ')) {
        return true
    }
    return false
}

function findMatchingOptions(line, options) {
    const words = line.split(' ')
    const lastWord = words[words.length - 1]
    if (lastWord === '' || lastWord === '-' || lastWord === '--') {
        return options.map(option => '--' + option.key)
    }
    if (lastWord.startsWith('--')) {
        return options.filter(option => option.key.startsWith(lastWord.slice(2))).map(option => '--' + option.key)
    } else if (lastWord.startsWith('-')) {
        return options.filter(option => option.alias && option.alias.startsWith(lastWord.slice(1))).map(option => '-' + option.alias)
    }
    return []
}

function selectLongerMatchingPartNode(a, b) {
    return a.matchingPartLength > b.matchingPartLength ? a : b
}

function selectLowestDepthNode(a, b) {
    return a.depth < b.depth ? a : b
}

function getMatchingPartLength(a, b) {
    const length = a.length < b.length ? a.length : b.length
    let i = 0
    for (; i < length; i++) {
        if (a[i] !== b[i]) {
            break
        }
    }
    return i
}

function flatten(results, node) {
    results.push(node)
    if (node.groups) {
        node.groups.forEach(group => flatten(results, group))
    }
    if (node.commands) {
        node.commands.forEach(command => flatten(results, command))
    }
}

function suggest(line, entries, globalOptions) {
    if (line === '') {
        return entries.filter(entry => entry.depth === 0).map(x => x.key)
    }
    const nodes = []
    for (const entry of entries) {
        flatten(nodes, entry)
    }
    for (const node of nodes) {
        node.matchingPartLength = getMatchingPartLength(line, node.fullPath)
    }
    const longestMatchingPartLength = nodes.reduce(selectLongerMatchingPartNode).matchingPartLength
    const substringMatches = nodes.filter(node => node.matchingPartLength === longestMatchingPartLength)
    const lowestDepth = substringMatches.reduce(selectLowestDepthNode).depth
    const matches = substringMatches.filter(node => node.depth === lowestDepth)
    const isSingleExactMatch = matches.length === 1 && line.startsWith(matches[0].fullPath + ' ')
    if (isSingleExactMatch) {
        const match = matches[0]
        const options = [...match.options, ...(match.sibling ? getSiblingOptions(match.sibling, entries) : []), ...globalOptions]
        const missingOptions = options.filter(option => !isOptionSpecified(line, option))
        return findMatchingOptions(line, missingOptions)
    }
    return matches.map(x => x.key)
}

module.exports = { suggest }
