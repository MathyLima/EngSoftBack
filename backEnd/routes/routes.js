const bodyParser = require('body-parser');
const connection = require('../connection');
const express = require('express');

const router = express.Router();

router.put('/api/update_client/:id', (req, res) => {
  const { id } = req.params;
  const {
    cpf,
    nome,
    email,
    telefone_1,
    telefone_2,
    idade,
    endereco,
    cep,
    atual_vendedor,
    is_lead
  } = req.body;
  const values = [
    cpf,
    nome,
    email,
    telefone_1,
    telefone_2,
    idade,
    endereco,
    cep,
    atual_vendedor,
    is_lead
  ];

  connection.updateRow('cliente', id, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar um cliente:', err);
      res.status(500).json({ error: 'Erro ao atualizar um cliente' });
    } else {
      console.log('Cliente atualizado com sucesso!');
      res.status(200).json({ message: 'Cliente atualizado com sucesso!' });
    }
  });
});

router.put('/api/update_vendedor/:id', (req, res) => {
  const { id } = req.params;
  const {
    cpf,
    senha,
    nome_vended,
    email_vended,
    tell_1,
    tell_2,
    endereco,
    cep,
  } = req.body;
  const values = [
    cpf,
    senha,
    nome_vended,
    email_vended,
    tell_1,
    tell_2,
    endereco,
    cep,
  ];

  connection.updateRow('vendedor', id, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar um vendedor:', err);
      res.status(500).json({ error: 'Erro ao atualizar um vendedor' });
    } else {
      console.log('Vendedor atualizado com sucesso!');
      res.status(200).json({ message: 'Vendedor atualizado com sucesso!' });
    }
  });
});

router.post('/api/create_client', (req, res) => {
  const {
    cpf,
    nome,
    email,
    telefone_1,
    telefone_2,
    idade,
    endereco,
    cep,
    atual_vendedor,
    is_lead
  } = req.body;

  const values = [
    cpf,
    nome,
    email,
    telefone_1,
    telefone_2,
    idade,
    endereco,
    cep,
    atual_vendedor,
    is_lead,
  ];

  connection.createRow('cliente', values, (err, result) => {
    if (err) {
      console.error('Erro ao criar um cliente:', err);
      res.status(500).json({ error: 'Erro ao criar um cliente' });
    } else {
      const clienteID = result // Obtém o ID do cliente inserido
      console.log('Cliente criado com sucesso! ID:', clienteID);
      res.status(200).json({ message: 'Cliente criado com sucesso!', id_cliente: clienteID });
    }
  });
});

router.post('/api/create_vendedor', (req, res) => {
  const {
    cpf,
    senha,
    nome,
    email,
    telefone_1,
    telefone_2,
    endereco,
    cep,
  } = req.body;

const values = [
  cpf,
  senha,
  nome,
  email,
  telefone_1,
  telefone_2,
  endereco,
  cep,
];

  connection.createRow('vendedor', values, (err, result) => {
    if (err) {
      console.error('Erro ao criar um vendedor:', err);
      res.status(500).json({ error: 'Erro ao criar um vendedor' });
    } else {
      console.log('Vendedor criado com sucesso!');
      res.status(200).json({ message: 'Vendedor criado com sucesso!' });
    }
  });
});
router.post('/api/create_abordagem', (req, res) => {
  const {
    etapa,
    data_inicio,
    data_fim,
    id_cliente,
    id_vended
  } = req.body;

const values = [
  etapa,
  data_inicio,
  data_fim,
  id_cliente,
  id_vended
];

  connection.createRow('abordagem', values, (err, result) => {
    if (err) {
      console.error('Erro ao criar um vendedor:', err);
      res.status(500).json({ error: 'Erro ao criar um vendedor' });
    } else {
      console.log('Vendedor criado com sucesso!');
      res.status(200).json({ message: 'Vendedor criado com sucesso!' });
    }
  });
});

router.post('/api/create_interesse', (req, res) => {
  const {
    modelo,
    limite_preco,
    cor,
    categoria,
    id_cliente,
  } = req.body;

  const values = [
    modelo,
    limite_preco,
    cor,
    categoria,
    id_cliente
  ];

  connection.createRow('interesse', values, (err, result) => {
    if (err) {
      console.error('Erro ao criar um cliente:', err);
      res.status(500).json({ error: 'Erro ao criar um cliente' });
    } else {
      res.status(200).json({message:'INTERESSE CRIADO COM SUCESSO'})    
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



router.delete('/api/delete_vendedor', (req, res) => {
  const { id } = req.body;
  const values = [id];
  connection.deleteRow('vendedor', id, (err, result) => {
    if (err) {
      console.error('Erro ao deletar um vendedores:', err);
      res.status(500).json({ error: 'Erro ao deletar um vendedores' });
    } else {
      console.log('Cliente deletado com sucesso!');
      res.status(200).json({ message: 'Vendedores deletado com sucesso!' });
    }
  });
});



router.get('/api/search_clients', (req, res) => {
  const { name } = req.query;
  console.log(name);
  connection.research_by_name('cliente', name, (err, results) => {
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
  connection.search_all('cliente', (err, results) => {
    if (err) {
      console.error('Erro ao procurar clientes', err);
      res.status(500).json({ error: 'Erro ao procurar clientes' });
    } else {
      console.log('Busca realizada com sucesso!');
      res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
    }
  });
});

router.get('/api/search_all_vendedores', (req, res) => {
  connection.search_all('vendedor', (err, results) => {
    if (err) {
      console.error('Erro ao procurar clientes', err);
      res.status(500).json({ error: 'Erro ao procurar clientes' });
    } else {
      console.log('Busca realizada com sucesso!');
      res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
    }
  });
});
router.get('/api/search_all_abordagens', (req, res) => {
  connection.search_all('abordagem', (err, results) => {
    if (err) {
      console.error('Erro ao procurar clientes', err);
      res.status(500).json({ error: 'Erro ao procurar clientes' });
    } else {
      console.log('Busca realizada com sucesso!');
      res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
    }
  });
});

router.get("/api/cliente/:clienteId/interesses", (req, res) => {
  const clienteId = req.params.clienteId;

  // Consulta SQL para obter os interesses do cliente com base no 'clienteId'.
  connection.searchByIdClient('interesse', [clienteId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar interesses:", err);
      res.status(500).json({ error: "Erro ao buscar interesses" });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get("/api/cliente/:clienteId/etapa", (req, res) => {
  const clienteId = req.params.clienteId;

  // Consulta SQL para obter os interesses do cliente com base no 'clienteId'.
  connection.searchByIdClient('abordagem', [clienteId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar interesses:", err);
      res.status(500).json({ error: "Erro ao buscar interesses" });
    } else {
      res.status(200).json(results);
    }
  });
});

// router.get('/api/search_vendedor/:id', (req, res) => {
//   const vendedorId = req.params.id;
//   connection.research_by_id('vendedor', vendedorId, (err, results) => {
//     if (err) {
//       console.error('Erro ao procurar vendedor', err);
//       res.status(500).json({ error: 'Erro ao procurar vendedor' });
//     } else {
//       if (results.length > 0) {
//         console.log('Vendedor encontrado!');
//         res.status(200).json(results[0]); // Envie o vendedor encontrado de volta para o cliente
//       } else {
//         console.log('Nenhum vendedor encontrado com o ID fornecido.');
//         res.status(404).json({ error: 'Nenhum vendedor encontrado com o ID fornecido' });
//       }
//     }
//   });
// });

router.get('/api/get_etapa_client/:id', (req, res) => {
  const clienteId = req.params.id; // Alterado para acessar o parâmetro 'id' corretamente.

  // Consulta SQL para obter as informações do cliente com base no 'clienteId'.
  connection.getEtapaAndClient(clienteId, (err, results) => {
    if (err) {
      console.error("Erro ao buscar informações do cliente:", err);
      res.status(500).json({ error: "Erro ao buscar informações do cliente" });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get('/api/search_by_cpf/:cpf', (req, res) => {
  const { cpf } = req.params; // Obtenha o CPF dos parâmetros da URL

  if (!cpf) {
    return res.status(400).json({ error: 'CPF não fornecido' });
  }

  connection.research_by_cpf('vendedor', cpf, (err, results) => {
    if (err) {
      console.error('Erro ao procurar clientes', err);
      res.status(500).json({ error: 'Erro ao procurar clientes' });
    } else {
      console.log('Busca realizada com sucesso!');
      res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
    }
  });
});

router.post("/api/login", (req, res) => {
  const { cpf, password } = req.body; // Use req.body para acessar os dados no corpo da solicitação
  connection.login(cpf, password, (err, results) => {
    if (err) {
      console.error("Erro ao fazer login", err);
      res.status(500).json({ error: "Erro ao procurar cliente" });
    } else {
      console.log("Busca realizada com sucesso!");
      if (results.length === 0) {
        res.status(401).json({ error: "Credenciais inválidas" });
      } else {
        res.status(200).json(results); // Envie os resultados da pesquisa de volta para o cliente
      }
    }
  });
});

module.exports = router;
