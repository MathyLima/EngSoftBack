const mysql = require('mysql2');

class Connection {
  constructor(host, user, password, database) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;

    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      database: this.database,
      password: this.password
    });

    this.connect();
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados', err);
        return;
      }
      console.log('Conectado ao banco de dados com sucesso!');
    });
  }

  getTableColumns(tableName, callback) {
    const sql = `DESCRIBE ${tableName}`;
    this.connection.query(sql, (err, results) => {
      if (err) {
        console.error('Erro ao obter os nomes das colunas: ', err);
        callback(err);
      } else {
        const id = tableName === "vendedor" ? "id_vended" : "id_" + tableName;

        if (Array.isArray(results)) {
          const columnNames = results.map((row) => row.Field);
          const filtered_columns = columnNames.filter(columnName => columnName !== id);
          const columns = filtered_columns.join(', ');
          callback(null, columns);
        } else {
          callback(new Error('A consulta não retornou resultados válidos.'));
        }
      }
    });
  }

  createRow(tableName, values, callback) {
    this.getTableColumns(tableName, (err, columnNames) => {
      if (err) {
        console.error('Erro ao obter os nomes das colunas:', err);
        callback(err);
      } else {
        // Mapeie os valores para adicionar aspas apenas quando necessário
        const placeholders = columnNames
          .split(',')
          .map((colName, index) => (colName.trim() === 'is_lead' ? '?' : '?'))
          .join(', ');
  
        const sql = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
  
        this.connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Erro ao inserir registro', err);
            callback(err);
          } else {
            const insertedId = results.insertId; // Obtém o ID do registro inserido
            console.log('Registro inserido com sucesso! ID:', insertedId);
            callback(null, insertedId); // Retorna o ID como parte do callback
          }
        });
      }
    });
  }

  searchByIdClient(tableName,clienteId, callback) {
    const sql = `SELECT * FROM ${tableName}  WHERE id_cliente = ?`;
    this.connection.query(sql, [clienteId], (err, results) => {
      if (err) {
        console.error("Erro ao buscar interesses", err);
        callback(err);
      } else {
        if (results.length > 0) {
          console.log("Interesses encontrados!");
        } else {
          console.log("Nenhum interesse encontrado para o cliente.");
        }
        callback(null, results);
      }
    });
  }

  getEtapaAndClient(clientId, callback) {
    const sql = "SELECT DISTINCT cliente.*, abordagem.etapa FROM cliente JOIN abordagem ON abordagem.id_cliente = ?";
    
    this.connection.query(sql, [clientId], (err, results) => {
      if (err) {
        console.error("Erro ao buscar interesses", err);
        callback(err);
      } else {
        if (results.length > 0) {
          console.log("Interesses encontrados!");
        } else {
          console.log("Nenhum interesse encontrado para o cliente.");
        }
        callback(null, results);
      }
    });
  }
  
  
  search_all(tableName, callback) {
    const sql = `SELECT * FROM ${tableName}`;
    this.connection.query(sql, (err, results) => {
      if (err) {
        console.error('Erro ao listar clientes', err);
        callback(err);
      } else {
        if (results.length > 0) {
          console.log('Clientes listados!');
        } else {
          console.log('Nenhum registro encontrado!');
        }
        callback(null, results);
      }
    });
  }



  research_by_id(tableName, id, callback) {
    const id_table = tableName === "vendedor" ? "id_vended" : "id_" + tableName;


    const sql = `SELECT * FROM ${tableName} WHERE ${id_table} = '${id}'`;
    this.connection.query(sql, (err, results) => {
      if (err) {
        console.error('Erro ao pesquisar nome', err);
        callback(err);
      } else {
        if (results.length > 0) {
          console.log('Registros encontrados!');
        } else {
          console.log('Nenhum registro encontrado');
        }
        callback(null, results);
      }
    });
  }


  research_by_cpf(tableName,cpf, callback) {
    

  
    const sql = `SELECT nome_vended FROM ${tableName} WHERE cpf = '${cpf}'`;
    this.connection.query(sql, (err, results) => {
      if (err) {
        console.error('Erro ao pesquisar nome', err);
        callback(err);
      } else {
        if (results.length > 0) {
          console.log('Registros encontrados!');
        } else {
          console.log('Nenhum registro encontrado');
        }
        callback(null, results);
      }
    });
  }

  updateRow(tableName, id, values, callback) {
    const id_column = tableName === "vendedor" ? "id_vended" : "id_" + tableName;
  
    this.getTableColumns(tableName, (err, columnNames) => {
      if (err) {
        console.error('Erro ao obter os nomes das colunas:', err);
        callback(err);
      } else {
        const setClause = columnNames
          .split(', ')
          .map((colName, index) => (colName.trim() === 'is_lead' ? 'is_lead = ?' : colName.trim() + ' = ?'))
          .join(', ');
  
        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${id_column} = ?`;
  
        values.push(id);
  
        this.connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Erro ao atualizar registro', err);
            callback(err);
          } else {
            console.log('Registro atualizado com sucesso!');
            callback(null, results);
          }
        });
      }
    });
  }
  

  deleteRow(tableName, id, callback) {
    const id_tabela = tableName === "vendedor" ? "id_vended" : "id_" + tableName;

    const sql = `DELETE FROM ${tableName} WHERE ${id_tabela} = ?`;

    this.connection.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Erro ao remover registro', err);
        callback(err);
      } else {
        console.log('Registro removido com sucesso!');
        callback(null, results);
      }
    });
  }

  login(cpf, senha, callback) {
    const tableName = 'vendedor';
    const sql = `SELECT * FROM ${tableName} WHERE cpf = '${cpf}' AND senha = '${senha}'`;

    this.connection.query(sql, (err, results) => {
      if (err) {
        console.error("Esse login não existe", err);
        callback(err);
      } else {
        if (results.length > 0) {
          console.log("Registros encontrados!");
        } else {
          console.log("Nenhum registro encontrado");
        }
        callback(null, results);
    }
});
}
}

// Preencha com seu login e senha do SGBD
const loginBD = {
  user: 'root',
  password: 'Youngmull4!'
}

const connection = new Connection('localhost', loginBD.user, loginBD.password, 'crm_es');

module.exports = connection;
