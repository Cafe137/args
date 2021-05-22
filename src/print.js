const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const WHITE = '\x1b[37m'
const RED_BACKGROUND = '\x1b[41m'
const RESET = '\x1b[0m'
const EXTRA_SPACE = 3

function createDefaultApplication() {
    return {
        name: 'Node.js CLI',
        command: 'node',
        version: '1.0.0',
        description: 'Powered by open source technologies'
    }
}

function getHeadlineMessage(application) {
    return application.name + ' ' + application.version + ' - ' + application.description
}

function getGroupInfoMessage(application) {
    return "Run '" + application.command + " GROUP --help' to see available commands in a group"
}

function getCommandInfoMessage(application) {
    return "Run '" + application.command + " COMMAND --help' for more information on a command"
}

function createDefaultPrinter() {
    function formatDim(string) {
        if (process.stdout.isTTY) {
            return DIM + string + RESET
        }
        return string
    }

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
        formatDim,
        formatImportant
    }
}

function getCliWidth() {
    return process.stdout.columns || 100
}

function getLongestKey(items) {
    return items.reduce((x, i) => ((i.fullPath || i.key).length > x ? (i.fullPath || i.key).length : x), 0)
}

function getArgumentStringForCommandUsage(commandArguments) {
    if (!commandArguments.length) {
        return ' '
    }
    return ' ' + commandArguments.map(x => '<' + x.key + '>').join(' ') + ' '
}

function printUsage(printer, application, group, command, commandArguments) {
    printer.printHeading('Usage:')
    printer.print('')
    if (command) {
        printer.print(application.command + ' ' + command.fullPath + getArgumentStringForCommandUsage(commandArguments) + '[OPTIONS]')
        printer.print('')
        printer.print(command.description)
    } else if (group) {
        printer.print(application.command + ' ' + group.fullPath + ' COMMAND [OPTIONS]')
        printer.print('')
        printer.print(group.description)
    } else {
        printer.print(application.command + ' COMMAND [OPTIONS]')
    }
}

function printCommand(printer, command, padLength) {
    if (command.alias) {
        printNameMetaDescription(printer, command.fullPath.padEnd(padLength + EXTRA_SPACE), '[alias: ' + command.alias + ']', command.description)
    } else {
        printer.print(printer.formatImportant(command.fullPath.padEnd(padLength + EXTRA_SPACE)) + command.description)
    }
}

function printCommands(printer, application, commands) {
    if (commands.length) {
        const longest = getLongestKey(commands)
        printer.printHeading('Available Commands:')
        printer.print('')
        for (const command of commands) {
            printCommand(printer, command, longest)
        }
        printer.print('')
        printer.print(printer.formatDim(getCommandInfoMessage(application)))
        printer.print('')
    }
}

function printGroup(printer, group, padLength) {
    printer.print(printer.formatImportant(group.key.padEnd(padLength + EXTRA_SPACE)) + group.description)
}

function printGroups(printer, application, groups) {
    if (groups.length) {
        const longest = getLongestKey(groups)
        printer.printHeading('Available Groups:')
        printer.print('')
        for (const group of groups) {
            printGroup(printer, group, longest)
        }
        printer.print('')
        printer.print(printer.formatDim(getGroupInfoMessage(application)))
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
    const seen = {}
    const xors = []
    for (const option of items) {
        if (seen[option.key]) {
            continue
        }
        seen[option.key] = true
        if (option.conflicts) {
            const order = option.key.localeCompare(option.conflicts)
            const text = order === -1 ? `[${option.key}] or [${option.conflicts}]` : `[${option.conflicts}] or [${option.key}]`
            if (!xors.includes(text)) {
                xors.push(text)
            }
        }
        printOption(printer, option, length)
    }
    if (xors.length) {
        printer.print('')
        printer.print('Only one is required: ' + xors.join(', '))
    }
    printer.print('')
}

function maybePrintOptionFamily(printer, heading, items) {
    if (items.length) {
        printOptionFamily(printer, heading, items)
    }
}

function printCommandUsage(printer, application, command, options, commandArguments) {
    const requiredOptions = options.filter(option => !option.global && option.required)
    const optionalOptions = options.filter(option => !option.global && !option.required)
    const globalOptions = options.filter(option => option.global)
    printUsage(printer, application, null, command, commandArguments)
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

module.exports = {
    createDefaultApplication,
    createDefaultPrinter,
    maybePrintOptionFamily,
    printCommands,
    printGroups,
    printUsage,
    printCommandUsage,
    getHeadlineMessage,
    getGroupInfoMessage
}
