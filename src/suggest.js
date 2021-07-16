const { tokenize } = require('./tokenize')

function getSiblingOptions(name, entries) {
    return entries.find(entry => entry.fullPath === name).options
}

function getSiblingArguments(name, entries) {
    return entries.find(entry => entry.fullPath === name).arguments
}

function isOptionSpecified(context, option) {
    if (context.argv.includes('--' + option.key) && context.token !== '--' + option.key) {
        return true
    }
    if (option.alias && context.argv.includes('-' + option.alias) && context.token !== '-' + option.alias) {
        return true
    }
    return false
}

function findMatchingOptions(context, options) {
    if (['', '-', '--'].includes(context.token)) {
        return options.map(option => '--' + option.key)
    }
    if (context.token.startsWith('--')) {
        return options.filter(option => option.key.startsWith(context.token.slice(2))).map(option => '--' + option.key)
    } else if (context.token.startsWith('-')) {
        return options.filter(option => option.alias && option.alias.startsWith(context.token.slice(1))).map(option => '-' + option.alias)
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

function findOptionForWord(word, options) {
    if (word.startsWith('--')) {
        return options.find(option => option.key === word.slice(2))
    } else if (word.startsWith('-')) {
        return options.find(option => option.alias === word.slice(1))
    }
    return null
}

function getPreviousOption(context, options) {
    const word = context.opensNext ? context.argv[context.argv.length - 1] : context.argv[context.argv.length - 2]
    return findOptionForWord(word, options)
}

function isBooleanTrueLike(word) {
    return word && word.length && 'true'.startsWith(word)
}

function isBooleanFalseLike(word) {
    return word && word.length && 'false'.startsWith(word)
}

function getPositionalArgument(command, context, allArguments, globalOptions) {
    if (!allArguments.length) {
        return null
    }
    const commandWords = command.fullPath.split(' ').length
    if (commandWords === context.argv.length && context.opensNext) {
        return allArguments[0]
    }
    let argumentIndex = -1
    for (let i = commandWords; i < context.argv.length; i++) {
        const word = context.argv[i]
        const next = context.argv[i + 1]
        const option = findOptionForWord(word, globalOptions)
        if (option) {
            if (option.type === 'boolean') {
                if (isBooleanTrueLike(next) || isBooleanFalseLike(next)) {
                    i++
                    continue
                }
            } else {
                i++
                continue
            }
        } else {
            argumentIndex++
        }
    }
    if (context.opensNext) {
        argumentIndex++
    }
    return Object.values(allArguments)[argumentIndex]
}

async function handleMatch(context, match, entries, globalOptions, pathResolver) {
    const options = [...match.options, ...(match.sibling ? getSiblingOptions(match.sibling, entries) : []), ...globalOptions]
    const allArguments = [...match.arguments, ...(match.sibling ? getSiblingArguments(match.sibling, entries) : [])]
    const previousOption = getPreviousOption(context, options)
    if (previousOption && previousOption.type === 'boolean' && context.token) {
        if (isBooleanTrueLike(context.token)) {
            return ['true']
        }
        if (isBooleanFalseLike(context.token)) {
            return ['false']
        }
    }
    if (previousOption && previousOption.autocompletePath) {
        return pathResolver(context.token)
    }
    if (!context.token.startsWith('-')) {
        const positionalArgument = getPositionalArgument(match, context, allArguments, globalOptions)
        if (positionalArgument && positionalArgument.autocompletePath) {
            return pathResolver(context.token)
        }
    }
    const missingOptions = options.filter(option => !isOptionSpecified(context, option))
    return findMatchingOptions(context, missingOptions)
}

function trail(suggestions, trailing) {
    if (!trailing || !suggestions.length) {
        return suggestions
    }
    return suggestions.map(suggestion => (suggestion.endsWith('/') ? suggestion : suggestion + trailing))
}

async function suggest(line, offset, entries, globalOptions, pathResolver, trailing) {
    const context = tokenize(line, offset)
    if (!context.argv.length) {
        return trail(
            entries.filter(entry => entry.depth === 0).map(x => x.key),
            trailing
        )
    }
    const normalLine = context.argv.join(' ') + (context.opensNext ? ' ' : '')
    const nodes = []
    for (const entry of entries) {
        flatten(nodes, entry)
    }
    const match = nodes.find(node => normalLine.startsWith(node.fullPath + ' ') && node.options)
    if (match) {
        return trail(await handleMatch(context, match, entries, globalOptions, pathResolver), trailing)
    }
    for (const node of nodes) {
        node.matchingPartLength = getMatchingPartLength(normalLine, node.fullPath)
    }
    const longestMatchingPartLength = nodes.reduce(selectLongerMatchingPartNode).matchingPartLength
    if (!longestMatchingPartLength) {
        return []
    }
    const substringMatches = nodes.filter(node => node.matchingPartLength === longestMatchingPartLength)
    const lowestDepth = substringMatches.reduce(selectLowestDepthNode).depth
    const matches = substringMatches.filter(node => node.depth === lowestDepth)
    return trail(
        matches.map(x => x.key),
        trailing
    )
}

module.exports = { suggest }
