/* Página Criar Conta: apenas interface e validação. O registo real depende do backend. */
(function () {
  'use strict';
  var VTec = window.VTec, Validacao = window.VTecValidacao;
  var formulario = document.getElementById('formulario-cadastro');
  var alerta = document.getElementById('alerta-cadastro');
  var aviso = document.getElementById('aviso-cadastro');

  var campos = {
    nome: { entrada: document.getElementById('campo-nome-completo'), validar: function () { return Validacao.validarNomeCompleto(campos.nome.entrada.value); } },
    empresa: { entrada: document.getElementById('campo-nome-empresa'), validar: function () { return Validacao.validarNomeEmpresa(campos.empresa.entrada.value); } },
    identificador: { entrada: document.getElementById('campo-identificador'), validar: function () { return Validacao.validarIdentificador(campos.identificador.entrada.value); } },
    senha: { entrada: document.getElementById('campo-nova-senha'), validar: function () { return Validacao.validarSenha(campos.senha.entrada.value); } },
    confirmacao: { entrada: document.getElementById('campo-confirmar-senha'), validar: function () { return Validacao.validarConfirmacaoSenha(campos.senha.entrada.value, campos.confirmacao.entrada.value); } }
  };

  function mostrarResultado(campo, resultado) {
    var contentor = campo.entrada.closest('.campo'), erro = contentor.querySelector('.campo__erro');
    erro.textContent = resultado.mensagem;
    erro.hidden = resultado.valido;
    contentor.toggleAttribute('data-invalido', !resultado.valido);
    contentor.toggleAttribute('data-valido', resultado.valido);
    campo.entrada.setAttribute('aria-invalid', String(!resultado.valido));
  }
  function validarCampo(campo) { var r = campo.validar(); mostrarResultado(campo, r); return r; }

  Object.keys(campos).forEach(function (nome) {
    var campo = campos[nome];
    campo.entrada.addEventListener('blur', function () { if (campo.entrada.value || campo.entrada.closest('.campo').hasAttribute('data-invalido')) validarCampo(campo); });
    campo.entrada.addEventListener('input', function () {
      aviso.hidden = true;
      if (campo.entrada.closest('.campo').hasAttribute('data-invalido') || campo.entrada.closest('.campo').hasAttribute('data-valido')) validarCampo(campo);
      if (nome === 'senha' && campos.confirmacao.entrada.value) validarCampo(campos.confirmacao);
    });
  });

  /* Pedido de cadastro pronto a enviar ao backend; o envio real será ligado numa fase futura. */
  function prepararPedidoCadastro(resultados) {
    return { nomeCompleto: resultados.nome.valorNormalizado, empresa: resultados.empresa.valorNormalizado, tipoIdentificador: resultados.identificador.tipo, identificador: resultados.identificador.valorNormalizado, senha: campos.senha.entrada.value };
  }

  document.querySelectorAll('[data-alternar-senha]').forEach(function (botao) {
    var entrada = document.getElementById(botao.dataset.alternarSenha);
    botao.innerHTML = VTec.icone('olho');
    botao.addEventListener('click', function () {
      var visivel = entrada.type === 'text';
      entrada.type = visivel ? 'password' : 'text';
      botao.innerHTML = VTec.icone(visivel ? 'olho' : 'olhoFechado');
      botao.setAttribute('aria-label', (visivel ? 'Mostrar ' : 'Ocultar ') + entrada.dataset.rotulo);
    });
  });
  VTec.criarBotaoTema(document.getElementById('botao-tema'));

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    aviso.hidden = true;
    var resultados = {}, primeiroInvalido = null;
    Object.keys(campos).forEach(function (nome) {
      resultados[nome] = validarCampo(campos[nome]);
      if (!resultados[nome].valido && !primeiroInvalido) primeiroInvalido = campos[nome].entrada;
    });
    if (primeiroInvalido) {
      alerta.hidden = false;
      alerta.classList.remove('agitar'); void alerta.offsetWidth; alerta.classList.add('agitar');
      primeiroInvalido.focus();
      return;
    }
    alerta.hidden = true;
    var pedido = prepararPedidoCadastro(resultados); // eslint-disable-line no-unused-vars
    aviso.hidden = false;
  });
})();
