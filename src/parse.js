function prepareNumericalString(string) {
    const replaced = string && string.replace ? string.replace(/_/g, '') : string
    if (replaced === '') {
        return null
    }
    return replaced
}

function parseValue(option, rawValue) {
    const { key, type } = option
    if (type === 'boolean') {
        if (rawValue === 'true') {
            return { value: true, skip: 1 }
        } else if (rawValue === 'false') {
            return { value: false, skip: 1 }
        }
        return { value: true, skip: 0 }
    } else if (type === 'number') {
        const value = parseInt(prepareNumericalString(rawValue), 10)
        if (isNaN(value)) {
            return Error('Expected number for ' + key + ', got ' + rawValue)
        }
        if (option.minimum !== undefined && value < option.minimum) {
            return Error('[' + key + '] must be at least ' + option.minimum)
        }
        if (option.maximum !== undefined && value > option.maximum) {
            return Error('[' + key + '] must be at most ' + option.maximum)
        }
        return { value, skip: 1 }
    } else if (type === 'bigint') {
        try {
            const value = BigInt(prepareNumericalString(rawValue))
            if (option.minimum !== undefined && value < option.minimum) {
                return Error('[' + key + '] must be at least ' + option.minimum)
            }
            if (option.maximum !== undefined && value > option.maximum) {
                return Error('[' + key + '] must be at most ' + option.maximum)
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
