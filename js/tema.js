/* Aplica o tema guardado antes de a página ser desenhada, para evitar o "piscar". */
(function () {
  'use strict';
  var temaGuardado = null;
  try { temaGuardado = localStorage.getItem('vtec-tema'); } catch (erro) { /* armazenamento indisponível */ }
  var tema = temaGuardado || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
  document.documentElement.dataset.tema = tema;
  window.VTecTema = {
    atual: function () { return document.documentElement.dataset.tema; },
    definir: function (novoTema) {
      document.documentElement.dataset.tema = novoTema;
      try { localStorage.setItem('vtec-tema', novoTema); } catch (erro) { /* ignorar */ }
    }
  };
})();
