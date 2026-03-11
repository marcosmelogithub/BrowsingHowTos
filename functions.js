// Arquivo para armazenar funções JavaScript reutilizáveis

const GITHUB_REPO_URL = 'https://api.github.com/repos/marcosmelogithub/MundoMainframe/contents/';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/marcosmelogithub/MundoMainframe/main/';

/**
 * Função para obter a primeira linha de um arquivo .md
 */
function getFirstLine(filename) {
    const fileUrl = GITHUB_RAW_URL + filename;
    
    return fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar arquivo');
            }
            return response.text();
        })
        .then(content => {
            // Extrair a primeira linha não vazia
            const lines = content.split('\n');
            for (let line of lines) {
                let trimmedLine = line.trim();
                if (trimmedLine) {
                    // Remover caracteres # e * do início e final
                    trimmedLine = trimmedLine.replace(/^[#*\s]+|[*\s]+$/g, '').trim();
                    return trimmedLine.substring(0, 100); // Limitar a 100 caracteres
                }
            }
            return '(sem título)';
        })
        .catch(error => {
            console.error(`Erro ao obter primeira linha de ${filename}:`, error);
            return '(erro ao carregar)';
        });
}
function displayMarkdownContent(filename) {
    const contentContainer = document.getElementById('markdown-content-container');
    
    if (!contentContainer) {
        console.error('Container para conteúdo não encontrado');
        return;
    }
    
    // Mostrar mensagem de carregamento
    contentContainer.innerHTML = '<p>Carregando conteúdo...</p>';
    
    const fileUrl = GITHUB_RAW_URL + filename;
    
    fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar arquivo: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            // Renderizar o markdown como HTML
            const htmlContent = marked.parse(content);
            contentContainer.innerHTML = htmlContent;
            
            // Converter caminhos relativos de imagens para URLs absolutas do GitHub
            const images = contentContainer.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src');
                // Se o caminho é relativo (não começa com http/https//)
                if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
                    // Converter para URL absoluta do GitHub Raw
                    const absoluteUrl = GITHUB_RAW_URL + src;
                    img.setAttribute('src', absoluteUrl);
                }
            });
            
            // Converter blocos de código language-mermaid em divs mermaid
            const codeBlocks = contentContainer.querySelectorAll('code.language-mermaid');
            codeBlocks.forEach(block => {
                const mermaidCode = block.textContent;
                const pre = block.parentElement;
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.textContent = mermaidCode;
                pre.replaceWith(mermaidDiv);
            });
            
            // Processar e renderizar diagramas Mermaid
            if (window.mermaid) {
                mermaid.contentLoaded();
            }
            
            console.log(`Arquivo ${filename} carregado com sucesso`);
        })
        .catch(error => {
            console.error('Erro ao carregar conteúdo:', error);
            contentContainer.innerHTML = `<p style="color: red;">Erro ao carregar arquivo: ${error.message}</p>`;
        });
}

/**
 * Função para listar todos os arquivos .md do repositório ProjetoHowTo
 */
function listMarkdownFiles() {
    const resultContainer = document.getElementById('markdown-files-container');
    
    if (!resultContainer) {
        console.error('Container para arquivos markdown não encontrado');
        return;
    }
    
    // Mostrar mensagem de carregamento
    resultContainer.innerHTML = '<p>Carregando arquivos markdown...</p>';
    
    fetch(GITHUB_REPO_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Filtrar apenas arquivos .md que começam com "HowTo"
            const mdFiles = data.filter(file => file.name.endsWith('.md') && file.name.startsWith('How'));
            
            // Classificar em ordem crescente pelo nome do arquivo
            mdFiles.sort((a, b) => a.name.localeCompare(b.name));
            
            if (mdFiles.length === 0) {
                resultContainer.innerHTML = '<p>Nenhum arquivo .md encontrado no repositório.</p>';
                return Promise.resolve([]);
            }
            
            // Carregando primeira linha de cada arquivo
            resultContainer.innerHTML = '<p>Carregando títulos dos arquivos...</p>';
            
            // Obter primeira linha de todos os arquivos em paralelo
            const filePromises = mdFiles.map(file => 
                getFirstLine(file.name).then(firstLine => ({
                    filename: file.name,
                    title: firstLine
                }))
            );
            
            return Promise.all(filePromises);
        })
        .then(filesWithTitles => {
            if (!filesWithTitles || filesWithTitles.length === 0) {
                resultContainer.innerHTML = '<p>Nenhum arquivo .md encontrado no repositório.</p>';
                return;
            }
            
            // Criar lista com as primeiras linhas
            let htmlContent = '<ul>';
            filesWithTitles.forEach(file => {
                htmlContent += `<li><a href="#" onclick="displayMarkdownContent('${file.filename}'); return false;">${file.title}</a></li>`;
            });
            htmlContent += '</ul>';
            
            resultContainer.innerHTML = htmlContent;
            console.log(`${filesWithTitles.length} arquivo(s) .md encontrado(s)`);
        })
        .catch(error => {
            console.error('Erro ao listar arquivos:', error);
            resultContainer.innerHTML = `<p style="color: red;">Erro ao listar arquivos: ${error.message}</p>`;
        });
}

/**
 * Função para ler repositorios.txt e exibir o segundo elemento de cada linha
 */
function listRepositorios() {
    const container = document.getElementById('repositorios-list-container');
    if (!container) {
        console.error('Container para repositorios não encontrado');
        return;
    }

    container.innerHTML = '<p>Carregando repositorios...</p>';

    fetch('repositorios.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar repositorios.txt: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length === 0) {
                container.innerHTML = '<p>Nenhum repositório encontrado.</p>';
                return;
            }

            const items = lines.map(line => {
                const parts = line.split(',').map(p => p.trim());
                return parts[1] || '(sem segundo elemento)';
            });

            const html = '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao carregar repositorios:', error);
            container.innerHTML = `<p style="color: red;">Erro ao carregar repositorios: ${error.message}</p>`;
        });
}

/**
 * Solicita e valida usuário GitHub antes de continuar
 * Retorna nome do usuário válido ou null se o usuário sair
 */
async function askGitHubUsername() {
    while (true) {
        const rawInput = prompt('Digite seu usuário do GitHub (deixe em branco e ENTER para sair):', '');

        if (rawInput === null) {
            // Usuário pressionou Cancelar no prompt
            return null;
        }

        const username = rawInput.trim();

        if (username === '') {
            return null; // opção de saída sem informar usuário
        }

        try {
            const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
            if (response.ok) {
                return username;
            }

            alert('Usuário GitHub inválido. Tente novamente.');
        } catch (error) {
            console.error('Erro ao verificar usuário GitHub:', error);
            alert('Não foi possível verificar o usuário GitHub no momento. Tente novamente.');
        }
    }
}

/**
 * Função inicializadora da página
 */
async function initializePage() {
    console.log('Página inicializada com sucesso');

    const username = await askGitHubUsername();
    const reposContainer = document.getElementById('repositorios-list-container');

    if (!reposContainer) {
        console.error('Container para repositorios não encontrado');
        return;
    }

    if (!username) {
        reposContainer.innerHTML = '<p>Aplicação encerrada. Nenhum usuário GitHub informado.</p>';
        return;
    }

    reposContainer.innerHTML = `<p>Usuário GitHub válido: <strong>${username}</strong></p>`;
    listRepositorios();
    listMarkdownFiles();
}

// Inicializa a página quando o DOM está pronto
document.addEventListener('DOMContentLoaded', initializePage);