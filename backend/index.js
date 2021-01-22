const app = require('express')();
const consign = require('consign');
const db = require('./config/db');

app.db = db;

// consign
// O consign vai ajudar a fazer as dependências dentro da aplicação.
// O comum é usar o module.exports e o require.
// Para não precisar ficar fazendo require de todos os arquivos da aplicação, o consign vai ajudar a fazer isso.
// Padrão do consign:
// Exportar usando module.exports e exportando uma função que recebe um parâmetro. Na aula o professor chamou a função de app.
// Esse parâmetro app será o mesmo que foi chamado dentro da pasta ../index, onde foi startado a aplicação.
// Esse app que é uma instância do express vai servir como um centralizador de tudo aquilo que vai ser usado na aplicação, e o consign vai ser
// responsável por colocar os métodos, a api tudo dentro de app.

consign() // chameia a função.
    .then('./config/tbNames.js')
    .include('./config/passport.js')
    .then('./config/middlewares.js') // encadeio.
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app) // Aqui ele vai usar, injetar cada uma das dependências que ele vai carregar. Ele vai injetar como parâmetro o app que foi criado.

// Ele sabe o que está sendo carregado pelo caminho informado no then.
// O consign vai ser o responsável por passar o app como parâmetro para o arquivo informado no then. Dentro desse arquivo é exportado uma
// função e essa função vai ser o app.
// E dentro desse arquivo é possível injetar o middlewares da aplicação.

app.listen(3010, () => console.log('Backend executando na porta 3010.'));