const BOLD = '\x1b[1m'
const WHITE = '\x1b[37m'
const RED_BACKGROUND = '\x1b[41m'
const RESET = '\x1b[0m'

const EXTRA_SPACE = 3

function createDefaultPrinter() {
    function formatImportant(string) {
        if (process.stdout.isTTY) {
            return BOLD + string + RESET
        }
        return string
    }

    function formatError(string) {
        if (process.stdout.isTTY) {
            return BOLD + WHITE + RED_BACKGROUND + string + RESET
        }
        return string
    }

    function print(text) {
        process.stdout.write(text + '\n')
    }

    function printError(text) {
        print(formatError(text))
    }

    function printHeading(text) {
        print(formatImportant('█ ' + text))
    }

    return {
        print,
        printError,
        printHeading,
        formatImportant
    }
}

function getCliWidth() {
    return process.stdout.columns || 100
}

function getLongestKey(items) {
    return items.reduce((x, i) => ((i.fullPath || i.key).length > x ? (i.fullPath || i.key).length : x), 0)
}

function printCommand(printer, command, padLength) {
    if (command.alias) {
        printNameMetaDescription(printer, command.fullPath.padEnd(padLength + EXTRA_SPACE), '[alias: ' + command.alias + ']', command.description)
    } else {
        printer.print(printer.formatImportant(command.fullPath.padEnd(padLength + EXTRA_SPACE)) + command.description)
    }
}

function printCommands(printer, commands) {
    if (commands.length) {
        const longest = getLongestKey(commands)
        printer.printHeading('Available commands:')
        printer.print('')
        for (const command of commands) {
            printCommand(printer, command, longest)
        }
        printer.print('')
    }
}

function printGroup(printer, group, padLength) {
    printer.print(printer.formatImportant(group.key.padEnd(padLength + EXTRA_SPACE)) + group.description)
}

function printGroups(printer, groups) {
    if (groups.length) {
        const longest = getLongestKey(groups)
        printer.printHeading('Available groups:')
        printer.print('')
        for (const group of groups) {
            printGroup(printer, group, longest)
        }
        printer.print('')
    }
}

function printNameMetaDescription(printer, name, meta, description) {
    const columns = getCliWidth()
    const fullLine = name + description + meta
    const nameAndMeta = name + meta
    const lineWithoutMeta = name + description
    if (fullLine.length < columns) {
        printer.print(printer.formatImportant(name) + description + meta.padStart(columns - lineWithoutMeta.length))
    } else if (nameAndMeta.length < columns) {
        printer.print(printer.formatImportant(name) + meta.padStart(columns - name.length))
        printer.print(description)
        printer.print('')
    } else {
        printer.print(printer.formatImportant(name))
        printer.print(meta)
        printer.print(description)
        printer.print('')
    }
}

function printOption(printer, option, padLength) {
    const aliasString = option.alias ? '-' + option.alias : '  '
    const defaultString = option.default !== undefined ? ', default: ' + String(option.defaultDescription || option.default) : ''
    const name = `${aliasString} --${option.key}`.padEnd(padLength)
    const meta = `[${option.type || 'string'}${defaultString}]`
    printNameMetaDescription(printer, name, meta, option.description)
}

function printArgument(printer, argument) {
    const requiredString = argument.required ? 'required ' : ''
    const meta = `[${requiredString}${argument.type || 'string'}]`
    printNameMetaDescription(printer, argument.key.padEnd(argument.key.length + EXTRA_SPACE), meta, argument.description)
}

function printOptionFamily(printer, heading, items) {
    const length = getLongestKey(items) + 5 + EXTRA_SPACE
    printer.printHeading(heading + ':')
    printer.print('')
    for (const option of items) {
        printOption(printer, option, length)
    }
    printer.print('')
}

function maybePrintOptionFamily(printer, heading, items) {
    if (items.length) {
        printOptionFamily(printer, heading, items)
    }
}

function printCommandUsage(printer, command, options, commandArguments) {
    const requiredOptions = options.filter(option => !option.global && option.required)
    const optionalOptions = options.filter(option => !option.global && !option.required)
    const globalOptions = options.filter(option => option.global)
    printer.printHeading('Current Command:')
    printer.print('')
    printCommand(printer, command, command.fullPath.length)
    printer.print('')
    if (commandArguments.length) {
        printer.printHeading('Arguments:')
        printer.print('')
        for (const argument of commandArguments) {
            printArgument(printer, argument)
        }
        printer.print('')
    }
    maybePrintOptionFamily(printer, 'Required Options', requiredOptions)
    maybePrintOptionFamily(printer, 'Options', optionalOptions)
    maybePrintOptionFamily(printer, 'Global Options', globalOptions)
}

module.exports = { createDefaultPrinter, maybePrintOptionFamily, printCommands, printGroups, printCommandUsage }
