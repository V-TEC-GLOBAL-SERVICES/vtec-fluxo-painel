(function () {
  'use strict';
  var VTec = window.VTec, produtos = VTec.Dados.produtos, esc = VTec.escapar;
  var grelha = document.getElementById('grelha-produtos');
  var campoPesquisa = document.getElementById('pesquisa-produtos');
  var separadores = document.getElementById('separadores-produtos');
  var filtroAtual = 'todos';

  function estaDisponivel(produto) { return produto.disponivel && produto.stock > 0; }

  function desenhar() {
    var termo = campoPesquisa.value.trim().toLowerCase();
    var lista = produtos.filter(function (p) {
      var filtroOk = filtroAtual === 'todos' || (filtroAtual === 'disponiveis') === estaDisponivel(p);
      return filtroOk && (!termo || p.nome.toLowerCase().indexOf(termo) >= 0);
    });
    if (!lista.length) {
      grelha.innerHTML = '<div class="cartao estado-vazio" style="grid-column:1/-1">' + VTec.estadoVazio('catalogo', produtos.length ? 'Nenhum produto encontrado' : 'O catálogo está vazio', produtos.length ? 'Experimente outra pesquisa ou filtro.' : 'Adicione o primeiro produto para os clientes o poderem pedir.') + '</div>';
      return;
    }
    grelha.innerHTML = lista.map(function (p) {
      var disponivel = estaDisponivel(p);
      return '<article class="produto' + (disponivel ? '' : ' produto--esgotado') + '">' +
        (p.foto ? '<img class="produto__imagem" src="' + esc(p.foto) + '" alt="Fotografia de ' + esc(p.nome) + '">' : '<div class="produto__sem-foto" aria-hidden="true">' + esc(VTec.iniciais(p.nome)) + '</div>') +
        '<div class="produto__corpo"><div class="passagem__topo"><h2 class="produto__nome">' + esc(p.nome) + '</h2>' + VTec.selo(disponivel ? 'Disponível' : 'Esgotado', disponivel ? 'sucesso' : 'perigo') + '</div>' +
        '<p class="produto__preco">' + VTec.moeda(p.preco) + '</p><p class="produto__stock">' + p.stock + (p.stock === 1 ? ' unidade' : ' unidades') + ' em stock</p>' +
        '<div class="produto__acoes"><button type="button" class="botao botao--secundario botao--pequeno" data-editar="' + p.id + '">' + VTec.icone('editar') + 'Editar</button>' +
        '<button type="button" class="botao botao--secundario botao--pequeno" data-remover="' + p.id + '" aria-label="Remover ' + esc(p.nome) + '">' + VTec.icone('lixo') + 'Remover</button></div></div></article>';
    }).join('');
  }

  function formularioProduto(p) {
    p = p || { nome: '', preco: '', stock: '', disponivel: true, foto: null };
    return '<div class="grelha-campos">' +
      '<div class="campo campo--larga"><label for="campo-nome-produto">Nome do produto</label><input id="campo-nome-produto" value="' + esc(p.nome) + '" maxlength="80"><span class="campo__erro" hidden></span></div>' +
      '<div class="campo"><label for="campo-preco-produto">Preço (Kz)</label><input id="campo-preco-produto" type="number" min="0" step="50" inputmode="decimal" value="' + p.preco + '"><span class="campo__erro" hidden></span></div>' +
      '<div class="campo"><label for="campo-stock-produto">Stock</label><input id="campo-stock-produto" type="number" min="0" step="1" inputmode="numeric" value="' + p.stock + '"><span class="campo__erro" hidden></span></div>' +
      '<div class="campo campo--larga campo--linha"><input id="campo-disponivel-produto" type="checkbox"' + (p.disponivel ? ' checked' : '') + '><label for="campo-disponivel-produto">Disponível para venda</label></div>' +
      '<div class="campo campo--larga"><label for="campo-foto-produto">Fotografia</label><input id="campo-foto-produto" type="file" accept="image/*">' +
      '<img class="pre-visualizacao-foto" id="pre-visualizacao-foto" alt="Pré-visualização da fotografia"' + (p.foto ? ' src="' + esc(p.foto) + '"' : ' hidden') + '>' +
      '<span class="campo__ajuda">Nesta versão a fotografia fica apenas no navegador; o envio para o servidor vem com o backend.</span></div></div>';
  }

  function ligarPreVisualizacao(form) {
    var entrada = form.querySelector('#campo-foto-produto'), imagem = form.querySelector('#pre-visualizacao-foto');
    entrada.addEventListener('change', function () {
      if (!entrada.files[0]) return;
      imagem.src = URL.createObjectURL(entrada.files[0]);
      imagem.hidden = false;
    });
  }

  function validar(form) {
    var regras = [
      ['#campo-nome-produto', function (v) { return v.trim() ? '' : 'Indique o nome do produto.'; }],
      ['#campo-preco-produto', function (v) { return v !== '' && Number(v) >= 0 ? '' : 'Indique um preço igual ou superior a 0.'; }],
      ['#campo-stock-produto', function (v) { return /^\d+$/.test(v) ? '' : 'Indique o stock com um número inteiro (0 ou mais).'; }]
    ], valido = true;
    regras.forEach(function (regra) {
      var campo = form.querySelector(regra[0]), erro = campo.parentElement.querySelector('.campo__erro'), mensagem = regra[1](campo.value);
      erro.textContent = mensagem; erro.hidden = !mensagem;
      campo.parentElement.toggleAttribute('data-invalido', !!mensagem);
      if (mensagem && valido) campo.focus();
      if (mensagem) valido = false;
    });
    return valido;
  }

  function guardar(form, produto) {
    if (!validar(form)) return false;
    var novo = !produto;
    if (novo) {
      var seguinte = produtos.reduce(function (maior, p) { return Math.max(maior, parseInt(p.id.slice(4), 10)); }, 0) + 1;
      produto = { id: 'PRD-' + String(seguinte).padStart(3, '0'), foto: null };
      produtos.unshift(produto);
    }
    produto.nome = form.querySelector('#campo-nome-produto').value.trim();
    produto.preco = Number(form.querySelector('#campo-preco-produto').value);
    produto.stock = parseInt(form.querySelector('#campo-stock-produto').value, 10);
    produto.disponivel = form.querySelector('#campo-disponivel-produto').checked;
    var imagem = form.querySelector('#pre-visualizacao-foto');
    if (!imagem.hidden && imagem.src) produto.foto = imagem.src;
    desenhar();
    VTec.avisar(novo ? 'Produto adicionado ao catálogo.' : 'Produto atualizado.');
  }

  function procurar(id) { return produtos.filter(function (p) { return p.id === id; })[0]; }

  document.getElementById('botao-adicionar-produto').addEventListener('click', function () {
    VTec.abrirModal({ titulo: 'Adicionar produto', corpo: formularioProduto(), rotuloConfirmar: 'Adicionar produto', aoAbrir: ligarPreVisualizacao, aoConfirmar: function (form) { return guardar(form, null); } });
  });
  grelha.addEventListener('click', function (evento) {
    var editar = evento.target.closest('[data-editar]'), remover = evento.target.closest('[data-remover]');
    if (editar) {
      var produto = procurar(editar.dataset.editar);
      VTec.abrirModal({ titulo: 'Editar produto', corpo: formularioProduto(produto), rotuloConfirmar: 'Guardar alterações', aoAbrir: ligarPreVisualizacao, aoConfirmar: function (form) { return guardar(form, produto); } });
    }
    if (remover) {
      var alvo = procurar(remover.dataset.remover);
      VTec.abrirModal({
        titulo: 'Remover produto', perigo: true, rotuloConfirmar: 'Remover produto',
        corpo: '<p>Vai remover <strong>' + esc(alvo.nome) + '</strong> do catálogo. Esta ação não pode ser desfeita.</p>',
        aoConfirmar: function () { produtos.splice(produtos.indexOf(alvo), 1); desenhar(); VTec.avisar('Produto removido do catálogo.'); }
      });
    }
  });
  campoPesquisa.addEventListener('input', desenhar);
  separadores.addEventListener('click', function (evento) {
    var botao = evento.target.closest('[data-filtro]');
    if (!botao) return;
    filtroAtual = botao.dataset.filtro;
    separadores.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === botao)); });
    desenhar();
  });
  VTec.carregar(desenhar);
})();
