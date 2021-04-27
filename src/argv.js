function findLongOption(options, string) {
    return options.find(option => option.key === string)
}

function findShortOption(options, string) {
    return options.find(option => option.alias === string)
}

function findOption(options, string) {
    return string.startsWith('--') ? findLongOption(options, string.slice(2)) : findShortOption(options, string.slice(1))
}

function isOption(string) {
    return string.startsWith('-')
}

function isOptionPassed(argv, option) {
    return argv.includes('--' + option.key) || argv.includes('-' + option.alias)
}

function findCommandByFullPath(groups, commands, fullPath) {
    const items = [...commands, ...groups.flatMap(group => group.commands)]
    return items.find(item => item.fullPath === fullPath)
}

function findGroupAndCommand(argv, groups, commands) {
    const rootIndex = argv.findIndex(item => !isOption(item))
    const group = groups.find(group => group.key === argv[rootIndex])
    const commandIndex = group ? argv.findIndex((item, i) => i > rootIndex && !isOption(item)) : rootIndex
    const command = (group ? group.commands : commands).find(
        command => command.key === argv[commandIndex] || (command.alias && command.alias === argv[commandIndex])
    )
    return { group, command }
}

module.exports = { isOption, findOption, findLongOption, findGroupAndCommand, isOptionPassed, findCommandByFullPath }
