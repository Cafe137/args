const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withOption({ key: 'silent', description: 'Test', type: 'boolean', alias: 's' }))

it('should support boolean options', () => {
    const context = parser.parse(['test', '--silent'])
    expect(context).toHaveProperty('command')
    expect(context.command).toHaveProperty('key', 'test')
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('silent', true)
})

it('should support boolean options with alias', () => {
    const context = parser.parse(['test', '-s'])
    expect(context).toHaveProperty('command')
    expect(context.command).toHaveProperty('key', 'test')
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('silent', true)
})
