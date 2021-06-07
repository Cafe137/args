const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(
    new Command('address', 'Look up address').withPositional({
        key: 'address',
        type: 'hex-string'
    })
)

it('should parse simple hexstring', () => {
    const context = parser.parse(['address', '0c0a0b'])
    expect(context).toHaveProperty('arguments.address', '0c0a0b')
})

it('should parse hexstring and omit 0x prefix', () => {
    const context = parser.parse(['address', '0xaffe1286'])
    expect(context).toHaveProperty('arguments.address', 'affe1286')
})

it('should parse hexstring with uppercase parts', () => {
    const context = parser.parse(['address', 'AABBCC1906ab'])
    expect(context).toHaveProperty('arguments.address', 'aabbcc1906ab')
})

it('should parse hexstring with 0x prefix and uppercase parts', () => {
    const context = parser.parse(['address', '0XFFFFFF20bb'])
    expect(context).toHaveProperty('arguments.address', 'ffffff20bb')
})

it('should not parse 0x only', () => {
    const context = parser.parse(['address', '0x'])
    expect(context).toBe('Expected hex string for address, got 0x')
})
