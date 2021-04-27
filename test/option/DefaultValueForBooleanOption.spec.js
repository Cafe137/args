const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withOption({ key: 'boolean', description: 'Test', type: 'boolean', default: false }))

it('should set default false to a boolean', () => {
    const context = parser.parse(['test'])
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('boolean', false)
})
