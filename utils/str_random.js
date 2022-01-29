    /**
     * @module str_random
     */

    /**
     * Função que retorna uma string contendo letras maiúsculas, minúsculas e números.
     * Código obtido no endereço: https://attacomsian.com/blog/javascript-generate-random-string
     * @param {int} length - Tamanho (inteiro) da string desejada.
     * @returns {string} String de tamanho length composta por letras maiúsculas, letras minúsculas e números.
     */
     function StrRandom(length) {
      let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let str = '';
      for (let i = 0; i < length; i++) {
          str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return str;
  };

  module.exports = {StrRandom}  