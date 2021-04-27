const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('deposit', 'Test').withOption({ key: 'amount', description: 'Test', type: 'number', required: true, minimum: 100 }))

it('should raise error when below number is below minimum', () => {
    const context = parser.parse(['deposit', '--amount', '99'])
    expect(context).toBe('[amount] must be at least 100')
})

it('should allow numbers exactly the minimum', () => {
    const context = parser.parse(['deposit', '--amount', '100'])
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('amount', 100)
})
