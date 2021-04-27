const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('withdraw', 'Test').withOption({ key: 'amount', description: 'Test', type: 'bigint', required: true, minimum: 50 }))

it('should raise error when below bigint is below minimum', () => {
    const context = parser.parse(['withdraw', '--amount', '49'])
    expect(context).toBe('[amount] must be at least 50')
})

it('should allow bigint exactly the minimum', () => {
    const context = parser.parse(['withdraw', '--amount', '50'])
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('amount', 50n)
})
