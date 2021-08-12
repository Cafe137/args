const { createParser, Command } = require('../../index')

const counter = {
    value: 0
}

const parser = createParser()
parser.addCommand(
    new Command('increment')
        .withPositional({ key: 'value', type: 'number', required: true })
        .withOption({ key: 'repeat', type: 'number', default: 1 })
        .withFn(context => {
            for (let i = 0; i < context.options.repeat; i++) {
                counter.value += context.arguments.value
            }
        })
)

it('should run fn without option', async () => {
    counter.value = 0
    const context = await parser.parse(['increment', '1'])
    await context.fn()
    expect(counter.value).toBe(1)
})

it('should run fn with option', async () => {
    counter.value = 0
    const context = await parser.parse(['increment', '2', '--repeat', '3'])
    await context.fn()
    expect(counter.value).toBe(6)
})
