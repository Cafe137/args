const { createParser, Group, Command } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('crypto', 'Cryptocurrency commands').withCommand(new Command('list', 'List crypto pairs')))

it('should find group and no command when none is given', () => {
    const context = parser.parse(['crypto'])
    expect(context).toBe('You need to specify a command in group [crypto]')
})

it('should find group and no command when invalid is given', () => {
    const context = parser.parse(['crypto', 'withdraw'])
    expect(context).toBe('Not a valid command in group [crypto]: withdraw')
})

it('should find group and no command when multiple invalid are given', () => {
    const context = parser.parse(['crypto', 'withdraw', 'deposit', 'swap'])
    expect(context).toBe('Not a valid command in group [crypto]: withdraw')
})
