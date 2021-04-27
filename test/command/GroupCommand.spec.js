const { createParser, Group, Command } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('people', 'Manage people').withCommand(new Command('list', 'Test')))

it('should support group commands', () => {
    const context = parser.parse(['people', 'list'])
    expect(context).toHaveProperty('group')
    expect(context.group).toHaveProperty('key', 'people')
    expect(context).toHaveProperty('command')
    expect(context.command).toHaveProperty('key', 'list')
})
