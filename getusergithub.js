// Variável Global
let GITHUB_USER = "";
let GITHUB_REPO_URL = "";
let GITHUB_RAW_URL = ""

async function verificarEnter(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("githubInput");
        const valor = input.value.trim();

        if (valor === "") {
            document.body.innerHTML = "<h1>Aplicação Encerrada.</h1>";
            return;
        }

        // Chamada da nova função de validação
        const mensagemErro = await validarContaGithub(valor);

        if (mensagemErro !== "") {
            alert(mensagemErro); // Ou mostre em um elemento de texto na tela
            input.focus();
        } else {
            // Se retornou vazio, a conta é válida!
            exibirUsuario(valor);
        }
    }
}

function exibirUsuario(nome) {
    // 1. Armazena o nome do usuário em uma variável global
    GITHUB_USER = nome;

    // 2. Compoe as urls, ainda somente com o usuário github, para leitura dos repositórios com Howtos
    GITHUB_REPO_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/MundoMainframe/contents/';
    GITHUB_RAW_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/MundoMainframe/main/';


    const requestArea = document.getElementById("requestArea");
    const displayArea = document.getElementById("displayArea");
    const nameSpan = document.getElementById("userNameBold");

    // 3. Esconde a área de input
    requestArea.style.display = "none";

    // 4. Alimenta e mostra a área de mensagem
    // nameSpan.textContent = GITHUB_USER;
    // displayArea.style.display = "flex";
    atualizarHeaderComGlobal();

    // 5. Lista os repositórios
    carregarEListarRepositorios();

    console.log("Variável Global GITHUB_USER:", GITHUB_USER);
}

function atualizarHeaderComGlobal() {
    // Supondo que GITHUB_USER seja sua variável global
    const headerVarElement = document.getElementById('headerGlobalVar');
    if (headerVarElement) {
        headerVarElement.textContent = `Sessão GitHub: ${GITHUB_USER}`;
    }
}

/**
 * Verifica se um nome de usuário existe no GitHub.
 * @param {string} username - O nome do usuário a ser validado.
 * @returns {Promise<string>} - Retorna uma mensagem de erro ou uma string vazia se for válido.
 */
async function validarContaGithub(username) {
    // 1. Limpeza básica da string
    const user = username.trim();

    // Validação de formato (regras do GitHub: alfanumérico e hifens, sem iniciar com hífen)
    const regexValida = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    
    if (!user || !regexValida.test(user)) {
        return "Formato de nome de usuário inválido.";
    }

    try {
        // 2. Tentar verificar a conta na API do GitHub
        const resposta = await fetch(`https://api.github.com/users/${user}`);

        // 3. Se não for uma conta válida (status 404), retorna erro
        if (resposta.status === 404) {
            return "Conta GitHub não encontrada.";
        }

        if (!resposta.ok) {
            return "Erro ao consultar o GitHub. Tente novamente mais tarde.";
        }

        // 4. Se for válida, retorna vazio
        return "";

    } catch (error) {
        return "Erro de conexão com a rede.";
    }
}