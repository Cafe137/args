const { createParser, Command } = require('../../index')

const parser = createParser()
parser.addCommand(new Command('upload', 'N/A').withOption({ key: 'path' }))
parser.addCommand(new Command('persist', 'N/A', { sibling: 'upload' }).withOption({ key: 'length' }))

it('should suggest options from sibling', () => {
    const suggestions = parser.suggest('persist ')
    expect(suggestions).toHaveProperty('length', 2)
    expect(suggestions).toHaveProperty('0', '--length')
    expect(suggestions).toHaveProperty('1', '--path')
})
