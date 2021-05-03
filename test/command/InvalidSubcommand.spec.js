const { createParser, Group } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('btc', 'Bitcoin operations'))

it('should raise errors on invalid subcommands', () => {
    const context = parser.parse(['btc', 'price'])
    expect(context).toBe('Not a valid command in group [btc]: price')
})
