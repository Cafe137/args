const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addGlobalOption({ key: 'global', description: 'Test', type: 'string' })
parser.addCommand(new Command('test', 'Test').withOption({ key: 'local', description: 'Test', type: 'string' }))

it('should parse global and local options', () => {
    const context = parser.parse(['test', '--global', 'global', '--local', 'local'])
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('global', 'global')
    expect(context.options).toHaveProperty('local', 'local')
})
