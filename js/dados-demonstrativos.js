/* DADOS DEMONSTRATIVOS — exemplos fictícios. Substituir por chamadas ao backend na integração. */
(function () {
  'use strict';
  var agora = Date.now(), hora = 3600000, dia = 24 * hora;
  function antes(milissegundos) { return new Date(agora - milissegundos).toISOString(); }
  function item(produtoId, nome, quantidade, precoUnitario) { return { produtoId: produtoId, nome: nome, quantidade: quantidade, precoUnitario: precoUnitario }; }

  window.DadosDemonstrativos = {
    conta: {
      responsavel: 'Responsável de Exemplo',
      email: 'demo@vtecfluxo.exemplo',
      empresa: 'Empresa de Exemplo, Lda.',
      ramoAtividade: 'Comércio a retalho',
      telefone: '+244 900 000 000',
      endereco: 'Endereço de exemplo, Luanda',
      assinatura: {
        plano: 'Plano demonstrativo', estado: 'ativa', valor: 25000, periodicidade: 'mensal',
        inicio: antes(108 * dia), validade: new Date(agora + 12 * dia).toISOString(), renovacaoAutomatica: true
      },
      historicoAssinaturas: [
        { id: 'ASS-002', plano: 'Plano demonstrativo', inicio: antes(108 * dia), fim: new Date(agora + 12 * dia).toISOString(), valor: 25000, estado: 'ativa' },
        { id: 'ASS-001', plano: 'Plano inicial (exemplo)', inicio: antes(200 * dia), fim: antes(110 * dia), valor: 18000, estado: 'encerrada' }
      ],
      pagamentos: [
        { id: 'PAG-0008', data: antes(18 * dia), plano: 'Plano demonstrativo', valor: 25000, estado: 'pago' },
        { id: 'PAG-0007', data: antes(48 * dia), plano: 'Plano demonstrativo', valor: 25000, estado: 'pago' },
        { id: 'PAG-0006', data: antes(78 * dia), plano: 'Plano demonstrativo', valor: 25000, estado: 'pago' },
        { id: 'PAG-0005', data: antes(107 * dia), plano: 'Plano demonstrativo', valor: 25000, estado: 'pago' },
        { id: 'PAG-0004', data: antes(108 * dia), plano: 'Plano demonstrativo', valor: 25000, estado: 'falhado' },
        { id: 'PAG-0003', data: antes(138 * dia), plano: 'Plano inicial (exemplo)', valor: 18000, estado: 'pago' },
        { id: 'PAG-0002', data: antes(168 * dia), plano: 'Plano inicial (exemplo)', valor: 18000, estado: 'pago' },
        { id: 'PAG-0001', data: antes(198 * dia), plano: 'Plano inicial (exemplo)', valor: 18000, estado: 'pago' }
      ]
    },
    produtos: [
      { id: 'PRD-001', nome: 'Camiseta básica de algodão', preco: 6500, stock: 24, disponivel: true, foto: null },
      { id: 'PRD-002', nome: 'Sapatilhas urbanas', preco: 28900, stock: 6, disponivel: true, foto: null },
      { id: 'PRD-003', nome: 'Mochila impermeável', preco: 15400, stock: 0, disponivel: true, foto: null },
      { id: 'PRD-004', nome: 'Garrafa térmica 500 ml', preco: 7800, stock: 15, disponivel: true, foto: null },
      { id: 'PRD-005', nome: 'Auscultadores sem fios', preco: 19900, stock: 9, disponivel: false, foto: null },
      { id: 'PRD-006', nome: 'Boné ajustável', preco: 4200, stock: 31, disponivel: true, foto: null }
    ],
    pedidos: [
      { id: 'PED-1048', cliente: 'Ana Martins', itens: [item('PRD-002', 'Sapatilhas urbanas', 1, 28900)], pagamento: 'Transferência bancária', entrega: 'entrega', estado: 'pendente', data: antes(25 * 60000) },
      { id: 'PED-1047', cliente: 'Carlos Pinto', itens: [item('PRD-001', 'Camiseta básica de algodão', 2, 6500), item('PRD-006', 'Boné ajustável', 1, 4200)], pagamento: 'Dinheiro na entrega', entrega: 'entrega', estado: 'preparacao', data: antes(3 * hora) },
      { id: 'PED-1046', cliente: 'Beatriz Sousa', itens: [item('PRD-004', 'Garrafa térmica 500 ml', 1, 7800)], pagamento: 'Pagamento por referência', entrega: 'levantamento', estado: 'pronto', data: antes(7 * hora) },
      { id: 'PED-1045', cliente: 'Domingos Neto', itens: [item('PRD-001', 'Camiseta básica de algodão', 3, 6500)], pagamento: 'Dinheiro na entrega', entrega: 'levantamento', estado: 'concluido', data: antes(1 * dia + 2 * hora) },
      { id: 'PED-1044', cliente: 'Elisa Fernandes', itens: [item('PRD-002', 'Sapatilhas urbanas', 1, 28900), item('PRD-004', 'Garrafa térmica 500 ml', 2, 7800)], pagamento: 'Transferência bancária', entrega: 'entrega', estado: 'concluido', data: antes(2 * dia) },
      { id: 'PED-1043', cliente: 'Fábio Gomes', itens: [item('PRD-006', 'Boné ajustável', 2, 4200)], pagamento: 'Dinheiro na entrega', entrega: 'entrega', estado: 'cancelado', data: antes(3 * dia) },
      { id: 'PED-1042', cliente: 'Graça Lopes', itens: [item('PRD-001', 'Camiseta básica de algodão', 1, 6500)], pagamento: 'Pagamento por referência', entrega: 'levantamento', estado: 'concluido', data: antes(4 * dia) }
    ],
    passagens: [
      { id: 'PAS-205', cliente: 'Hélder Costa', motivo: 'Pedido de desconto', mensagem: 'Olá, vou comprar 10 camisetas para a minha equipa. Conseguem fazer um preço especial?', data: antes(40 * 60000), estado: 'pendente', resposta: null },
      { id: 'PAS-204', cliente: 'Ana Martins', motivo: 'Dúvida sobre entrega', mensagem: 'Preciso do pedido ainda hoje e moro fora do centro. É possível combinar a entrega?', data: antes(2 * hora), estado: 'pendente', resposta: null },
      { id: 'PAS-203', cliente: 'Inês Barros', motivo: 'Produto não listado', mensagem: 'Vocês têm sapatilhas número 46? Não vi no catálogo.', data: antes(9 * hora), estado: 'pendente', resposta: null },
      { id: 'PAS-202', cliente: 'Júlio Tavares', motivo: 'Pedido de troca', mensagem: 'A mochila que comprei veio com o fecho avariado. Quero trocar por outra.', data: antes(1 * dia + 3 * hora), estado: 'respondido', resposta: 'Pedimos desculpa. Pode trazer a mochila à loja e fazemos a troca de imediato.' },
      { id: 'PAS-201', cliente: 'Carlos Pinto', motivo: 'Reclamação', mensagem: 'O meu pedido anterior chegou com atraso e ninguém me avisou.', data: antes(3 * dia), estado: 'respondido', resposta: 'Lamentamos o atraso. Vamos avisar sempre que houver alterações no prazo.' }
    ]
  };
})();
