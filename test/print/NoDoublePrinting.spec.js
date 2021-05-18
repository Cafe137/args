const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('upload', 'Upload file or directory').withOption({ key: 'token', description: 'Access token', required: true }))
parser.addCommand(
    new Command('persist', 'Upload and persist data', { sibling: 'upload' }).withOption({ key: 'token', description: 'Access token', required: true })
)

it('should print shared option only once', () => {
    parser.parse(['upload'])
    const calls = process.stdout.write.mock.calls
    expect(calls[7][0]).toBe('\n')
    expect(calls[8][0]).toContain('--token')
    expect(calls[9][0]).toBe('\n')
})
