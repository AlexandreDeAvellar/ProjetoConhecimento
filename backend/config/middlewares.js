const bodyParser = require('body-parser');

// cors
// É para permitir que possa, à partir de uma origem digerente, de uma outra aplicação, acessar a api que vai ser construida no backend.
// Nessa aula o exemplo é que tem duas aplicações rodando, uma backend e outra frontend, e cada uma roda em uma porta diferente. Para que
// elas consigam se comunicar é usado o cors.
const cors = require('cors');


module.exports = app => {
    app.use(bodyParser.json());
    app.use(cors);
}