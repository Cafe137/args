const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withPositional({ key: 'argument', description: 'Test', type: 'number' }))

it('should parse argument as a number', () => {
    const context = parser.parse(['test', '42'])
    expect(context).toHaveProperty('arguments')
    expect(context.arguments).toHaveProperty('argument', 42)
})

it('should raise error when argument is not a number', () => {
    const context = parser.parse(['test', 'localhost'])
    expect(context).toBe('Expected number for argument, got localhost')
})
