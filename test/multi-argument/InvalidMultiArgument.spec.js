const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(
    new Command('copy', 'Copies a file')
        .withPositional({ key: 'source', description: 'Path to file', type: 'string', required: true })
        .withPositional({ key: 'target', description: 'Target path', type: 'string', required: true })
)

it('should raise error when all arguments are missing', () => {
    const context = parser.parse(['copy'])
    expect(context).toBe('Required argument [source] is not provided')
})

it('should raise error when one argument are missing', () => {
    const context = parser.parse(['copy', 'README.md'])
    expect(context).toBe('Required argument [target] is not provided')
})

it('should raise error when there is an extra argument', () => {
    const context = parser.parse(['copy', 'README.md', 'readme.txt', '\\'])
    expect(context).toBe('Unexpected argument: \\')
})
