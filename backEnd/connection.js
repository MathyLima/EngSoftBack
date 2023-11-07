const mysql = require('mysql2');

class Connection{
    constructor(host,user,password,database){
        this.host=host;
        this.user = user;
        this.password = password;
        this.database = database;
        

        this.connection = mysql.createConnection({
            host:this.host,
            user:this.user,
            database:this.database,
            password:this.password
        })

        this.connect();
    }

    connect(){
        this.connection.connect((err)=>{
            if (err){
                console.error('Erro ao conectar ao banco de dados',err);
                return
            }
            console.log('Conectado ao banco de dados com sucesso!');
        });
    }

    getTableColumns(tableName,callback){
        const sql = `DESCRIBE ${tableName}`;
        this.connection.query(sql,(err,results)=>{
            if(err){
                console.error('Erro ao obter os nomes das colunas: ',err)
            }else{
                const columnNames = results.map((row) => row.Field);
                const filtered_columns = columnNames.filter(columnName=>columnName !== 'id');
                const columns = filtered_columns.join(', ')
                callback(null,columns);
            }
        })
    }

//create
createRow(tableName, values, callback) {
    this.getTableColumns(tableName, (err, columnNames) => {
      if (err) {
        console.error('Erro ao obter os nomes das colunas:', err);
        callback(err);
      } else {
        const placeholders = columnNames.split(',').map(() => '?').join(', ');
        const sql = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
  
        // Execute a consulta SQL para inserir os valores
        this.connection.query(sql, values, (err, results) => {
          if (err) {
            console.error('Erro ao inserir registro', err);
            callback(err);
          } else {
            console.log('Registro inserido com sucesso!');
            callback(null, results);
          }
        });
      }
    });
  }
  
  

    search_all(tableName,callback){
        const sql = `SELECT * FROM ${tableName}`;
        this.connection.query(sql,(err,results)=>{
            if(err){
                console.error('Erro ao listar clientes');
                callback(err)
            }else{
                if(results.length > 0){
                console.log('Clientes listados!');
                }else{
                    console.log('Nenhum registro encontrado!');
                }
                callback(null,results);
            }
        });
    }
    //research
    research_by_name(tableName,name,callback){
        const sql = `SELECT * FROM ${tableName} WHERE nome_cliente = '${name}' `;
        this.connection.query(sql,(err,results)=>{
            if(err){
                console.error('Erro ao pesquisar nome');
                callback(err);
            }else{
                if (results.length > 0){
                    console.log('Registros encontrados!');
                }
                    else{
                        console.log('Nenhum registro encontrado');
                    }
                callback(null,results);
                
            }
        });
    }
    updateRow(tableName, id, values, callback) {
        this.getTableColumns(tableName, (err, columnNames) => {
          if (err) {
            console.error('Erro ao obter os nomes das colunas:', err);
            callback(err);
          } else {
            // Construir a cláusula SET com base nas colunas e valores fornecidos
            const setClause = columnNames
              .map((columnName) => `${columnName} = ?`)
              .join(', ');
      
            const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
      
          // Adicione o ID ao final do array de valores
            values.push(id);
      
            // Execute a consulta SQL para atualização
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
    //deletar
    deleteRow(tableName, id, callback) {
        const sql = `DELETE FROM ${tableName} WHERE id = '${id}'`;
      
        this.connection.query(sql, (err, results) => {
          if (err) {
            console.error('Erro ao remover registro', err);
            callback(err);
          } else {
            console.log('Registro removido com sucesso!');
            callback(null, results);
          }
        });
      }
}

//preencha com seu login e senha do SGBD
const loginBD = {
  user:'root',
  password:'Youngmull4!'
}



const connection = new Connection('localhost',loginBD.user,loginBD.password,'crm_es');

module.exports = connection