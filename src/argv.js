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

function arrayBeginsWith(array, text) {
    const words = text.split(' ')
    if (words.length > array.length) {
        return false
    }
    for (let i = 0; i < words.length; i++) {
        if (array[i] !== words[i]) {
            return false
        }
    }
    return true
}

function findGroupAndCommand(argv, groups, commands, group) {
    const groupPath = group ? group.fullPath + ' ' : ''
    for (const command of commands) {
        if (arrayBeginsWith(argv, groupPath + command.key) || (command.alias && arrayBeginsWith(argv, groupPath + command.alias))) {
            return { group, command }
        }
    }
    for (const group of groups) {
        if (arrayBeginsWith(argv, group.fullPath)) {
            const result = findGroupAndCommand(argv, group.groups, group.commands, group)
            if (result.group) {
                return { group: result.group, command: result.command }
            }
        }
    }
    return { group }
}

module.exports = { isOption, findOption, findLongOption, findGroupAndCommand, isOptionPassed, findCommandByFullPath }
