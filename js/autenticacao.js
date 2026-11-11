/* Página de autenticação. `autenticarUtilizador` é o único ponto a substituir pela chamada real ao backend. */
(function () {
  'use strict';
  var VTec = window.VTec;
  var CREDENCIAIS_DEMONSTRATIVAS = { email: 'demo@vtecfluxo.exemplo', senha: 'demonstracao123' };

  function autenticarUtilizador(email, senha) {
    return new Promise(function (resolver) {
      setTimeout(function () {
        resolver(email.toLowerCase() === CREDENCIAIS_DEMONSTRATIVAS.email && senha === CREDENCIAIS_DEMONSTRATIVAS.senha);
      }, 700);
    });
  }

  var formulario = document.getElementById('formulario-autenticacao');
  var campoEmail = document.getElementById('campo-email');
  var campoSenha = document.getElementById('campo-senha');
  var alerta = document.getElementById('alerta-autenticacao');
  var botaoEntrar = document.getElementById('botao-entrar');
  var botaoVerSenha = document.getElementById('botao-ver-senha');

  function mostrarErro(mensagem) {
    alerta.textContent = mensagem;
    alerta.hidden = false;
    alerta.classList.remove('agitar');
    void alerta.offsetWidth;
    alerta.classList.add('agitar');
  }
  function marcarInvalido(campo, invalido) {
    campo.closest('.campo').toggleAttribute('data-invalido', invalido);
    campo.setAttribute('aria-invalid', String(invalido));
  }

  botaoVerSenha.innerHTML = VTec.icone('olho');
  botaoVerSenha.addEventListener('click', function () {
    var visivel = campoSenha.type === 'text';
    campoSenha.type = visivel ? 'password' : 'text';
    botaoVerSenha.innerHTML = VTec.icone(visivel ? 'olho' : 'olhoFechado');
    botaoVerSenha.setAttribute('aria-label', visivel ? 'Mostrar palavra-passe' : 'Ocultar palavra-passe');
  });
  VTec.criarBotaoTema(document.getElementById('botao-tema'));

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    alerta.hidden = true;
    var identificador = window.VTecValidacao.validarIdentificador(campoEmail.value);
    marcarInvalido(campoEmail, !identificador.valido);
    marcarInvalido(campoSenha, !campoSenha.value);
    if (!identificador.valido) return mostrarErro(identificador.mensagem);
    if (!campoSenha.value) return mostrarErro('Introduza a sua palavra-passe.');

    botaoEntrar.disabled = true;
    botaoEntrar.innerHTML = '<span class="rotacao"></span> A entrar…';
    autenticarUtilizador(identificador.valorNormalizado, campoSenha.value).then(function (autenticado) {
      if (autenticado) {
        try { sessionStorage.setItem(VTec.CHAVE_SESSAO, 'ativa'); } catch (erro) { /* ignorar */ }
        location.href = 'dashboard.html';
        return;
      }
      botaoEntrar.disabled = false;
      botaoEntrar.textContent = 'Iniciar sessão';
      marcarInvalido(campoEmail, true);
      marcarInvalido(campoSenha, true);
      mostrarErro('E-mail ou palavra-passe incorretos. Verifique os dados e tente novamente.');
    });
  });

  document.getElementById('botao-recuperar-senha').addEventListener('click', function () {
    VTec.abrirModal({
      titulo: 'Recuperar palavra-passe',
      corpo: '<p class="cartao__texto">Indique o e-mail da conta. Quando o backend estiver ligado, enviaremos aqui uma ligação para definir uma nova palavra-passe.</p>' +
        '<div class="campo"><label for="campo-email-recuperacao">E-mail da conta</label><input type="email" id="campo-email-recuperacao" autocomplete="email" required></div>' +
        '<p class="nota" style="margin-top:14px">O envio de e-mails ainda não está ligado nesta versão da interface.</p>',
      rotuloConfirmar: 'Pedir ligação',
      aoConfirmar: function (form) {
        var campo = form.querySelector('#campo-email-recuperacao');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim())) { campo.focus(); VTec.avisar('Introduza um e-mail válido.', 'erro'); return false; }
        VTec.avisar('Pedido registado na interface. O envio depende do backend.');
      }
    });
  });
})();
