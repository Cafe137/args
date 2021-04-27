function prependName(group, name) {
    group.fullPath = name + ' ' + group.fullPath
    for (const child of group.groups) {
        prependName(child, name)
    }
    for (const child of group.commands) {
        child.depth++
        child.fullPath = name + ' ' + child.fullPath
    }
}

function Group(key, description) {
    this.key = key
    this.description = description
    this.groups = []
    this.commands = []
    this.fullPath = key
    this.withGroup = function (group) {
        this.groups.push(group)
        prependName(group, this.fullPath)
        return this
    }
    this.withCommand = function (command) {
        this.commands.push(command)
        command.depth++
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
    this.depth = 0
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
