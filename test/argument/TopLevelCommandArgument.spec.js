const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('upload', 'Test').withPositional({ key: 'path', description: 'Test', type: 'string' }))

it('should allow passing arguments to top level commands', () => {
    const context = parser.parse(['upload', 'README.md'])
    expect(context).toHaveProperty('arguments')
    expect(context.arguments).toHaveProperty('path', 'README.md')
})
