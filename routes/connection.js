var { DateTime } = require('luxon');

/**
 * @module db
 */

/**
 * Cria a conexão com o banco de dados MySQL
 * @returns {mysql.connection} Dados da conexão com o banco de dados MySQL.
 */
async function connect() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }

  const mysql = required("mysql2/promise");

  const connection = await mysql.createConnection();
  console.log("Conectou no MySQL");
  global.connection = connection;
  return connection;

}

 /**
 * Cria registro da url informada no parâmetro no banco de dados.
 * @param {string} urlFull - String representando a url completa.
 * @param {string} urlShort - String representando a url encurtada.
 * @returns {Promise<any>} JSON contendo informações sobre a operação no banco de dados
 */
async function insertURL(urlFull, urlShort) {
  if (urlFull !== "" && urlShort !== ""){
      const date = DateTime.now().toJSON();
      const conn = await connect();
      const sql = "INSERT INTO URLS(url_address, url_shortened, create_time) VALUES (?, ?, ?);";
      const values = [urlFull, urlShort, date];
      return await conn.query(sql, values);
  } else {
      return {"message": "Os valores urlFull e urlShort não podem ser vazios."}
  }
};

/**
 * Faz a consulta das urls no banco de dados.
 * Caso não haja parâmetros, retornará todas as urls no banco de dados.
 * Caso passe-se o parâmetro byid, será retornará apenas a url com respectivo id.
 * Caso passe-se o parâmetro bydate, serão retornadas todas as urls criadas na data.
 * Caso passe-se o parâmetro byishortener, retornará apenas a url com respectivo valor url_shortened.
 * @param {int} byid - Inteiro que representa o id do registro no banco de dados.
 * @param {string} bydate - String representando uma data no formado yyyy-mm-dd.
 * @param {string} byshortener - String com tamanho contendo eletras maiúsculas, letras minúsculas e números.
 * @returns {Promise<any>} JSON contendo informações sobre a operação no banco de dados
 */
 async function selectURLs(byid, bydate, byshortener) {
  const conn = await connect();
  var [rows] = [];
  if (byid) {
      [rows] = await conn.query("SELECT * FROM URLS WHERE id=?;", [byid]);
  } else if (bydate) {
      [rows] = await conn.query("SELECT * FROM URLS WHERE create_time LIKE ?;", [`${bydate}%`]);
  } else if (byshortener) {
      [rows] = await conn.query("SELECT * FROM URLS WHERE shortened_url=?;", [byshortener]);
  } else {
      [rows] = await conn.query("SELECT * FROM URLS;");
  }
  return rows;
};