(function () {
  'use strict';
  var VTec = window.VTec, conta = VTec.Dados.conta, assinatura = conta.assinatura, esc = VTec.escapar;
  var ESTADOS_ASSINATURA = { ativa: ['Ativa', 'sucesso'], pendente: ['Pendente', 'aviso'], cancelada: ['Cancelada', 'perigo'] };
  var ESTADOS_PAGAMENTO = { pago: ['Pago', 'sucesso'], pendente: ['Pendente', 'aviso'], falhado: ['Falhado', 'perigo'] };

  function desenharInformacoes() {
    var campos = [['responsavel', 'Nome do responsável', 'text'], ['email', 'E-mail da conta', 'email'], ['empresa', 'Nome da empresa', 'text'], ['ramoAtividade', 'Ramo de atividade', 'text'], ['telefone', 'Telefone da empresa', 'tel'], ['endereco', 'Endereço', 'text']];
    document.getElementById('campos-conta').innerHTML = campos.map(function (c) {
      return '<div class="campo' + (c[0] === 'endereco' ? ' campo--larga' : '') + '"><label for="campo-' + c[0] + '">' + c[1] + '</label><input id="campo-' + c[0] + '" type="' + c[2] + '" value="' + esc(conta[c[0]]) + '"><span class="campo__erro" hidden></span></div>';
    }).join('');
  }

  function desenharAssinatura() {
    var estado = ESTADOS_ASSINATURA[assinatura.estado];
    document.getElementById('resumo-assinatura').innerHTML =
      '<div class="cartao__cabecalho"><div><p class="cartao__titulo">' + esc(assinatura.plano) + '</p><p class="cartao__texto" style="margin:0">' + VTec.moeda(assinatura.valor) + ' por mês (valor de exemplo)</p></div>' + VTec.selo(estado[0], estado[1]) + '</div>' +
      '<dl class="lista-detalhes" style="margin-top:16px"><dt>Início</dt><dd>' + VTec.dataCurta(assinatura.inicio) + '</dd><dt>Válida até</dt><dd>' + VTec.dataCurta(assinatura.validade) + '</dd>' +
      '<dt>Renovação</dt><dd>' + (assinatura.renovacaoAutomatica ? 'Automática, na data de validade' : 'Manual — termina na data de validade') + '</dd></dl>';
    document.getElementById('botao-renovacao').textContent = assinatura.renovacaoAutomatica ? 'Desativar renovação automática' : 'Ativar renovação automática';
    document.getElementById('corpo-pagamentos').innerHTML = conta.pagamentos.map(function (p) {
      var e = ESTADOS_PAGAMENTO[p.estado];
      return '<tr><td class="numero" data-rotulo="Referência">' + p.id + '</td><td data-rotulo="Data">' + VTec.dataCurta(p.data) + '</td><td data-rotulo="Valor">' + VTec.moeda(p.valor) + '</td><td data-rotulo="Estado">' + VTec.selo(e[0], e[1]) + '</td></tr>';
    }).join('');
  }

  document.getElementById('formulario-conta').addEventListener('submit', function (evento) {
    evento.preventDefault();
    var campos = ['responsavel', 'email', 'empresa'], valido = true;
    campos.forEach(function (nome) {
      var campo = document.getElementById('campo-' + nome), erro = campo.parentElement.querySelector('.campo__erro');
      var mensagem = !campo.value.trim() ? 'Este campo é obrigatório.' : (nome === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim()) ? 'Introduza um e-mail válido.' : '');
      erro.textContent = mensagem; erro.hidden = !mensagem; campo.parentElement.toggleAttribute('data-invalido', !!mensagem);
      if (mensagem) valido = false;
    });
    if (!valido) return VTec.avisar('Corrija os campos assinalados.', 'erro');
    ['responsavel', 'email', 'empresa', 'ramoAtividade', 'telefone', 'endereco'].forEach(function (nome) { conta[nome] = document.getElementById('campo-' + nome).value.trim(); });
    var iniciais = document.getElementById('iniciais-utilizador');
    if (iniciais) iniciais.textContent = VTec.iniciais(conta.responsavel);
    VTec.avisar('Informações da conta guardadas.');
  });

  document.getElementById('botao-renovacao').addEventListener('click', function () {
    assinatura.renovacaoAutomatica = !assinatura.renovacaoAutomatica;
    desenharAssinatura();
    VTec.avisar(assinatura.renovacaoAutomatica ? 'Renovação automática ativada.' : 'Renovação automática desativada.');
  });
  document.getElementById('botao-alterar-plano').addEventListener('click', function () {
    VTec.abrirModal({ titulo: 'Alterar plano', corpo: '<p>A mudança de plano e a cobrança serão feitas através do serviço de pagamentos, que será ligado na fase de backend.</p><p class="nota" style="margin-top:14px">Ainda não existem planos nem preços reais definidos nesta interface.</p>' });
  });

  VTec.carregar(function () { desenharInformacoes(); desenharAssinatura(); });
})();
