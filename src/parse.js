function parseValue(option, rawValue) {
    const { key, type } = option
    if (type === 'boolean') {
        return { value: true, skip: 0 }
    } else if (type === 'number') {
        const value = parseInt(rawValue, 10)
        if (isNaN(value)) {
            return Error('Expected number for ' + key + ', got ' + rawValue)
        }
        if (option.minimum !== undefined && value < option.minimum) {
            return Error('[' + key + '] must be at least ' + option.minimum)
        }
        return { value, skip: 1 }
    } else if (type === 'bigint') {
        try {
            const value = BigInt(rawValue)
            if (option.minimum !== undefined && value < option.minimum) {
                return Error('[' + key + '] must be at least ' + option.minimum)
            }
            return { value, skip: 1 }
        } catch {
            return Error('Expected BigInt for ' + key + ', got ' + rawValue)
        }
    } else {
        return { value: rawValue, skip: 1 }
    }
}

module.exports = { parseValue }
