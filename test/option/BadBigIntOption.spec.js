const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('test', 'Test').withOption({ key: 'large', description: 'Test', type: 'bigint', required: true }))

it('should raise error when bigint option cannot be parsed', () => {
    const context = parser.parse(['test', '--large', 'a123'])
    expect(context).toBe('Expected BigInt for large, got a123')
})
