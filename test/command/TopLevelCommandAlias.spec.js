const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('list', 'List files', { alias: 'ls' }))

it('should find top level command by alias', () => {
    const context = parser.parse(['ls'])
    expect(context).toHaveProperty('group', undefined)
    expect(context).toHaveProperty('command')
    expect(context.command).toHaveProperty('key', 'list')
})
