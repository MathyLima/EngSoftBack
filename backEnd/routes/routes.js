const bodyParser = require('body-parser');
const connection = require('../connection');
const express = require('express');

const router = express.Router();

router.put('/api/update_client/:id', (req, res) => {
  const { id } = req.params;
  const {
    nome,
    busto_largura,
    busto_altura,
    cintura_largura,
    cintura_altura,
    quadril_largura,
    quadril_altura,
  } = req.body;
  const values = [
    nome,
    busto_largura,
    busto_altura,
    cintura_largura,
    cintura_altura,
    quadril_largura,
    quadril_altura,
  ];

  connection.updateRow('clientes', id, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar um cliente:', err);
      res.status(500).json({ error: 'Erro ao atualizar um cliente' });
    } else {
      console.log('Cliente atualizado com sucesso!');
      res.status(200).json({ message: 'Cliente atualizado com sucesso!' });
    }
  });
});

router.post('/api/create_client', (req, res) => {
  const {
    nome,
    busto_largura,
    busto_altura,
    cintura_largura,
    cintura_altura,
    quadril_largura,
    quadril_altura,
  } = req.body;

  const values = [
    nome,
    busto_largura,
    busto_altura,
    cintura_largura,
    cintura_altura,
    quadril_largura,
    quadril_altura,
  ];
  connection.createRow('clientes', values, (err, result) => {
    if (err) {
      console.error('Erro ao criar um cliente:', err);
      res.status(500).json({ error: 'Erro ao criar um cliente' });
    } else {
      console.log('Cliente criado com sucesso!');
      res.status(200).json({ message: 'Cliente criado com sucesso!' });
    }
  });
});

router.delete('/api/delete_client', (req, res) => {
  const { id } = req.body;
  const values = [id];
  connection.deleteRow('clientes', id, (err, result) => {
    if (err) {
      console.error('Erro ao deletar um cliente:', err);
      res.status(500).json({ error: 'Erro ao deletar um cliente' });
    } else {
      console.log('Cliente deletado com sucesso!');
      res.status(200).json({ message: 'Cliente deletado com sucesso!' });
    }
  });
});

router.get('/api/search_clients', (req, res) => {
  const { name } = req.query;
  console.log(name);
  connection.research_by_name('clientes', name, (err, results) => {
    if (err) {
      console.error('Erro ao procurar cliente com nome:', { name }, err);
      res.status(500).json({ error: 'Erro ao procurar cliente' });
    } else {
      console.log('Busca realizada com sucesso!');
      res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
    }
  });
});

router.get('/api/search_all_clients', (req, res) => {
  connection.search_all('clientes', (err, results) => {
    if (err) {
      console.error('Erro ao procurar clientes', err);
      res.status(500).json({ error: 'Erro ao procurar clientes' });
    } else {
      console.log('Busca realizada com sucesso!');
      res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
    }
  });
});

module.exports = router;
