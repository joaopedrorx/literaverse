document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario-cadastro');
    if (!formulario) {
        return;
    }

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        limparErros();
        const formValido = validarFormulario();
        
        if (formValido) {
            alert('Cadastro realizado com sucesso! Bem-vindo ao Literaverse! 🌟');
            formulario.reset();
            limparErros();
        }
    });
    
    function validarFormulario() {
        let valido = true;
        
        // 1. Validar nome
        const nome = document.getElementById('nome');
        if (nome.value.trim() === '') {
            mostrarErro(nome, 'Por favor, insira seu nome completo.');
            valido = false;
        }
        
        // 2. Validar email
        const email = document.getElementById('email');
        if (!validarEmail(email.value)) {
            mostrarErro(email, 'Por favor, insira um e-mail válido.');
            valido = false;
        }
        
        // 3. Validar usuário
        const usuario = document.getElementById('usuario');
        if (usuario.value.trim() === '') {
            mostrarErro(usuario, 'Por favor, escolha um nome de usuário.');
            valido = false;
        }
        
        // 4. Validar senha (LÓGICA ATUALIZADA)
        const senha = document.getElementById('senha');
        if (!validarForcaSenha(senha.value)) {
            mostrarErro(senha, 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um símbolo especial (!@#$%).');
            valido = false;
        }
        
        // 5. Validar confirmação de senha
        const confirmarSenha = document.getElementById('confirmar-senha');
        if (confirmarSenha.value !== senha.value) {
            mostrarErro(confirmarSenha, 'As senhas não coincidem.');
            valido = false;
        }
        
        // 6. Validar termos
        const termos = document.querySelector('input[name="termos"]');
        if (!termos.checked) {
            mostrarErro(termos.parentElement, 'Você deve aceitar os termos para se cadastrar.');
            valido = false;
        }
        
        return valido;
    }
    
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // NOVA FUNÇÃO PARA VALIDAR A SENHA
    function validarForcaSenha(senha) {
        // Critério 1: Mínimo de 8 caracteres
        if (senha.length < 8) {
            return false;
        }

        // Critério 2: Pelo menos uma letra maiúscula
        const temMaiuscula = /[A-Z]/.test(senha);

        // Critério 3: Pelo menos um número
        const temNumero = /\d/.test(senha); // \d é um atalho para [0-9]

        // Critério 4: Pelo menos um símbolo especial
        const temSimbolo = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(senha);

        // Retorna true somente se todos os critérios forem atendidos
        return temMaiuscula && temNumero && temSimbolo;
    }
    
    function mostrarErro(campo, mensagem) {
        const divErro = document.createElement('div');
        divErro.className = 'erro';
        divErro.textContent = mensagem;
        campo.parentNode.insertBefore(divErro, campo.nextSibling);
        campo.style.borderColor = '#ff6b6b';
    }
    
    function limparErros() {
        const erros = document.querySelectorAll('.erro');
        erros.forEach(erro => erro.remove());
        const inputs = formulario.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Validação robusta do formulário de cadastro
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    const fullName = document.getElementById('fullName');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const birthdate = document.getElementById('birthdate');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    const submitBtn = document.getElementById('submitBtn');

    const err = id => document.getElementById('err-' + id);

    const commonPasswords = new Set(['123456','password','123456789','qwerty','111111','12345678','abc123','password1']);

    function validateEmailFormat(v) {
        // regex robusta, não perfeita mas prática
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    }

    function hasSequence(s, minLen = 4) {
        const seqLimit = minLen;
        const norm = s.toLowerCase();
        for (let i=0;i<=norm.length - seqLimit;i++) {
            let inc = true, dec = true;
            for (let j=1;j<seqLimit;j++){
                if (norm.charCodeAt(i+j) !== norm.charCodeAt(i+j-1) + 1) inc = false;
                if (norm.charCodeAt(i+j) !== norm.charCodeAt(i+j-1) - 1) dec = false;
            }
            if (inc || dec) return true;
        }
        return false;
    }

    function repeatedCharRun(s, limit = 4) {
        let run = 1;
        for (let i=1;i<s.length;i++){
            if (s[i] === s[i-1]) {
                run++;
                if (run >= limit) return true;
            } else run = 1;
        }
        return false;
    }

    function passwordStrength(p) {
        const checks = [];
        if (p.length < 12) checks.push('Mínimo 12 caracteres');
        if (!/[a-z]/.test(p)) checks.push('Pelo menos 1 letra minúscula');
        if (!/[A-Z]/.test(p)) checks.push('Pelo menos 1 letra maiúscula');
        if (!/[0-9]/.test(p)) checks.push('Pelo menos 1 número');
        if (!/[^A-Za-z0-9]/.test(p)) checks.push('Pelo menos 1 caractere especial');
        if (/\s/.test(p)) checks.push('Sem espaços em branco');
        if (commonPasswords.has(p.toLowerCase())) checks.push('Senha muito comum');
        if (hasSequence(p,4)) checks.push('Evite sequências como "abcd" ou "1234"');
        if (repeatedCharRun(p,4)) checks.push('Evite caracteres repetidos em sequência');
        return checks;
    }

    function calculateAge(dob) {
        if (!dob) return 0;
        const b = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - b.getFullYear();
        const m = today.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
        return age;
    }

    function setError(elId, message) {
        const e = err(elId);
        if (e) e.textContent = message || '';
    }

    function clearAllErrors() {
        ['fullName','username','email','birthdate','password','confirmPassword','terms'].forEach(id => setError(id,''));
        const formErr = document.getElementById('form-error');
        if (formErr) formErr.textContent = '';
    }

    // Real-time: password strength indicator
    const strengthEl = document.getElementById('password-strength');
    password.addEventListener('input', () => {
        const p = password.value || '';
        const issues = passwordStrength(p);
        if (!p) {
            strengthEl.textContent = '';
            strengthEl.className = 'mt-2 text-sm';
            setError('password','');
            return;
        }
        if (issues.length === 0) {
            strengthEl.textContent = 'Senha forte';
            strengthEl.className = 'mt-2 text-sm text-green-400';
            setError('password','');
        } else {
            strengthEl.textContent = 'Problemas: ' + issues.join('; ');
            strengthEl.className = 'mt-2 text-sm text-yellow-400';
            setError('password','');
        }
    });

    // username/email light checks
    username.addEventListener('input', () => {
        const v = username.value.trim();
        if (v && !/^[a-zA-Z0-9._-]{3,24}$/.test(v)) {
            setError('username','Nome de usuário inválido. Use 3–24 caracteres válidos (letras, números, . _ -).');
        } else setError('username','');
    });

    email.addEventListener('blur', () => {
        const v = email.value.trim();
        if (v && !validateEmailFormat(v)) setError('email','Formato de email inválido.');
        else setError('email','');
    });

    birthdate.addEventListener('blur', () => {
        const age = calculateAge(birthdate.value);
        if (age < 13) setError('birthdate','É necessário ter 13 anos ou mais.');
        else setError('birthdate','');
    });

    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.value !== password.value) setError('confirmPassword','As senhas não correspondem.');
        else setError('confirmPassword','');
    });

    // submit handler
    form.addEventListener('submit', (e) => {
        clearAllErrors();
        let hasError = false;

        // full name
        if (!fullName.value.trim() || fullName.value.trim().length < 2) {
            setError('fullName','Informe seu nome completo.');
            hasError = true;
        }

        // username
        const u = username.value.trim();
        if (!u || !/^[a-zA-Z0-9._-]{3,24}$/.test(u)) {
            setError('username','Nome de usuário inválido.');
            hasError = true;
        }

        // email
        const em = email.value.trim();
        if (!em || !validateEmailFormat(em)) {
            setError('email','Email inválido.');
            hasError = true;
        }

        // birthdate / age >=13
        const age = calculateAge(birthdate.value);
        if (!birthdate.value || age < 13) {
            setError('birthdate','É necessário ter 13 anos ou mais.');
            hasError = true;
        }

        // password checks
        const p = password.value || '';
        const pIssues = passwordStrength(p);
        const localPart = (em.split('@')[0] || '').toLowerCase();
        if (!p || pIssues.length > 0) {
            setError('password','Senha não atende aos requisitos: ' + (pIssues[0] || 'verifique.'));
            hasError = true;
        } else if (p.toLowerCase().includes(u.toLowerCase()) || (localPart && p.toLowerCase().includes(localPart))) {
            setError('password','Senha não pode conter o usuário ou parte do e-mail.');
            hasError = true;
        }

        // confirm password
        if (confirmPassword.value !== p) {
            setError('confirmPassword','As senhas não correspondem.');
            hasError = true;
        }

        // terms
        if (!terms.checked) {
            setError('terms','É necessário aceitar os termos.');
            hasError = true;
        }

        if (hasError) {
            e.preventDefault();
            const firstErr = form.querySelector('.text-red-400:not(:empty)');
            if (firstErr) {
                const associated = firstErr.id.replace('err-','');
                const el = document.getElementById(associated);
                if (el) el.focus();
            }
            const formErr = document.getElementById('form-error');
            if (formErr) formErr.textContent = 'Há erros no formulário. Corrija antes de enviar.';
            return false;
        }

        // últimas medidas antes de permitir envio: bloquear botão e permitir submit
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        return true;
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    document.body.classList.toggle('dark-mode', theme === 'dark');

    if (sunIcon) sunIcon.classList.toggle('hidden', theme !== 'light');
    if (moonIcon) moonIcon.classList.toggle('hidden', theme !== 'dark');

    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  applyTheme(initial);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // Mobile menu: segura checagem e comportamentos (Esc, click fora, bloquear scroll)
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.setAttribute('aria-controls', 'mobile-menu');
    mobileMenuButton.setAttribute('aria-expanded', 'false');

    mobileMenuButton.addEventListener('click', (e) => {
      const nowHidden = mobileMenu.classList.toggle('hidden'); // true when now hidden
      const isOpen = !nowHidden;
      mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden')) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          mobileMenuButton.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
});