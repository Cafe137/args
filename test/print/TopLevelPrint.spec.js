const { createParser, Group } = require('../../index')

const parser = createParser()
parser.addGroup(new Group('only-group', 'This is the only group.'))

it('should print the group', () => {
    parser.parse([''])
    const calls = process.stdout.write.mock.calls
    expect(calls).toHaveLength(7)
    expect(calls[0][0]).toBe('█ Available groups:\n')
    expect(calls[1][0]).toBe('\n')
    expect(calls[2][0]).toBe('only-group   This is the only group.\n')
    expect(calls[3][0]).toBe('\n')
    expect(calls[4][0]).toBe('█ Command failed with reason:\n')
    expect(calls[5][0]).toBe('\n')
    expect(calls[6][0]).toBe('No group or command specified\n')
})
