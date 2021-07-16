const { createParser, Command, Group } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('feed', 'Test').withCommand(new Command('upload', 'Upload to feed', { sibling: 'upload' })))

it('should raise errors for missing siblings', async () => {
    const context = await parser.parse(['feed', 'upload', 'README.md'])
    expect(context).toBe('Expected sibling command not found!')
})
