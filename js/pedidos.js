(function () {
  'use strict';
  var VTec = window.VTec, pedidos = VTec.Dados.pedidos, esc = VTec.escapar;
  var corpoTabela = document.getElementById('corpo-tabela-pedidos');
  var tabela = document.getElementById('tabela-pedidos');
  var areaVazia = document.getElementById('vazio-pedidos');
  var campoPesquisa = document.getElementById('pesquisa-pedidos');
  var filtroEstado = document.getElementById('filtro-estado-pedidos');
  var ROTULO_ENTREGA = { entrega: 'Entrega ao domicílio', levantamento: 'Levantamento na loja' };

  function resumirProdutos(pedido) {
    var primeiro = pedido.itens[0];
    var resto = pedido.itens.length - 1;
    return esc(primeiro.quantidade + '× ' + primeiro.nome) + (resto ? '<small>+ ' + resto + (resto > 1 ? ' produtos' : ' produto') + '</small>' : '');
  }

  function desenhar() {
    var termo = campoPesquisa.value.trim().toLowerCase(), estado = filtroEstado.value;
    var lista = pedidos.filter(function (p) {
      var estadoCorresponde = estado === 'todos' || (estado === 'abertos' ? VTec.ESTADOS_EM_ABERTO.indexOf(p.estado) >= 0 : p.estado === estado);
      return estadoCorresponde && (!termo || (p.id + ' ' + p.cliente).toLowerCase().indexOf(termo) >= 0);
    }).sort(function (a, b) { return new Date(b.data) - new Date(a.data); });

    tabela.hidden = !lista.length;
    areaVazia.hidden = !!lista.length;
    areaVazia.innerHTML = VTec.estadoVazio('pedidos', 'Nenhum pedido encontrado', 'Experimente alterar a pesquisa ou o filtro de estado.');
    corpoTabela.innerHTML = lista.map(function (p) {
      return '<tr><td class="numero" data-rotulo="Pedido">' + esc(p.id) + '</td><td data-rotulo="Cliente">' + esc(p.cliente) + '</td>' +
        '<td data-rotulo="Produtos">' + resumirProdutos(p) + '</td><td data-rotulo="Total"><strong>' + VTec.moeda(VTec.totalPedido(p)) + '</strong></td>' +
        '<td data-rotulo="Pagamento">' + esc(p.pagamento) + '</td><td data-rotulo="Entrega">' + ROTULO_ENTREGA[p.entrega] + '</td>' +
        '<td data-rotulo="Estado">' + VTec.seloPedido(p.estado) + '</td><td data-rotulo="Data">' + VTec.dataHora(p.data) + '</td>' +
        '<td><button type="button" class="botao botao--secundario botao--pequeno" data-pedido="' + esc(p.id) + '">Ver detalhes</button></td></tr>';
    }).join('');
  }

  function abrirDetalhes(pedido) {
    var opcoes = Object.keys(VTec.ESTADOS_PEDIDO).map(function (chave) {
      return '<option value="' + chave + '"' + (chave === pedido.estado ? ' selected' : '') + '>' + VTec.ESTADOS_PEDIDO[chave].rotulo + '</option>';
    }).join('');
    VTec.abrirModal({
      titulo: 'Pedido ' + pedido.id,
      corpo: '<dl class="lista-detalhes"><dt>Cliente</dt><dd>' + esc(pedido.cliente) + '</dd><dt>Data</dt><dd>' + VTec.dataHora(pedido.data) + '</dd>' +
        '<dt>Pagamento</dt><dd>' + esc(pedido.pagamento) + '</dd><dt>Modalidade</dt><dd>' + ROTULO_ENTREGA[pedido.entrega] + '</dd></dl>' +
        '<ul class="lista-itens">' + pedido.itens.map(function (l) { return '<li><span>' + l.quantidade + '× ' + esc(l.nome) + '</span><span>' + VTec.moeda(l.quantidade * l.precoUnitario) + '</span></li>'; }).join('') +
        '<li><strong>Total</strong><strong>' + VTec.moeda(VTec.totalPedido(pedido)) + '</strong></li></ul>' +
        '<div class="campo"><label for="campo-estado-pedido">Estado do pedido</label><select id="campo-estado-pedido">' + opcoes + '</select></div>',
      rotuloConfirmar: 'Atualizar estado',
      aoConfirmar: function (form) {
        pedido.estado = form.querySelector('#campo-estado-pedido').value;
        desenhar();
        VTec.avisar('Estado do pedido ' + pedido.id + ' atualizado.');
      }
    });
  }

  corpoTabela.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-pedido]');
    if (!botao) return;
    abrirDetalhes(pedidos.filter(function (p) { return p.id === botao.dataset.pedido; })[0]);
  });
  campoPesquisa.addEventListener('input', desenhar);
  filtroEstado.addEventListener('change', desenhar);

  var estadoInicial = new URLSearchParams(location.search).get('estado');
  if (estadoInicial && filtroEstado.querySelector('option[value="' + estadoInicial + '"]')) filtroEstado.value = estadoInicial;
  VTec.carregar(desenhar);
})();
