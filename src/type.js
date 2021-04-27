function Group(key, description) {
    this.key = key
    this.description = description
    this.commands = []
    this.withCommand = function (command) {
        this.commands.push(command)
        command.fullPath = key + ' ' + command.fullPath
        return this
    }
    return this
}

function Command(key, description, settings) {
    this.key = key
    this.description = description
    if (settings) {
        this.sibling = settings.sibling
        this.alias = settings.alias
    }
    this.options = []
    this.arguments = []
    this.fullPath = key
    this.withOption = function (x) {
        this.options.push(x)
        return this
    }
    this.withPositional = function (x) {
        this.arguments.push(x)
        return this
    }
}

module.exports = {
    Group,
    Command
}
