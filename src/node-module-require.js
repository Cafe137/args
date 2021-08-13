function nodeModuleRequire(module) {
    if (require) {
        try {
            return require(module)
        } catch {}
    }
}

module.exports = { nodeModuleRequire }
