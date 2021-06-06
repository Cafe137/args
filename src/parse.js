function prepareNumericalString(string) {
    const replaced = string && string.replace ? string.replace(/_/g, '') : string
    if (replaced === '') {
        return null
    }
    return replaced
}

function parseNumericalUnit(rawValue) {
    if (/[kK]$/.test(rawValue)) {
        return { b: 1000n, n: 1e3 }
    }
    if (/[mM]$/.test(rawValue)) {
        return { b: 1000000n, n: 1e6 }
    }
    if (/[bB]$/.test(rawValue)) {
        return { b: 1000000000n, n: 1e9 }
    }
    if (/[tT]$/.test(rawValue)) {
        return { b: 1000000000000n, n: 1e12 }
    }
    return null
}

function parseNumber(option, rawValue) {
    const multiplier = parseNumericalUnit(rawValue)
    const parsableString = multiplier ? rawValue.slice(0, rawValue.length - 1) : rawValue
    if (!/^\-?[0-9_]+$/.test(parsableString)) {
        return Error('Expected number for ' + option.key + ', got ' + rawValue)
    }
    const value = parseInt(prepareNumericalString(parsableString), 10)
    if (isNaN(value)) {
        return Error('Expected number for ' + option.key + ', got ' + rawValue)
    }
    if (option.minimum !== undefined && value < option.minimum) {
        return Error('[' + option.key + '] must be at least ' + option.minimum)
    }
    if (option.maximum !== undefined && value > option.maximum) {
        return Error('[' + option.key + '] must be at most ' + option.maximum)
    }
    return { value: multiplier ? value * multiplier.n : value, skip: 1 }
}

function parseBigInt(option, rawValue) {
    try {
        const multiplier = parseNumericalUnit(rawValue)
        const parsableString = multiplier ? rawValue.slice(0, rawValue.length - 1) : rawValue
        const value = BigInt(prepareNumericalString(parsableString))
        if (option.minimum !== undefined && value < option.minimum) {
            return Error('[' + option.key + '] must be at least ' + option.minimum)
        }
        if (option.maximum !== undefined && value > option.maximum) {
            return Error('[' + option.key + '] must be at most ' + option.maximum)
        }
        return { value: multiplier ? value * multiplier.b : value, skip: 1 }
    } catch {
        return Error('Expected BigInt for ' + option.key + ', got ' + rawValue)
    }
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
        return parseNumber(option, rawValue)
    } else if (type === 'bigint') {
        return parseBigInt(option, rawValue)
    } else {
        return { value: rawValue, skip: 1 }
    }
}

module.exports = { parseValue }
