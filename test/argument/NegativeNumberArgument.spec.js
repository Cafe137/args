const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('abs', 'Print absolute value of number').withPositional({ key: 'value', description: 'The number', type: 'number' }))

it('should allow passing negative numbers as arguments', () => {
    const context = parser.parse(['abs', '-42'])
    expect(context).toHaveProperty('arguments')
    expect(context.arguments).toHaveProperty('value', -42)
})
