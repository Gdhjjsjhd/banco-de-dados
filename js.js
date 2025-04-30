const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const arquivo = 'receitas.json';

if(!fs.existsSync(arquivo)) {
    fs.writeFileSync(arquivo, '[]')
}

const carregarReceitas = () => {
    try{
        const dados = fs.readFileSync(arquivo, 'utf8');
        if (dados.trim() === '') return []
        return JSON.parse(dados)
    } catch (erro) {
        console.error('Erro ao ler ou interpretar o arquivo de receitas: ', erro.message)
        return [];
    }
};

const salvarReceitas = (receitas) => {
    try{
        fs.writeFileSync(arquivo, JSON.stringify(receitas, null, 2))
    } catch(erro) {
        console.error('Erro ao salvar as receitas: ', erro.message)
    }
};

const cadastrarReceita = () => {
    rl.question('Digite o nome da receita: ', (nome) => {
        rl.question('Digite os ingredientes (separados por vírgula): ', (ingredientes) => {
            rl.question('Digite o modo de preparo: ', (preparo) => {
                const novaReceita = {
                    nome, ingredientes: ingredientes.split(',').map((i) => i.trim()),

                    preparo
                };

                const receitas = carregarReceitas();
                receitas.push(novaReceita);
                salvarReceitas(receitas);

                console.log('Receita cadastrada com sucesso!\n');
                menu();
            });
        });
    });
};

const pesquisarReceita = () => {
    rl.question('Digite o nome ou ingrediente da receita: ', (pesquisa) => {
        const receitas = carregarReceitas();
        const resultado = carregarReceitas().filter(receita =>
            receita.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            receita.ingredientes.some(
                ingredientes => ingredientes.toLowerCase().includes(pesquisa.toLowerCase())
            )
        );

        if(resultado.length > 0){
            console.log('\nReceitas encontradas: ');
            resultado.forEach((receitas, index) => {
                console.log(`${index + 1}. ${receitas.nome}`);
                console.log(`Ingredientes: ${receitas.ingredientes.join(', ')}`);
                console.log(`Modo de preparo: ${receitas.preparo}\n`);
            }); 
        } else {
            console.log('Nenhuma receita encontrada. \n');
                
        }

        menu();
    });
};

const menu = () => {
    console.log('Escolha uma opção: \n');
    console.log('1 - Cadastrar receita');
    console.log('2 - Pesquisar receita');
    console.log('3 - Sair');

    rl.question('Opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                cadastrarReceita();
                break;
            case '2':
                pesquisarReceita();
                break;
            case '3':
                console.log('Obrigado por usar o sistema!');
                rl.close()
                 break;
            default:
                console.log('Opção inválida. Tente novamente. \n');
                 menu();
        }
    });  
};

menu()
