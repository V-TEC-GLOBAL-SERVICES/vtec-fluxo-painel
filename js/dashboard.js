(function () {
  'use strict';
  var VTec = window.VTec, Dados = VTec.Dados;

  function desenharIndicadores() {
    var emAberto = Dados.pedidos.filter(function (p) { return VTec.ESTADOS_EM_ABERTO.indexOf(p.estado) >= 0; }).length;
    var concluidos = Dados.pedidos.filter(function (p) { return p.estado === 'concluido'; }).length;
    var passagensPendentes = Dados.passagens.filter(function (p) { return p.estado === 'pendente'; }).length;
    var indicadores = [
      { href: 'pedidos.html', icone: 'pedidos', valor: Dados.pedidos.length, rotulo: 'Total de pedidos', descricao: 'Recebidos pelo WhatsApp' },
      { href: 'pedidos.html?estado=abertos', icone: 'pedidos', valor: emAberto, rotulo: 'Pedidos pendentes', descricao: 'Ainda por concluir' },
      { href: 'pedidos.html?estado=concluido', icone: 'pedidos', valor: concluidos, rotulo: 'Pedidos concluídos', descricao: 'Entregues ou levantados' },
      { href: 'passagens.html', icone: 'passagens', valor: passagensPendentes, rotulo: 'Passagens pendentes', descricao: passagensPendentes ? 'Clientes à espera de resposta' : 'Tudo respondido', atencao: passagensPendentes > 0 }
    ];
    document.getElementById('indicadores').innerHTML = indicadores.map(function (i) {
      return '<a class="indicador' + (i.atencao ? ' indicador--atencao' : '') + '" href="' + i.href + '"><span class="indicador__icone">' + VTec.icone(i.icone) + '</span>' +
        '<span class="indicador__valor">' + i.valor + '</span><span class="indicador__rotulo">' + i.rotulo + '</span><span class="indicador__descricao">' + i.descricao + '</span></a>';
    }).join('');
  }

  function desenharAtividade() {
    var eventos = [];
    Dados.pedidos.forEach(function (p) {
      eventos.push({ data: p.data, tipo: 'pedidos', texto: 'Pedido ' + p.id + ' de ' + p.cliente + ' — ' + VTec.moeda(VTec.totalPedido(p)), estado: VTec.seloPedido(p.estado) });
    });
    Dados.passagens.forEach(function (p) {
      eventos.push({ data: p.data, tipo: 'passagens', texto: p.cliente + ' pediu atendimento humano: ' + p.motivo.toLowerCase(), estado: VTec.selo(p.estado === 'pendente' ? 'Pendente' : 'Respondido', p.estado === 'pendente' ? 'aviso' : 'sucesso') });
    });
    eventos.sort(function (a, b) { return new Date(b.data) - new Date(a.data); });
    var lista = document.getElementById('lista-atividade');
    if (!eventos.length) { lista.innerHTML = '<li class="estado-vazio">' + VTec.estadoVazio('caixaVazia', 'Ainda sem atividade', 'Os novos pedidos e passagens vão aparecer aqui.') + '</li>'; return; }
    lista.innerHTML = eventos.slice(0, 8).map(function (e) {
      return '<li class="atividade__item"><span class="atividade__icone' + (e.tipo === 'passagens' ? ' atividade__icone--passagem' : '') + '">' + VTec.icone(e.tipo) + '</span>' +
        '<div style="flex:1"><p>' + VTec.escapar(e.texto) + '</p><small>' + VTec.tempoRelativo(e.data) + '</small></div>' + e.estado + '</li>';
    }).join('');
  }

  VTec.carregar(function () { desenharIndicadores(); desenharAtividade(); });
})();
