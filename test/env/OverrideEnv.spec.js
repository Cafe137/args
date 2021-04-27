const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('ping', 'Ping address').withOption({ key: 'address', description: 'Address', type: 'string', envKey: 'PING_ADDRESS' }))

it('should use value from specified option, not env', () => {
    process.env.PING_ADDRESS = '8.8.8.8'
    const context = parser.parse(['ping', '--address', '127.0.0.1'])
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('address', '127.0.0.1')
})
