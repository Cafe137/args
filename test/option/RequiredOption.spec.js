const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('require', 'Test').withOption({ key: 'mandatory', description: 'Test', type: 'string', required: true }))

it('should raise errors when required options are missing', () => {
    const context = parser.parse(['require'])
    expect(context).toBe('Required option not provided: mandatory')
})
