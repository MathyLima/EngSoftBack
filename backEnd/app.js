const express = require('express');
const app = express();
const routes = require('./routes/routes'); // Verifique o caminho correto para o arquivo de rotas
const cors = require('cors'); // Importe o módulo cors

// Defina as opções do CORS para permitir apenas solicitações do seu aplicativo React

// O middleware cors deve ser chamado apenas uma vez, para evitar erros, como bloqueios nos metodos
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions)); 

app.use(express.json()); 
const PORT = process.env.PORT || 3001;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
