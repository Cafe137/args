const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addGlobalOption({ key: 'host', description: 'N/A', type: 'string', default: 'localhost' })
parser.addCommand(new Command('parent', 'N/A'))
parser.addCommand(new Command('child', 'N/A', { sibling: 'parent' }))

it('should make global options available in sibling too', async () => {
    const context = await parser.parse(['child'])
    expect(context).toHaveProperty('sibling')
    expect(context.sibling).toHaveProperty('options')
    expect(context.sibling.options).toHaveProperty('host', 'localhost')
    expect(context).toHaveProperty('options')
    expect(context.options).toHaveProperty('host', 'localhost')
})
