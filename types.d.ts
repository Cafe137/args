declare module 'cafe-args' {
    export interface Argument {
        key: string
        description: string
        type?: string
        required?: boolean | { when: string } | { unless: string }
        conflicts?: string
        default?: unknown
        defaultDescription?: string
        alias?: string
        envKey?: string
        minimum?: number | bigint
        maximum?: number | bigint
        length?: number
        minimumLength?: number
        maximumLength?: number
        oddLength?: boolean
        noErrors?: boolean
        handler?: () => void
    }

    export interface CommandDefinition {
        key: string
        fullPath: string
        description: string
        options: Argument[]
        arguments: Argument[]
        alias?: string
        sibling?: string
        meta?: any
    }

    export interface ParsedCommand {
        key: string
        fullPath: string
        description: string
        command: CommandDefinition
        options: Record<string, unknown>
        arguments: Record<string, unknown>
    }

    export interface Context {
        exitReason?: string
        command: CommandDefinition
        sibling?: ParsedCommand
        options: Record<string, unknown>
        arguments: Record<string, unknown>
        sourcemap: Record<string, 'default' | 'env' | 'explicit'>
    }

    export class Command {
        constructor(
            name: string,
            description: string,
            settings?: {
                alias?: string
                sibling?: string
            }
        )
        withOption(option: Argument): Command
        withPositional(positional: Argument): Command
        meta?: any
    }

    export class Group {
        constructor(name: string, description: string)
        withCommand(command: Command): Group
        withGroup(group: Group): Group
    }

    export interface Application {
        name: string
        command: string
        version: string
        description: string
    }

    export interface Parser {
        suggest(line: string): string[]
        parse(argv: string[]): string | Context
        addGroup(group: Group): void
        addCommand(command: Command): void
        addGlobalOption(option: Argument): void
    }

    export interface ParserOptions {
        printer?: Printer
        application?: Application
    }

    export function createParser(options?: ParserOptions): Parser

    export interface Printer {
        print(text: string): void
        printError(text: string): void
        printHeading(text: string): void
        formatDim(text: string): string
        formatImportant(text: string): string
    }
}
