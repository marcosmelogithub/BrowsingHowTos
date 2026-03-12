// 2. Definindo o array global para armazenar o conteúdo
let REPOSITORIOS_GLOBAL = [];
let GITHUB_REPO_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/OREPOSITORIO/contents/';
let GITHUB_RAW_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/OREPOSITORIO/main/';
let GITHUB_REPO_HOWTO = "";

// 2. Compoe as urls, ainda somente com o usuário github, para leitura dos repositórios com Howtos
//    GITHUB_REPO_URL = 'https://api.github.com/repos/' + GITHUB_USER + '/' + GITHUB_REPO_HOWTO +'/contents/';
//    GITHUB_RAW_URL = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO_HOWTO + '/main/';

async function carregarRepositoriosGithub() {
    // URL convertida para o formato RAW para leitura de dados
    const url = "https://raw.githubusercontent.com/marcosmelogithub/BrowsingHowTos/main/repositorios.txt";
    const container = document.getElementById('repositorios-list-container');

    try {
        // 1. Lendo o conteúdo do arquivo via Fetch API
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar arquivo: ${resposta.statusText}`);
        }

        const textoBruto = await resposta.text();

        // 2. Armazenando o conteúdo em um array global 
        // Separa por quebra de linha e remove linhas vazias
        REPOSITORIOS_GLOBAL = textoBruto.split(/\r?\n/).filter(linha => linha.trim() !== "");

        // Limpando o container e preparando a lista
        container.innerHTML = "<h3>Repositórios</h3><ul id='listaRepos'></ul>";
        const listaUl = document.getElementById('listaRepos');

        // 3. Listar os elementos considerando somente o 2º elemento (separado por vírgula)
        REPOSITORIOS_GLOBAL.forEach(linha => {
            const partes = linha.split(',');
            
            // Verifica se existe o segundo elemento (índice 1)
            if (partes.length >= 2) {
                const segundoElemento = partes[1].trim();
                
                const li = document.createElement('li');
                li.textContent = segundoElemento;
                listaUl.appendChild(li);
            }
        });

        console.log("Array Global atualizado com sucesso:", REPOSITORIOS_GLOBAL);

    } catch (erro) {
        console.error("Falha na operação:", erro);
        if (container) {
            container.innerHTML = `<p style='color:red;'>Erro ao acessar o GitHub: ${erro.message}</p>`;
        }
    }
}