const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('parent', 'N/A', { sibling: 'child' }))
parser.addCommand(new Command('child', 'N/A').withPositional({ key: 'path', description: 'N/A', type: 'string', required: true }))

it('should raise errors for missing required sibling arguments', () => {
    const context = parser.parse(['parent'])
    expect(context).toBe('Required argument [path] is not provided')
})
