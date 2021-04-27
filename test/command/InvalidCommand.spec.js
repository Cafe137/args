const { createParser } = require('../../index')

const parser = createParser()

it('should raise error on invalid commands', () => {
    const context = parser.parse(['invalid'])
    expect(context).toBe('No group or command specified')
})
