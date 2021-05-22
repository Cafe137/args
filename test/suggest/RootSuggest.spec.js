const { createParser, Command, Group } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('group', 'N/A').withCommand(new Command('nested-command', 'N/A')))
parser.addCommand(new Command('command', 'N/A'))

it('should suggest root items', () => {
    const suggestions = parser.suggest('')
    expect(suggestions).toHaveProperty('length', 2)
    expect(suggestions).toHaveProperty('0', 'group')
    expect(suggestions).toHaveProperty('1', 'command')
})
