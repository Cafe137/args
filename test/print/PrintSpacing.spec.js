const { createSampleApp } = require('../factory')

const parser = createSampleApp()

it('should have 3 spaces between longest command and its description', () => {
    process.stdout.write = jest.fn()
    parser.parse(['file'])
    const calls = process.stdout.write.mock.calls
    expect(calls).toHaveLength(17)
    expect(calls[3][0]).toContain('file download   Download file by name')
})

it('should have 3 spaces between longest group and its description', () => {
    process.stdout.write = jest.fn()
    parser.parse([''])
    const calls = process.stdout.write.mock.calls
    expect(calls).toHaveLength(21)
    expect(calls[2][0]).toContain('auth   Authentication commands')
})

it('should have 3 spaces between longest option and its description', () => {
    process.stdout.write = jest.fn()
    parser.parse(['file', 'download', '--help'])
    const calls = process.stdout.write.mock.calls
    expect(calls).toHaveLength(17)
    expect(calls[14][0]).toContain('   --config-dir   Application configuration directory')
})

it('should have 3 spaces between longest argument and its description', () => {
    process.stdout.write = jest.fn()
    parser.parse(['file', 'upload', '--help'])
    const calls = process.stdout.write.mock.calls
    expect(calls).toHaveLength(25)
    expect(calls[6][0]).toContain('path   Path to file')
})
