const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('time', 'Print current time'))

it('should support top level commands', () => {
    const context = parser.parse(['time'])
    expect(context).toHaveProperty('group', undefined)
    expect(context).toHaveProperty('command')
    expect(context.command).toHaveProperty('key', 'time')
})
