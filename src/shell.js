const { nodeModuleRequire } = require('./node-module-require')

const BASH_ZSH_TEMPLATE = `if type compdef &>/dev/null; then
    _$1() {
        local IFS=$'\\n'
        compadd -Q -S '' -- \`$2 --compzsh --compgen "\${BUFFER}"\`
    }
    compdef _$1 $2
elif type complete &>/dev/null; then
    _$1() {
        local IFS=$'\\n'
        local cur prev nb_colon
        _get_comp_words_by_ref -n : cur prev
        nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)
        COMPREPLY=( $(compgen -W '$($2 --compbash --compgen "\${COMP_LINE}")' -- "$cur") )
        __ltrim_colon_completions "$cur"
    }
    complete -o nospace -F _$1 $2
fi`

const FISH_TEMPLATE = `function _$1
    $2 --compfish --compgen (commandline -pb)
end
complete -f -c $2 -a '(_$1)'`

function generateBashCompletion(command) {
    const name = command.replace(/-/g, '_')
    return BASH_ZSH_TEMPLATE.replace(/\$1/g, name).replace(/\$2/g, command)
}

function generateZshCompletion(command) {
    const name = command.replace(/-/g, '_')
    return BASH_ZSH_TEMPLATE.replace(/\$1/g, name).replace(/\$2/g, command)
}

function generateFishCompletion(command) {
    const name = command.replace(/-/g, '_')
    return FISH_TEMPLATE.replace(/\$1/g, name).replace(/\$2/g, command)
}

function generateCompletion(command, shell) {
    if (shell === 'fish') {
        return generateFishCompletion(command)
    }
    if (shell === 'zsh') {
        return generateZshCompletion(command)
    }
    if (shell === 'bash') {
        return generateBashCompletion(command)
    }
    return null
}

function detectShell(string) {
    if (string.includes('fish')) {
        return 'fish'
    }
    if (string.includes('zsh')) {
        return 'zsh'
    }
    if (string.includes('bash')) {
        return 'bash'
    }
    return null
}

function getShellPaths(string) {
    const path = nodeModuleRequire('path')
    const os = nodeModuleRequire('os')
    if (string === 'fish') {
        return [path.join(os.homedir(), '.config/fish/config.fish')]
    }
    if (string === 'zsh') {
        return [path.join(os.homedir(), '.zshrc')]
    }
    if (string === 'bash') {
        return [path.join(os.homedir(), '.bashrc'), path.join(os.homedir(), '.bash_profile')]
    }
    return null
}

module.exports = { detectShell, getShellPaths, generateCompletion }
