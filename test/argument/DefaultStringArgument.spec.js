const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withPositional({ key: 'country', description: 'Test', type: 'string', default: 'US' }))

it('should set default string when argument is not provided', () => {
    const context = parser.parse(['test'])
    expect(context).toHaveProperty('arguments')
    expect(context.arguments).toHaveProperty('country', 'US')
})
