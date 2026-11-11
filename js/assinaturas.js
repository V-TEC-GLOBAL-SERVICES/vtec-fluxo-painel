(function () {
  'use strict';
  var VTec = window.VTec, conta = VTec.Dados.conta, assinatura = conta.assinatura;
  var ESTADOS_ASSINATURA = { ativa: ['Ativa', 'sucesso'], encerrada: ['Encerrada', 'neutro'], pendente: ['Pendente', 'aviso'], cancelada: ['Cancelada', 'perigo'] };
  var ESTADOS_PAGAMENTO = { pago: ['Pago', 'sucesso'], pendente: ['Pendente', 'aviso'], falhado: ['Falhado', 'perigo'] };
  var corpoPagamentos = document.getElementById('corpo-historico-pagamentos');
  var tabelaPagamentos = document.getElementById('tabela-pagamentos');
  var areaVazia = document.getElementById('vazio-pagamentos');
  var separadores = document.getElementById('separadores-pagamentos');
  var filtroAtual = 'todos';

  function desenharResumo() {
    var estado = ESTADOS_ASSINATURA[assinatura.estado];
    var diasRestantes = Math.ceil((new Date(assinatura.validade) - Date.now()) / 86400000);
    var totalPago = conta.pagamentos.filter(function (p) { return p.estado === 'pago'; }).reduce(function (soma, p) { return soma + p.valor; }, 0);
    var cartoes = [
      ['assinaturas', VTec.escapar(assinatura.plano), 'Plano atual', VTec.selo(estado[0], estado[1])],
      ['dashboard', VTec.dataCurta(assinatura.validade), 'Válida até', diasRestantes > 0 ? 'Faltam ' + diasRestantes + (diasRestantes === 1 ? ' dia' : ' dias') : 'Validade ultrapassada'],
      ['pedidos', VTec.moeda(assinatura.valor), 'Valor mensal', assinatura.renovacaoAutomatica ? 'Renovação automática' : 'Renovação manual'],
      ['catalogo', VTec.moeda(totalPago), 'Total pago', 'Soma dos pagamentos concluídos']
    ];
    document.getElementById('indicadores-assinatura').innerHTML = cartoes.map(function (c) {
      return '<div class="indicador"><span class="indicador__icone">' + VTec.icone(c[0]) + '</span><span class="indicador__valor" style="font-size:' + (c[0] === 'assinaturas' ? '20' : '24') + 'px">' + c[1] + '</span><span class="indicador__rotulo">' + c[2] + '</span><span class="indicador__descricao">' + c[3] + '</span></div>';
    }).join('');
  }

  function desenharHistoricoAssinaturas() {
    document.getElementById('corpo-historico-assinaturas').innerHTML = conta.historicoAssinaturas.map(function (a) {
      var e = ESTADOS_ASSINATURA[a.estado];
      return '<tr><td class="numero" data-rotulo="Referência">' + a.id + '</td><td data-rotulo="Plano">' + VTec.escapar(a.plano) + '</td>' +
        '<td data-rotulo="Período">' + VTec.dataCurta(a.inicio) + ' – ' + VTec.dataCurta(a.fim) + '</td><td data-rotulo="Valor mensal">' + VTec.moeda(a.valor) + '</td><td data-rotulo="Estado">' + VTec.selo(e[0], e[1]) + '</td></tr>';
    }).join('');
  }

  function desenharPagamentos() {
    var lista = conta.pagamentos.filter(function (p) { return filtroAtual === 'todos' || p.estado === filtroAtual; });
    tabelaPagamentos.hidden = !lista.length;
    areaVazia.hidden = !!lista.length;
    areaVazia.innerHTML = VTec.estadoVazio('assinaturas', 'Nenhum pagamento neste filtro', 'Os pagamentos com este estado aparecem aqui.');
    corpoPagamentos.innerHTML = lista.map(function (p) {
      var e = ESTADOS_PAGAMENTO[p.estado];
      return '<tr><td class="numero" data-rotulo="Referência">' + p.id + '</td><td data-rotulo="Data">' + VTec.dataCurta(p.data) + '</td><td data-rotulo="Plano">' + VTec.escapar(p.plano) + '</td><td data-rotulo="Valor"><strong>' + VTec.moeda(p.valor) + '</strong></td><td data-rotulo="Estado">' + VTec.selo(e[0], e[1]) + '</td></tr>';
    }).join('');
  }

  separadores.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-filtro]');
    if (!botao) return;
    filtroAtual = botao.dataset.filtro;
    separadores.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === botao)); });
    desenharPagamentos();
  });
  VTec.carregar(function () { desenharResumo(); desenharHistoricoAssinaturas(); desenharPagamentos(); });
})();
