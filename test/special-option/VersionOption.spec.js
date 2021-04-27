const { createParser } = require('../../index')

const parser = createParser()
parser.addGlobalOption({
    key: 'version',
    description: 'Print version and quit',
    type: 'boolean',
    alias: 'V',
    handler: () => {
        process.stdout.write('0.1.0\n')
    }
})

it('should handle --version specially', () => {
    const context = parser.parse(['--version'])
    expect(context).toHaveProperty('exitReason', 'version')
})

it('should handle -V specially', () => {
    const context = parser.parse(['-V'])
    expect(context).toHaveProperty('exitReason', 'version')
})

it('should not handle -v', () => {
    const context = parser.parse(['-v'])
    expect(context).toBe('No group or command specified')
})
