const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addGlobalOption({
    key: 'interactive',
    type: 'boolean'
})
parser.addCommand(new Command('system').withOption({ key: 'operation', required: { unless: 'interactive' } }))

it('should raise error when not interactive and option is not passed', () => {
    const context = parser.parse(['system'])
    expect(context).toBe('Required option not provided: operation')
})

it('should not raise error when interactive and option is not passed', () => {
    const context = parser.parse(['system', '--interactive'])
    expect(context).toHaveProperty('options.interactive', true)
})

it('should not raise error when not interactive and option is passed', () => {
    const context = parser.parse(['system', '--operation', 'reboot'])
    expect(context).toHaveProperty('options.operation', 'reboot')
})

it('should not raise error when interactive and option is passed', () => {
    const context = parser.parse(['system', '--interactive', '--operation', 'reboot'])
    expect(context).toHaveProperty('options.interactive', true)
    expect(context).toHaveProperty('options.operation', 'reboot')
})
