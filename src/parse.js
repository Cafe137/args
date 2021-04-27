function parseValue(option, argument) {
    const { key, type } = option
    if (type === 'boolean') {
        return { value: true, skip: 0 }
    } else if (type === 'number') {
        const value = parseInt(argument, 10)
        if (isNaN(value)) {
            return Error('Expected number for ' + key + ', got ' + argument)
        }
        if (option.minimum !== undefined && value < option.minimum) {
            return Error('[' + key + '] must be at least ' + option.minimum)
        }
        return { value, skip: 1 }
    } else if (type === 'bigint') {
        try {
            const value = BigInt(argument)
            if (option.minimum !== undefined && value < option.minimum) {
                return Error('[' + key + '] must be at least ' + option.minimum)
            }
            return { value, skip: 1 }
        } catch {
            return Error('Expected BigInt for ' + key + ', got ' + argument)
        }
    } else {
        return { value: argument, skip: 1 }
    }
}

module.exports = { parseValue }
