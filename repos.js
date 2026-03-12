// 2. Definindo o array global para armazenar o conteúdo
let REPOSITORIOS_GLOBAL = [];
// Mantemos as bases das URLs como variáveis para facilitar a substituição
let GITHUB_REPO_URL_BASE = 'https://api.github.com/repos/USUARIOGITHUB/OREPOSITORIO/contents/';
let GITHUB_RAW_URL_BASE = 'https://raw.githubusercontent.com/USUARIOGITHUB/OREPOSITORIO/main/';

let GITHUB_REPO_URL = "";
let GITHUB_RAW_URL = "";
let GITHUB_REPO_HOWTO = "";

async function carregarRepositoriosGithub() {
    const url = "https://raw.githubusercontent.com/marcosmelogithub/BrowsingHowTos/main/repositorios.txt";
    const container = document.getElementById('repositorios-list-container');

    try {
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar arquivo: ${resposta.statusText}`);
        }

        const textoBruto = await resposta.text();

        // Armazenando o conteúdo em um array global 
        REPOSITORIOS_GLOBAL = textoBruto.split(/\r?\n/).filter(linha => linha.trim() !== "");

        container.innerHTML = "<h3>Clique no Repositório que deseja acessar os HowTo's</h3><ul id='listaRepos'></ul>";
        const listaUl = document.getElementById('listaRepos');

        REPOSITORIOS_GLOBAL.forEach(linha => {
            const partes = linha.split(',');
            
            if (partes.length >= 2) {
                const primeiroElemento = partes[0].trim(); // ID ou Nome técnico
                const segundoElemento = partes[1].trim();  // Nome exibido na lista
                
                // 1. Tornar cada linha da lista clicável
                const li = document.createElement('li');
                li.textContent = segundoElemento;
                li.style.cursor = "pointer"; // Melhora a experiência do usuário
                li.style.textDecoration = "underline";
                
                // Adiciona o evento de clique
                li.onclick = function() {
                    tratarCliqueRepositorio(segundoElemento);
                };

                listaUl.appendChild(li);
            }
        });

    } catch (erro) {
        console.error("Falha na operação:", erro);
        if (container) {
            container.innerHTML = `<p style='color:red;'>Erro ao acessar o GitHub: ${erro.message}</p>`;
        }
    }
}

// Função para processar o clique
function tratarCliqueRepositorio(nomeClicado) {
    // 2. Obter o 1º elemento correspondente à opção clicada no array global
    const linhaCorrespondente = REPOSITORIOS_GLOBAL.find(linha => {
        const partes = linha.split(',');
        return partes.length >= 2 && partes[1].trim() === nomeClicado;
    });

    if (linhaCorrespondente) {
        const idRepositorio = linhaCorrespondente.split(',')[0].trim();

        // 3. Substituir a string "USUARIOGITHUB" pela usuário github informado
        GITHUB_REPO_URL = GITHUB_REPO_URL_BASE.replace("USUARIOGITHUB", GITHUB_USER);
        GITHUB_RAW_URL = GITHUB_RAW_URL_BASE.replace("USUARIOGITHUB", GITHUB_USER);

        GITHUB_REPO_URL_BASE = GITHUB_REPO_URL
        GITHUB_RAW_URL_BASE = GITHUB_RAW_URL

        // 4. Substituir a string "OREPOSITORIO" pela informação obtida
        GITHUB_REPO_URL = GITHUB_REPO_URL_BASE.replace("OREPOSITORIO", idRepositorio);
        GITHUB_RAW_URL = GITHUB_RAW_URL_BASE.replace("OREPOSITORIO", idRepositorio);

        // 5. Aciona função para tratar Howto's
        listMarkdownFiles();

        // 6. Exibir um alert com o conteúdo das variáveis
        //alert(`URLs Atualizadas:\n\nRAW: ${GITHUB_RAW_URL}\nREPO: ${GITHUB_REPO_URL}`);
        
        console.log("URL RAW:", GITHUB_RAW_URL);
        console.log("URL REPO:", GITHUB_REPO_URL);
    }
}