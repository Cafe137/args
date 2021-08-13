function nodeModuleRequire(module) {
    if (require) {
        return require(module)
    }
}

module.exports = { nodeModuleRequire }
