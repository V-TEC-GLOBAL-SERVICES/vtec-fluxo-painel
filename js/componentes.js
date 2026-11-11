/* Componentes partilhados: estrutura da página, ícones, modais, avisos e formatação. */
(function () {
  'use strict';
  var Dados = window.DadosDemonstrativos;
  var CHAVE_SESSAO = 'vtec-sessao';

  var CAMINHOS_ICONES = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    pedidos: '<path d="M6 2 4 6v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6l-2-4z"/><path d="M4 6h16M9 10a3 3 0 0 0 6 0"/>',
    passagens: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 11h6M9 14h3"/>',
    catalogo: '<path d="m21 8-9-5-9 5v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    assinaturas: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    conta: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    lua: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    olho: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    olhoFechado: '<path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 7.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.3-1"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    editar: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
    lixo: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    sair: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10"/>',
    caixaVazia: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>'
  };

  var ESTADOS_PEDIDO = {
    pendente: { rotulo: 'Pendente', tipo: 'aviso' },
    preparacao: { rotulo: 'Em preparação', tipo: 'info' },
    pronto: { rotulo: 'Pronto', tipo: 'info' },
    concluido: { rotulo: 'Concluído', tipo: 'sucesso' },
    cancelado: { rotulo: 'Cancelado', tipo: 'perigo' }
  };
  var ESTADOS_EM_ABERTO = ['pendente', 'preparacao', 'pronto'];

  var formatoNumero = new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  var formatoDataHora = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  var formatoData = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  var formatoRelativo = new Intl.RelativeTimeFormat('pt-PT', { numeric: 'auto' });

  function icone(nome) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + CAMINHOS_ICONES[nome] + '</svg>';
  }
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function moeda(valor) { return formatoNumero.format(valor) + '\u00A0Kz'; }
  function dataHora(iso) { return formatoDataHora.format(new Date(iso)); }
  function dataCurta(iso) { return formatoData.format(new Date(iso)); }
  function tempoRelativo(iso) {
    var minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (minutos < 60) return formatoRelativo.format(-Math.max(minutos, 1), 'minute');
    if (minutos < 1440) return formatoRelativo.format(-Math.round(minutos / 60), 'hour');
    return formatoRelativo.format(-Math.round(minutos / 1440), 'day');
  }
  function selo(texto, tipo) { return '<span class="selo selo--' + tipo + '">' + escapar(texto) + '</span>'; }
  function seloPedido(estado) { return selo(ESTADOS_PEDIDO[estado].rotulo, ESTADOS_PEDIDO[estado].tipo); }
  function totalPedido(pedido) { return pedido.itens.reduce(function (soma, linha) { return soma + linha.quantidade * linha.precoUnitario; }, 0); }
  function iniciais(nome) { return nome.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join(''); }
  function contarPassagensPendentes() { return Dados.passagens.filter(function (p) { return p.estado === 'pendente'; }).length; }

  function estadoVazio(nomeIcone, titulo, texto) {
    return icone(nomeIcone) + '<h2>' + escapar(titulo) + '</h2><p>' + escapar(texto) + '</p>';
  }

  function avisar(mensagem, tipo) {
    var area = document.getElementById('area-avisos');
    if (!area) {
      area = document.createElement('div');
      area.id = 'area-avisos';
      area.setAttribute('aria-live', 'polite');
      document.body.appendChild(area);
    }
    var aviso = document.createElement('div');
    aviso.className = 'aviso' + (tipo === 'erro' ? ' aviso--erro' : '');
    aviso.textContent = mensagem;
    area.appendChild(aviso);
    setTimeout(function () { aviso.remove(); }, 3800);
  }

  /* Janela modal baseada em <dialog>: foco e tecla Esc geridos pelo navegador. */
  function abrirModal(opcoes) {
    var janela = document.createElement('dialog');
    janela.className = 'modal';
    janela.setAttribute('aria-labelledby', 'titulo-modal');
    janela.innerHTML =
      '<form class="modal__formulario" novalidate>' +
        '<header class="modal__cabecalho"><h2 id="titulo-modal">' + escapar(opcoes.titulo) + '</h2>' +
        '<button type="button" class="botao-icone" data-fechar aria-label="Fechar janela">' + icone('fechar') + '</button></header>' +
        '<div class="modal__corpo">' + opcoes.corpo + '</div>' +
        '<footer class="modal__rodape"><button type="button" class="botao botao--secundario" data-fechar>' + (opcoes.rotuloConfirmar ? 'Cancelar' : 'Fechar') + '</button>' +
        (opcoes.rotuloConfirmar ? '<button type="submit" class="botao ' + (opcoes.perigo ? 'botao--perigo' : 'botao--primario') + '">' + escapar(opcoes.rotuloConfirmar) + '</button>' : '') +
        '</footer></form>';
    document.body.appendChild(janela);
    var formulario = janela.querySelector('form');
    janela.querySelectorAll('[data-fechar]').forEach(function (botao) { botao.addEventListener('click', function () { janela.close(); }); });
    janela.addEventListener('click', function (evento) { if (evento.target === janela) janela.close(); });
    janela.addEventListener('close', function () { janela.remove(); });
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      if (opcoes.aoConfirmar && opcoes.aoConfirmar(formulario) === false) return;
      janela.close();
    });
    janela.showModal();
    if (opcoes.aoAbrir) opcoes.aoAbrir(formulario);
    return janela;
  }

  /* Mostra um esqueleto de carregamento e depois desenha o conteúdo. Na integração, aguardar a resposta do backend aqui. */
  function carregar(desenharConteudo, duracao) {
    var principal = document.getElementById('conteudo-principal');
    var esqueleto = document.createElement('div');
    esqueleto.className = 'esqueleto';
    esqueleto.innerHTML = '<span></span><span></span><span></span>';
    principal.classList.add('a-carregar');
    principal.setAttribute('aria-busy', 'true');
    principal.appendChild(esqueleto);
    setTimeout(function () {
      esqueleto.remove();
      principal.classList.remove('a-carregar');
      principal.removeAttribute('aria-busy');
      desenharConteudo();
    }, duracao || 450);
  }

  function terminarSessao() {
    try { sessionStorage.removeItem(CHAVE_SESSAO); } catch (erro) { /* ignorar */ }
    location.href = 'index.html';
  }

  function criarBotaoTema(botao) {
    function atualizar() {
      var escuro = window.VTecTema.atual() === 'escuro';
      botao.innerHTML = icone(escuro ? 'sol' : 'lua');
      botao.setAttribute('aria-label', escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
    }
    botao.addEventListener('click', function () { window.VTecTema.definir(window.VTecTema.atual() === 'escuro' ? 'claro' : 'escuro'); atualizar(); });
    atualizar();
  }

  var NAVEGACAO = [
    { id: 'dashboard', rotulo: 'Dashboard', href: 'dashboard.html' },
    { id: 'pedidos', rotulo: 'Pedidos', href: 'pedidos.html' },
    { id: 'passagens', rotulo: 'Passagens', href: 'passagens.html' },
    { id: 'catalogo', rotulo: 'Catálogo', href: 'catalogo.html' },
    { id: 'assinaturas', rotulo: 'Assinaturas', href: 'assinaturas.html' },
    { id: 'conta', rotulo: 'Conta', href: 'conta.html' }
  ];
  var MARCA_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="currentColor"/><path d="M9 11l7 11 7-11" fill="none" stroke="var(--sobre-destaque)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function montarEstrutura() {
    var sessaoAtiva = false;
    try { sessaoAtiva = sessionStorage.getItem(CHAVE_SESSAO) === 'ativa'; } catch (erro) { /* ignorar */ }
    if (!sessaoAtiva) { location.replace('index.html'); return; }

    var paginaAtual = document.body.dataset.pagina;
    var principal = document.getElementById('conteudo-principal');
    var pendentes = contarPassagensPendentes();
    var conta = Dados.conta;

    var ligacoes = NAVEGACAO.map(function (entrada) {
      return '<a class="navegacao__ligacao" href="' + entrada.href + '"' + (entrada.id === paginaAtual ? ' aria-current="page"' : '') + '>' +
        icone(entrada.id) + '<span>' + entrada.rotulo + '</span>' +
        (entrada.id === 'passagens' && pendentes ? '<span class="navegacao__contador" aria-label="' + pendentes + ' pendentes">' + pendentes + '</span>' : '') + '</a>';
    }).join('');

    var aplicacao = document.createElement('div');
    aplicacao.className = 'aplicacao';
    aplicacao.innerHTML =
      '<a class="saltar-conteudo" href="#conteudo-principal">Saltar para o conteúdo</a>' +
      '<aside class="barra-lateral" id="barra-lateral"><a class="marca" href="dashboard.html">' + MARCA_SVG + '<span class="marca__nome">V-TEC <span>Fluxo</span></span></a>' +
      '<nav class="navegacao" aria-label="Navegação principal">' + ligacoes + '</nav>' +
      '<div class="barra-lateral__rodape"><button type="button" class="navegacao__ligacao" id="botao-terminar-sessao">' + icone('sair') + '<span>Terminar sessão</span></button></div></aside>' +
      '<div class="pelicula" id="pelicula-menu"></div>' +
      '<div class="area-principal"><header class="barra-topo">' +
      '<button type="button" class="botao-icone botao-menu" id="botao-menu" aria-label="Abrir menu" aria-controls="barra-lateral" aria-expanded="false">' + icone('menu') + '</button>' +
      '<h1>' + escapar(document.body.dataset.titulo) + '</h1><span class="etiqueta-demonstracao">Dados de exemplo</span>' +
      '<button type="button" class="botao-icone" id="botao-tema"></button>' +
      '<a class="utilizador" href="conta.html" aria-label="Abrir a minha conta"><span class="utilizador__iniciais" id="iniciais-utilizador">' + escapar(iniciais(conta.responsavel)) + '</span>' +
      '<span class="utilizador__texto">' + escapar(conta.empresa) + '<small>' + escapar(conta.responsavel) + '</small></span></a></header></div>';

    principal.before(aplicacao);
    aplicacao.querySelector('.area-principal').appendChild(principal);
    document.body.prepend(aplicacao);

    var barraLateral = document.getElementById('barra-lateral');
    var botaoMenu = document.getElementById('botao-menu');
    var ecraPequeno = window.matchMedia('(max-width: 900px)');
    function definirMenu(aberto) {
      aplicacao.classList.toggle('aplicacao--menu-aberto', aberto);
      botaoMenu.setAttribute('aria-expanded', String(aberto));
      botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      botaoMenu.innerHTML = icone(aberto ? 'fechar' : 'menu');
      barraLateral.inert = ecraPequeno.matches && !aberto;
    }
    botaoMenu.addEventListener('click', function () { definirMenu(!aplicacao.classList.contains('aplicacao--menu-aberto')); });
    document.getElementById('pelicula-menu').addEventListener('click', function () { definirMenu(false); });
    barraLateral.querySelector('.navegacao').addEventListener('click', function (evento) { if (evento.target.closest('a')) definirMenu(false); });
    document.addEventListener('click', function (evento) {
      var menuAberto = aplicacao.classList.contains('aplicacao--menu-aberto');
      var caminho = evento.composedPath(); // o ícone do botão é substituído ao alternar, por isso não se usa evento.target
      if (menuAberto && caminho.indexOf(barraLateral) < 0 && caminho.indexOf(botaoMenu) < 0) definirMenu(false);
    });
    document.addEventListener('keydown', function (evento) { if (evento.key === 'Escape') definirMenu(false); });
    ecraPequeno.addEventListener('change', function () { definirMenu(false); });
    definirMenu(false);

    criarBotaoTema(document.getElementById('botao-tema'));
    document.getElementById('botao-terminar-sessao').addEventListener('click', terminarSessao);
  }

  window.VTec = {
    CHAVE_SESSAO: CHAVE_SESSAO, Dados: Dados, ESTADOS_PEDIDO: ESTADOS_PEDIDO, ESTADOS_EM_ABERTO: ESTADOS_EM_ABERTO,
    icone: icone, escapar: escapar, moeda: moeda, dataHora: dataHora, dataCurta: dataCurta, tempoRelativo: tempoRelativo,
    selo: selo, seloPedido: seloPedido, totalPedido: totalPedido, iniciais: iniciais, estadoVazio: estadoVazio,
    avisar: avisar, abrirModal: abrirModal, carregar: carregar, criarBotaoTema: criarBotaoTema
  };
  if (document.body.dataset.pagina) montarEstrutura();
})();
