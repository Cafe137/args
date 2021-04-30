const { isOption, findGroupAndCommand, findOption, isOptionPassed, findCommandByFullPath, findLongOption } = require('./src/argv')
const { parseValue } = require('./src/parse')
const { printCommandUsage, printGroups, printCommands, maybePrintOptionFamily, createDefaultPrinter } = require('./src/print')
const { Group, Command } = require('./src/type')

function findOptionTargets(context, option) {
    if (option.global) {
        return context.sibling ? [context.options, context.sibling.options] : [context.options]
    } else {
        const targets = []
        if (findLongOption(context.command.options, option.key)) {
            targets.push(context.options)
        }
        if (context.sibling && findLongOption(context.sibling.command.options, option.key)) {
            targets.push(context.sibling.options)
        }
        return targets
    }
}

function createParser(options) {
    const printer = (options && options.printer) || createDefaultPrinter()
    const groups = []
    const commands = []
    const globalOptions = []
    const handleError = (context, reason) => {
        if (!context.group && !context.command) {
            printGroups(printer, groups)
            printCommands(printer, commands)
            maybePrintOptionFamily(printer, 'Global Options', globalOptions)
        } else if (!context.command) {
            printCommands(printer, context.group.commands)
            maybePrintOptionFamily(printer, 'Global Options', globalOptions)
        } else {
            const siblingOptions = context.sibling ? context.sibling.command.options : []
            const options = [...globalOptions, ...context.command.options, ...siblingOptions]
            const siblingArguments = context.sibling ? context.sibling.command.arguments : []
            const commandArguments = [...context.command.arguments, ...siblingArguments]
            printCommandUsage(printer, context.command, options, commandArguments)
        }
        if (!context.options.help) {
            printer.printHeading('Command failed with reason:')
            printer.print('')
            printer.printError(reason)
        }
        return reason
    }

    return {
        addGlobalOption: option => {
            option.global = true
            globalOptions.push(option)
        },
        addGroup: group => {
            groups.push(group)
        },
        addCommand: command => {
            commands.push(command)
        },
        parse: argv => {
            const context = {
                options: {},
                arguments: {},
                sourcemap: {}
            }
            const findResult = findGroupAndCommand(argv, groups, commands)
            context.group = findResult.group
            context.command = findResult.command
            for (const option of globalOptions) {
                if (isOptionPassed(argv, option)) {
                    if (option.handler) {
                        option.handler(context)
                        return { exitReason: option.key }
                    }
                    if (option.key === 'help') {
                        context.options.help = true
                    }
                }
            }
            if (!context.group && !context.command) {
                return handleError(context, 'No group or command specified')
            }
            if (context.group && !context.command) {
                return handleError(context, `You need to specify a command in group [${context.group.key}]`)
            }
            const sibling = context.command.sibling ? findCommandByFullPath(groups, commands, context.command.sibling) : null
            if (context.command.sibling && !sibling) {
                return handleError(context, 'Expected sibling command not found!')
            }
            if (sibling) {
                context.sibling = {
                    command: sibling,
                    arguments: {},
                    options: {}
                }
            }
            const siblingOptions = sibling ? sibling.options : []
            const options = [...globalOptions, ...context.command.options, ...siblingOptions]
            const siblingArguments = sibling ? sibling.arguments : []
            const commandArguments = [...context.command.arguments, ...siblingArguments]
            if (context.options.help) {
                printCommandUsage(printer, context.command, options, commandArguments)
                return { exitReason: 'help' }
            }
            const skipAmount = context.command.depth + 1
            for (let i = skipAmount; i < argv.length; i++) {
                const current = argv[i]
                const next = argv[i + 1]
                if (isOption(current)) {
                    const option = findOption(options, current)
                    if (!option) {
                        return handleError(context, 'Unexpected option: ' + current)
                    }
                    const parseResult = parseValue(option, next)
                    if (parseResult instanceof Error) {
                        return handleError(context, parseResult.message)
                    }
                    const targets = findOptionTargets(context, option)
                    for (const target of targets) {
                        if (target[option.key] !== undefined) {
                            return handleError(context, 'Option passed more than once: ' + option.key)
                        }
                        target[option.key] = parseResult.value
                        context.sourcemap[option.key] = 'explicit'
                    }
                    i += parseResult.skip
                } else {
                    const target = !sibling || !sibling.arguments.length ? context.arguments : context.sibling.arguments
                    if (!commandArguments.length) {
                        return handleError(context, 'Unexpected argument: ' + current)
                    }
                    const argument = commandArguments[0]
                    if (commandArguments.length && target[argument.key]) {
                        return handleError(context, 'Argument [' + argument.key + '] is already specified before as: ' + current)
                    }
                    const parseResult = parseValue(argument, current)
                    if (parseResult instanceof Error) {
                        return handleError(context, parseResult.message)
                    }
                    target[argument.key] = parseResult.value
                    context.sourcemap[argument.key] = 'explicit'
                }
            }
            for (const option of options) {
                if (!option.envKey) {
                    continue
                }
                if (process.env[option.envKey] === undefined) {
                    continue
                }
                const parseResult = parseValue(option, process.env[option.envKey])
                if (parseResult instanceof Error) {
                    return handleError(context, parseResult.message)
                }
                const targets = findOptionTargets(context, option)
                for (const target of targets) {
                    if (target[option.key] !== undefined) {
                        continue
                    }
                    target[option.key] = parseResult.value
                    context.sourcemap[option.key] = 'env'
                }
            }
            const commandArgument = context.command.arguments.length ? context.command.arguments[0] : null
            const siblingArgument = context.sibling && context.sibling.command.arguments.length ? context.sibling.command.arguments[0] : null
            if (commandArgument && context.arguments[commandArgument.key] === undefined) {
                if (commandArgument.default !== undefined) {
                    context.arguments[commandArgument.key] = commandArgument.default
                    context.sourcemap[commandArgument.key] = 'default'
                } else if (commandArgument.required) {
                    return handleError(context, `Required argument [${commandArgument.key}] is not provided`)
                }
            }
            if (siblingArgument && context.sibling.arguments[siblingArgument.key] === undefined) {
                if (siblingArgument.default !== undefined) {
                    context.sibling.arguments[siblingArgument.key] = siblingArgument.default
                    context.sourcemap[siblingArgument.key] = 'default'
                } else if (siblingArgument.required) {
                    return handleError(context, `Required argument [${siblingArgument.key}] is not provided`)
                }
            }
            for (const option of options) {
                if (option.conflicts && context.options[option.key] && context.options[option.conflicts]) {
                    return handleError(context, option.key + ' and ' + option.conflicts + ' are incompatible, please only specify one.')
                }
                if (option.default !== undefined) {
                    const targets = findOptionTargets(context, option)
                    for (const target of targets) {
                        if (target[option.key] !== undefined) {
                            continue
                        }
                        target[option.key] = option.default
                        context.sourcemap[option.key] = 'default'
                    }
                }
                if (option.required && !context.options[option.key] && (!option.conflicts || !context.options[option.conflicts])) {
                    return handleError(context, 'Required option not provided: ' + option.key)
                }
            }
            return context
        }
    }
}

module.exports = { createParser, Group, Command }
