/* Validação com expressões regulares, partilhada por Login e Criar Conta. Sem dependências. */
(function (global) {
  'use strict';
  var REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  var REGEX_CARACTERES_TELEFONE = /^\+?[\d\s().-]+$/;           // dígitos, espaços, parênteses, hífen, ponto e "+" inicial
  var REGEX_TELEFONE_NORMALIZADO = /^(\+[1-9]\d{7,14}|\d{8,15})$/; // com indicativo (E.164) ou número local
  var REGEX_NOME_COMPLETO = /^\p{L}[\p{L}'.-]*(\s+\p{L}[\p{L}'.-]*)+$/u;
  var COMPRIMENTO_MINIMO_SENHA = 8;

  function resultado(valido, mensagem, valorNormalizado, tipo) {
    return { valido: valido, mensagem: valido ? '' : mensagem, valorNormalizado: valorNormalizado, tipo: tipo };
  }

  function normalizarTelefone(texto) {
    var limpo = String(texto).trim().replace(/[\s().-]/g, '');
    return limpo.indexOf('00') === 0 ? '+' + limpo.slice(2) : limpo;
  }

  function validarEmail(texto) {
    var email = String(texto).trim();
    return REGEX_EMAIL.test(email)
      ? resultado(true, '', email.toLowerCase(), 'email')
      : resultado(false, 'Introduza um e-mail válido, por exemplo nome@empresa.com.', email, 'email');
  }

  function validarTelefone(texto) {
    var original = String(texto).trim();
    if (!REGEX_CARACTERES_TELEFONE.test(original) && original.indexOf('00') !== 0)
      return resultado(false, 'O telefone só pode ter números, espaços, parênteses, hífen e o sinal + do indicativo.', original, 'telefone');
    var normalizado = normalizarTelefone(original);
    return REGEX_TELEFONE_NORMALIZADO.test(normalizado)
      ? resultado(true, '', normalizado, 'telefone')
      : resultado(false, 'O telefone deve ter entre 8 e 15 dígitos. Se for internacional, comece pelo indicativo, por exemplo +244 900 000 000.', normalizado, 'telefone');
  }

  /* Aceita e-mail ou telefone: se tiver "@" trata como e-mail, caso contrário como telefone. */
  function validarIdentificador(texto) {
    var valor = String(texto).trim();
    if (!valor) return resultado(false, 'Introduza o seu e-mail ou número de telefone.', '', null);
    return valor.indexOf('@') >= 0 ? validarEmail(valor) : validarTelefone(valor);
  }

  function validarNomeCompleto(texto) {
    var nome = String(texto).trim().replace(/\s+/g, ' ');
    return REGEX_NOME_COMPLETO.test(nome) ? resultado(true, '', nome) : resultado(false, 'Indique o nome e o apelido, apenas com letras.', nome);
  }

  function validarNomeEmpresa(texto) {
    var nome = String(texto).trim().replace(/\s+/g, ' ');
    return nome.length >= 2 ? resultado(true, '', nome) : resultado(false, 'Indique o nome da empresa ou negócio.', nome);
  }

  function validarSenha(senha) {
    return senha.length >= COMPRIMENTO_MINIMO_SENHA ? resultado(true, '', senha) : resultado(false, 'A palavra-passe deve ter pelo menos ' + COMPRIMENTO_MINIMO_SENHA + ' caracteres.', senha);
  }

  function validarConfirmacaoSenha(senha, confirmacao) {
    if (!confirmacao) return resultado(false, 'Confirme a palavra-passe.', confirmacao);
    return senha === confirmacao ? resultado(true, '', confirmacao) : resultado(false, 'As palavras-passe não coincidem.', confirmacao);
  }

  global.VTecValidacao = {
    normalizarTelefone: normalizarTelefone, validarEmail: validarEmail, validarTelefone: validarTelefone, validarIdentificador: validarIdentificador,
    validarNomeCompleto: validarNomeCompleto, validarNomeEmpresa: validarNomeEmpresa, validarSenha: validarSenha, validarConfirmacaoSenha: validarConfirmacaoSenha
  };
})(typeof window !== 'undefined' ? window : globalThis);
