const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        const msg = 'Não foi possível conectar com o mongoDB!';
        console.log(msg);
    })