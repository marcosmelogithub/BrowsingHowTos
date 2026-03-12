// 1. Definindo o array global
let ARRAY_REPOSITORIOS = [];

async function carregarEListarRepositorios() {
    const caminhoArquivo = 'repositorios.txt';
    const container = document.getElementById('repositorios-list-container');

    try {
        // Lendo o conteúdo do arquivo
        const resposta = await fetch(caminhoArquivo);
        
        if (!resposta.ok) throw new Error("Não foi possível ler o arquivo repositorios.txt");

        const textoBruto = await resposta.text();

        // Gerando o array global (separando por quebra de linha e removendo linhas vazias)
        ARRAY_REPOSITORIOS = textoBruto.split(/\r?\n/).filter(linha => linha.trim() !== "");

        // Limpando o container antes de listar
        container.innerHTML = "<h3>Lista de Repositórios:</h3><ul></ul>";
        const listaUl = container.querySelector('ul');

        // 2. Listar o 2º elemento separado por vírgula
        ARRAY_REPOSITORIOS.forEach(linha => {
            const partes = linha.split(',');
            
            // Verifica se existe um segundo elemento (índice 1)
            if (partes.length >= 2) {
                const segundoElemento = partes[1].trim();
                
                const li = document.createElement('li');
                li.textContent = segundoElemento;
                listaUl.appendChild(li);
            }
        });

        console.log("Array Global carregado:", ARRAY_REPOSITORIOS);

    } catch (erro) {
        console.error("Erro na carga dos repositórios:", erro);
        container.innerHTML = "<p style='color:red;'>Erro ao carregar repositorios.txt. Verifique se o arquivo existe na pasta raiz.</p>";
    }
}