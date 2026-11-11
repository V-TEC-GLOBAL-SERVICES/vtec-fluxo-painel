(function () {
  'use strict';
  var VTec = window.VTec, passagens = VTec.Dados.passagens, esc = VTec.escapar;
  var lista = document.getElementById('lista-passagens');
  var separadores = document.getElementById('separadores-passagens');
  var filtroAtual = 'todas';

  function desenhar() {
    var pendentes = passagens.filter(function (p) { return p.estado === 'pendente'; }).length;
    separadores.querySelector('[data-filtro="pendente"]').textContent = 'Pendentes (' + pendentes + ')';
    var visiveis = passagens.filter(function (p) { return filtroAtual === 'todas' || p.estado === (filtroAtual === 'pendente' ? 'pendente' : 'respondido'); })
      .sort(function (a, b) { return (a.estado === b.estado ? 0 : a.estado === 'pendente' ? -1 : 1) || new Date(b.data) - new Date(a.data); });
    if (!visiveis.length) {
      lista.innerHTML = '<div class="cartao estado-vazio">' + VTec.estadoVazio('passagens', filtroAtual === 'pendente' ? 'Sem passagens pendentes' : 'Sem passagens', 'Quando o assistente transferir um atendimento, ele aparece aqui.') + '</div>';
      return;
    }
    lista.innerHTML = visiveis.map(function (p) {
      var pendente = p.estado === 'pendente';
      return '<article class="passagem' + (pendente ? ' passagem--pendente' : '') + '"><div class="passagem__topo"><h2 class="passagem__motivo">' + esc(p.motivo) + '</h2>' +
        VTec.selo(pendente ? 'Pendente' : 'Respondido', pendente ? 'aviso' : 'sucesso') + '</div>' +
        '<p class="passagem__mensagem">' + esc(p.mensagem) + '</p>' +
        '<div class="passagem__rodape"><span>' + esc(p.cliente) + ' · ' + VTec.dataHora(p.data) + '</span>' +
        '<button type="button" class="botao ' + (pendente ? 'botao--primario' : 'botao--secundario') + ' botao--pequeno" data-passagem="' + esc(p.id) + '">' + (pendente ? 'Ver e responder' : 'Ver detalhes') + '</button></div></article>';
    }).join('');
  }

  function abrirDetalhes(passagem) {
    var pendente = passagem.estado === 'pendente';
    VTec.abrirModal({
      titulo: passagem.motivo,
      corpo: '<dl class="lista-detalhes"><dt>Cliente</dt><dd>' + esc(passagem.cliente) + '</dd><dt>Recebida</dt><dd>' + VTec.dataHora(passagem.data) + '</dd></dl>' +
        '<p class="cartao__texto" style="margin:16px 0 6px">Mensagem do cliente</p><p class="citacao">' + esc(passagem.mensagem) + '</p>' +
        (pendente
          ? '<div class="campo" style="margin-top:16px"><label for="campo-resposta">A sua resposta</label><textarea id="campo-resposta" placeholder="Escreva a resposta para o cliente"></textarea><span class="campo__erro" hidden>Escreva uma resposta antes de concluir.</span></div>' +
            '<p class="nota" style="margin-top:12px">O envio pelo WhatsApp será ativado com a integração do backend. Por agora, a resposta fica registada nesta página.</p>'
          : '<p class="cartao__texto" style="margin:16px 0 6px">Resposta enviada</p><p class="citacao">' + esc(passagem.resposta) + '</p>'),
      rotuloConfirmar: pendente ? 'Responder e concluir' : null,
      aoConfirmar: function (form) {
        var campo = form.querySelector('#campo-resposta');
        if (!campo.value.trim()) { form.querySelector('.campo__erro').hidden = false; campo.closest('.campo').setAttribute('data-invalido', ''); campo.focus(); return false; }
        passagem.resposta = campo.value.trim();
        passagem.estado = 'respondido';
        desenhar();
        VTec.avisar('Atendimento ' + passagem.id + ' concluído.');
      }
    });
  }

  separadores.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-filtro]');
    if (!botao) return;
    filtroAtual = botao.dataset.filtro;
    separadores.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === botao)); });
    desenhar();
  });
  lista.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-passagem]');
    if (botao) abrirDetalhes(passagens.filter(function (p) { return p.id === botao.dataset.passagem; })[0]);
  });
  VTec.carregar(desenhar);
})();
