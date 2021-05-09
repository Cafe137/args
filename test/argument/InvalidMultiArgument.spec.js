const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('upload', 'Test').withPositional({ key: 'path', description: 'Test', type: 'string' }))

it('should raise errors when passing an argument multiple times', () => {
    const context = parser.parse(['upload', 'foo', 'bar'])
    expect(context).toBe('Unexpected argument: bar')
})
