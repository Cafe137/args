declare module 'cafe-args' {
    export interface Argument {
        key: string
        description: string
        type?: string
        required?: boolean
        conflicts?: string
        default?: unknown
        defaultDescription?: string
        alias?: string
        envKey?: string
        minimum?: number | bigint
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

    export interface Parser {
        parse(argv: string[]): Context
        addGroup(group: Group): void
        addCommand(command: Command): void
        addGlobalOption(option: Argument): void
    }

    export function createParser(options?: { printer?: Printer }): Parser

    export interface Printer {
        print(text: string): void
        printError(text: string): void
        printHeading(text: string): void
        formatImportant(text: string): string
    }
}
