const { getShellPath, detectShell, generateCompletion } = require('../../src/shell')

it('should return fish path', () => {
    const path = getShellPath(detectShell('fish'))
    expect(path).toContain('/.config/fish/config.fish')
})

it('should return zsh path', () => {
    const path = getShellPath(detectShell('zsh'))
    expect(path).toContain('/.zshrc')
})

it('should return bash path', () => {
    const path = getShellPath(detectShell('bash'))
    expect(path).toContain('/.bash_profile')
})

it('should generate fish completion', () => {
    const script = generateCompletion('cafe-cli', 'fish')
    expect(script).toBe(`function _cafe_cli
    cafe-cli --compfish --compgen (commandline -pb)
end
complete -f -c cafe-cli -a '(_cafe_cli)'`)
})

it('should generate zsh completion', () => {
    const script = generateCompletion('cafe-cli', 'zsh')
    expect(script).toBe(`_cafe_cli() {
    local IFS=$'\\n'
    compadd -Q -S '' -- \`cafe-cli --compzsh --compgen "\${BUFFER}"\`
}
compdef _cafe_cli cafe-cli`)
})

it('should generate bash completion', () => {
    const script = generateCompletion('cafe-cli', 'bash')
    expect(script).toBe(`_cafe_cli() {
    local IFS=$'\\n'
    local cur prev nb_colon
    _get_comp_words_by_ref -n : cur prev
    nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)
    COMPREPLY=( $(compgen -W '$(cafe-cli --compbash --compgen "\${COMP_LINE}")' -- "$cur") )
    __ltrim_colon_completions "$cur"
}
complete -o nospace -F _cafe_cli cafe-cli`)
})
