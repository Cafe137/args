const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withOption({ key: 'large', description: 'Test', type: 'bigint', required: true }))

it('should parse bigints', () => {
    const context = parser.parse(['test', '--large', '123456789012345678901234567890'])
    expect(context).toHaveProperty('command')
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('large', 123456789012345678901234567890n)
})
