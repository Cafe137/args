const { createParser, Command } = require('../../index')
const fs = require('fs')

const parser = createParser()
parser.addCommand(
    new Command('file').withPositional({
        key: 'path',
        autocompletePath: true
    })
)

function createDirectory(path) {
    fs.mkdirSync(path, { recursive: true })
}

try {
    fs.statSync('test-data')
} catch {
    createDirectory('test-data/alpha')
    createDirectory('test-data/beta')
    createDirectory('test-data/gamma/eta')
    createDirectory('test-data/gamma/theta')
    fs.writeFileSync('test-data/beta/delta.txt', '')
    fs.writeFileSync('test-data/beta/zeta.txt', '')
    fs.writeFileSync('test-data/gamma/epsilon.txt', '')
    fs.writeFileSync('test-data/gamma/iota.txt', '')
    fs.writeFileSync('test-data/gamma/theta/kappa.txt', '')
}

it('should complete directory', async () => {
    const suggestions = await parser.suggest('file test-d')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toBe('test-data/')
})

it('should list directory entries with trailing slash', async () => {
    const suggestions = await parser.suggest('file test-data/')
    expect(suggestions).toHaveLength(3)
    expect(suggestions[0]).toBe('test-data/alpha/')
    expect(suggestions[1]).toBe('test-data/beta/')
    expect(suggestions[2]).toBe('test-data/gamma/')
})

it('should list multiple matching entries', async () => {
    const suggestions = await parser.suggest('file test-data/gamma/e')
    expect(suggestions).toHaveLength(2)
    expect(suggestions[0]).toBe('test-data/gamma/epsilon.txt')
    expect(suggestions[1]).toBe('test-data/gamma/eta/')
})

it('should complete file', async () => {
    const suggestions = await parser.suggest('file test-data/gamma/ep')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toBe('test-data/gamma/epsilon.txt')
})

it('should allow stepping backwards', async () => {
    const suggestions = await parser.suggest('file test-data/alpha/../gam')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toBe('test-data/alpha/../gamma/')
})

it('should not suggest anything with triple dots', async () => {
    const suggestions = await parser.suggest('file test-data/alpha/.../gam')
    expect(suggestions).toHaveLength(0)
})

it('should not suggest anything in basedir', async () => {
    const suggestions = await parser.suggest('file no-such')
    expect(suggestions).toHaveLength(0)
})

it('should not suggest anything in directory', async () => {
    const suggestions = await parser.suggest('file test-data/args')
    expect(suggestions).toHaveLength(0)
})

it('should not suggest anything in missing path', async () => {
    const suggestions = await parser.suggest('file test-data/args/lambda')
    expect(suggestions).toHaveLength(0)
})

it('should work with ./ prefix', async () => {
    const suggestions = await parser.suggest('file ./test-da')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toBe('./test-data/')
})

it('should work with ./ prefix deeply', async () => {
    const suggestions = await parser.suggest('file ./test-data/./a')
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toBe('./test-data/./alpha/')
})

it('should allow directory reentry', async () => {
    const suggestions = await parser.suggest('file ./test-data/../test-data/../test-data/../test-data/')
    expect(suggestions).toHaveLength(3)
    expect(suggestions[0]).toBe('./test-data/../test-data/../test-data/../test-data/alpha/')
    expect(suggestions[1]).toBe('./test-data/../test-data/../test-data/../test-data/beta/')
    expect(suggestions[2]).toBe('./test-data/../test-data/../test-data/../test-data/gamma/')
})
