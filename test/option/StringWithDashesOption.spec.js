const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('check', 'Test').withOption({ key: 'string', description: 'Test', type: 'string' }))

it('should parse strings with dashes', () => {
    const context = parser.parse(['check', '--string', '-test'])
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('string', '-test')
})
