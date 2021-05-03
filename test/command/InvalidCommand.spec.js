const { createParser } = require('../../index')

const parser = createParser()

it('should raise error on invalid commands', () => {
    const context = parser.parse(['invalid'])
    expect(context).toBe('Not a valid group or command: invalid')
})
