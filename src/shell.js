const BASH_TEMPLATE = `_$1_completion() {
    local cur prev nb_colon
    _get_comp_words_by_ref -n : cur prev
    nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)
    COMPREPLY=( $(compgen -W '$($2 --compgen "\${COMP_LINE}")' -- "$cur") )
    __ltrim_colon_completions "$cur"
}
complete -F _$1_completion $2`

const ZSH_TEMPLATE = `_$1_complete() {
    compadd -- \`$2 --compgen "\${BUFFER}"\`
}
compdef _$1_complete $2`

const FISH_TEMPLATE = `function _$1_completion
    $2 --compgen (commandline -pb)
end
complete -f -c $2 -a '(_$1_completion)'`

function generateBashCompletion(command) {
    const name = command.replace(/-/g, '_')
    return BASH_TEMPLATE.replace(/\$1/g, name).replace(/\$2/g, command)
}

function generateZshCompletion(command) {
    const name = command.replace(/-/g, '_')
    return ZSH_TEMPLATE.replace(/\$1/g, name).replace(/\$2/g, command)
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

function getShellPath(string) {
    const path = require('path')
    const os = require('os')
    if (string === 'fish') {
        return path.join(os.homedir(), '.config/fish/config.fish')
    }
    if (string === 'zsh') {
        return path.join(os.homedir(), '.zshrc')
    }
    if (string === 'bash') {
        return path.join(os.homedir(), '.bash_profile')
    }
    return null
}

module.exports = { detectShell, getShellPath, generateCompletion }
