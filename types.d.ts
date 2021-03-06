declare module 'cafe-args' {
    export type CafeFnContext = { options: Record<string, unknown>; arguments: Record<string, unknown> }

    export type CafeFn = (context: CafeFnContext) => Promise<void>

    export type PreparedCafeFn = () => Promise<void>

    export interface Argument<T = unknown> {
        key: string
        description: string
        type?: 'string' | 'boolean' | 'number' | 'bigint' | 'hex-string'
        required?: boolean | { when: string } | { unless: string }
        conflicts?: string
        default?: T
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
        autocompletePath?: boolean
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
        fn?: CafeFn
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
        options: Record<string, unknown>
        arguments: Record<string, unknown>
        fn?: PreparedCafeFn
        sourcemap: Record<string, 'default' | 'env' | 'explicit'>
        sibling?: ParsedCommand
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
        withFn(fn: CafeFn): Command
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
        suggest(line: string, offset: number, trailing: string): Promise<string[]>
        parse(argv: string[]): Promise<string | Context>
        addGroup(group: Group): void
        addCommand(command: Command): void
        addGlobalOption(option: Argument): void
    }

    export interface ParserOptions {
        printer?: Printer
        application?: Application
        pathResolver?: (word: string) => Promise<string[]>
    }

    export function createParser(options?: ParserOptions): Parser

    export interface TokenizeContext {
        argv: string[]
        quotes: false | string
        token: string
        opensNext: boolean
    }

    export function tokenize(string: string, offset: number): TokenizeContext

    export type Shell = 'fish' | 'zsh' | 'bash'

    export function detectShell(string: string): Shell | null

    export function getShellPaths(shell: Shell): string[]

    export function generateCompletion(command: string, shell: Shell): string

    export interface Printer {
        print(text: string): void
        printError(text: string): void
        printHeading(text: string): void
        formatDim(text: string): string
        formatImportant(text: string): string
    }
}
