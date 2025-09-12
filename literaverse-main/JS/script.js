// Script: tema, busca e formulários
document.addEventListener('DOMContentLoaded', () => {
  const botaoTema = document.getElementById('alternarTema');
  const body = document.body;

  function aplicarTema(tema) {
    if (tema === 'claro') {
      body.classList.remove('tema-escuro');
      body.classList.add('tema-claro');
    } else {
      body.classList.remove('tema-claro');
      body.classList.add('tema-escuro');
    }
    try { localStorage.setItem('tema', tema); } catch (e) { /* ignore */ }
  }

  function inicializarTema() {
    const temaSalvo = localStorage.getItem('tema');
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const temaInicial = temaSalvo || (prefereEscuro ? 'escuro' : 'claro');
    aplicarTema(temaInicial);
  }

  if (botaoTema) {
    inicializarTema();
    botaoTema.addEventListener('click', () => {
      const atual = body.classList.contains('tema-claro') ? 'claro' : 'escuro';
      aplicarTema(atual === 'claro' ? 'escuro' : 'claro');
    });
  }

  // Busca responsiva
  const campoBusca = document.querySelector('.campo-busca');
  if (campoBusca) {
    campoBusca.addEventListener('focus', () => { if (window.innerWidth < 768) campoBusca.style.width = '180px'; });
    campoBusca.addEventListener('blur', () => { if (window.innerWidth < 768) campoBusca.style.width = ''; });
  }

  // Formulário de cadastro
  const formCadastro = document.getElementById('formulario-cadastro');
  if (formCadastro) {
    function validarSenha(valor) {
      const erros = [];
      if (!valor || valor.length < 8) {
        erros.push('Mínimo de 8 caracteres.');
      }
      if (!/[A-Z]/.test(valor)) erros.push('Inclua pelo menos uma letra maiúscula.');
      if (!/[a-z]/.test(valor)) erros.push('Inclua pelo menos uma letra minúscula.');
      if (!/\d/.test(valor)) erros.push('Inclua pelo menos um número.');
      if (!/[!@#\$%\^&\*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(valor)) erros.push('Inclua pelo menos um caractere especial.');

      // Não permitir caracteres repetidos 3 ou mais vezes seguidos (ex: aaa ou 111)
      if (/(.)\1\1/.test(valor)) erros.push('Não use o mesmo caractere repetido 3 vezes seguidas.');

      // Não permitir sequências ascendentes/descendentes alfanuméricas de comprimento >=3
      function temSequencia(s) {
        const seqLen = 3;
        for (let i = 0; i <= s.length - seqLen; i++) {
          const slice = s.slice(i, i + seqLen);
          // verificar apenas se todos são letras ou todos são dígitos
          if (/^[0-9]+$/.test(slice) || /^[a-zA-Z]+$/.test(slice)) {
            const codes = slice.split('').map(ch => ch.charCodeAt(0));
            let asc = true, desc = true;
            for (let j = 1; j < codes.length; j++) {
              if (codes[j] !== codes[j - 1] + 1) asc = false;
              if (codes[j] !== codes[j - 1] - 1) desc = false;
            }
            if (asc || desc) return true;
          }
        }
        return false;
      }

      if (temSequencia(valor)) erros.push('Evite sequências (ex: 123 ou abc) de 3 ou mais caracteres.');

      return erros;
    }

    formCadastro.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const senha = document.getElementById('senha');
      const confirmar = document.getElementById('confirmar-senha');
      const termos = document.getElementById('termos');

      let valido = true;
      formCadastro.querySelectorAll('.mensagem-erro').forEach(el => el.textContent = '');

      if (!nome || !nome.value.trim()) { document.getElementById('erro-nome').textContent = 'Informe seu nome.'; valido = false; }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { document.getElementById('erro-email').textContent = 'Email inválido.'; valido = false; }

      // Validar senha com regras reforçadas
      const errosSenha = validarSenha(senha ? senha.value : '');
      if (errosSenha.length) {
        document.getElementById('erro-senha').textContent = errosSenha.join(' ');
        valido = false;
      }

      if (senha && confirmar && senha.value !== confirmar.value) { document.getElementById('erro-confirmar-senha').textContent = 'As senhas não coincidem.'; valido = false; }
      if (!termos || !termos.checked) { document.getElementById('erro-formulario').textContent = 'Aceite os termos para continuar.'; valido = false; }

      if (!valido) return;

      // Simulação de envio
      const botao = document.getElementById('botao-enviar');
      if (botao) { botao.disabled = true; botao.textContent = 'Enviando...'; }
      setTimeout(() => { alert('Cadastro enviado (simulação)'); formCadastro.reset(); if (botao) { botao.disabled = false; botao.textContent = 'Criar conta'; } }, 800);
    });
  }
});