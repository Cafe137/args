const { createParser, Command, Group } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('io', 'N/A').withGroup(new Group('file', 'N/A').withCommand(new Command('read', 'N/A')).withCommand(new Command('write', 'N/A'))))
parser.addGroup(new Group('net', 'N/A').withGroup(new Group('http', 'N/A').withCommand(new Command('get', 'N/A')).withCommand(new Command('post', 'N/A'))))

it('should suggest a nested group', () => {
    const suggestions = parser.suggest('io ')
    expect(suggestions).toHaveProperty('length', 1)
    expect(suggestions).toHaveProperty('0', 'file')
})

it('should suggest nested commands', () => {
    const suggestions = parser.suggest('net http ')
    expect(suggestions).toHaveProperty('length', 2)
    expect(suggestions).toHaveProperty('0', 'get')
    expect(suggestions).toHaveProperty('1', 'post')
})
