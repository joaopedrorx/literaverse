document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE TEMA E MENU ---
    const botaoMenuMobile = document.getElementById('botao-menu-mobile');
    const menuMobile = document.getElementById('menu-mobile');
    const alternarTema = document.getElementById('alternar-tema');
    const iconeSol = document.getElementById('icone-sol');
    const iconeLua = document.getElementById('icone-lua');

    // Inicialização do tema
    const temaSalvo = localStorage.getItem('tema');
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const temaInicial = temaSalvo || (prefereEscuro ? 'dark' : 'light');

    function aplicarTema(tema) {
        console.log("Aplicando tema:", tema);
        document.body.classList.toggle('tema-claro', tema === 'light');
        document.body.classList.toggle('tema-escuro', tema === 'dark');

        if (iconeSol) iconeSol.classList.toggle('hidden', tema !== 'light');
        if (iconeLua) iconeLua.classList.toggle('hidden', tema !== 'dark');

        try {
            localStorage.setItem('tema', tema);
        } catch (e) {
            console.error("Falha ao salvar o tema no localStorage", e);
        }
    }

    aplicarTema(temaInicial);

    if (alternarTema) {
        alternarTema.addEventListener('click', () => {
            console.log("Botão de tema clicado");
            const temaAtual = document.body.classList.contains('tema-claro') ? 'light' : 'dark';
            aplicarTema(temaAtual === 'light' ? 'dark' : 'light');
        });
    }

    // Manipulação do menu mobile
    if (botaoMenuMobile && menuMobile) {
        botaoMenuMobile.setAttribute('aria-controls', 'menu-mobile');
        botaoMenuMobile.setAttribute('aria-expanded', 'false');

        const alternarMenu = (abrir) => {
            const estaAberto = typeof abrir === 'boolean' ? abrir : menuMobile.classList.toggle('hidden');
            botaoMenuMobile.setAttribute('aria-expanded', String(!estaAberto));
            document.body.style.overflow = !estaAberto ? 'hidden' : '';
            if(estaAberto) menuMobile.classList.add('hidden');
        };

        botaoMenuMobile.addEventListener('click', (e) => {
            e.stopPropagation();
            alternarMenu();
        });

        document.addEventListener('click', (e) => {
            if (!menuMobile.classList.contains('hidden') && !menuMobile.contains(e.target)) {
                alternarMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menuMobile.classList.contains('hidden')) {
                alternarMenu(false);
            }
        });

        menuMobile.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                alternarMenu(false);
            });
        });
    }


    // --- LÓGICA DE VALIDAÇÃO DE FORMULÁRIO ---
    const form = document.getElementById('formulario-cadastro');
    if (!form) return;

    const nomeCompleto = document.getElementById('fullName');
    const nomeUsuario = document.getElementById('username');
    const email = document.getElementById('email');
    const dataNascimento = document.getElementById('birthdate');
    const senha = document.getElementById('password');
    const confirmarSenha = document.getElementById('confirmPassword');
    const termos = document.getElementById('terms');
    const botaoEnviar = document.getElementById('botao-enviar');

    const erro = id => document.getElementById('err-' + id);

    const senhasComuns = new Set(['123456', 'password', '123456789', 'qwerty', '111111', '12345678', 'abc123', 'password123']);

    function validarFormatoEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    }

    function temSequencia(s, minLen = 4) {
        const norm = s.toLowerCase();
        for (let i = 0; i <= norm.length - minLen; i++) {
            let inc = true,
                dec = true;
            for (let j = 1; j < minLen; j++) {
                if (norm.charCodeAt(i + j) !== norm.charCodeAt(i + j - 1) + 1) inc = false;
                if (norm.charCodeAt(i + j) !== norm.charCodeAt(i + j - 1) - 1) dec = false;
            }
            if (inc || dec) return true;
        }
        return false;
    }

    function caracteresRepetidos(s, limit = 4) {
        let run = 1;
        for (let i = 1; i < s.length; i++) {
            if (s[i] === s[i - 1]) {
                run++;
                if (run >= limit) return true;
            } else run = 1;
        }
        return false;
    }

    function forcaSenha(p) {
        const checks = [];
        if (p.length < 12) checks.push('Mínimo 12 caracteres');
        if (!/[a-z]/.test(p)) checks.push('Pelo menos 1 letra minúscula');
        if (!/[A-Z]/.test(p)) checks.push('Pelo menos 1 letra maiúscula');
        if (!/[0-9]/.test(p)) checks.push('Pelo menos 1 número');
        if (!/[^A-Za-z0-9]/.test(p)) checks.push('Pelo menos 1 caractere especial');
        if (/\s/.test(p)) checks.push('Sem espaços em branco');
        if (senhasComuns.has(p.toLowerCase())) checks.push('Senha muito comum');
        if (temSequencia(p, 4)) checks.push('Evite sequências como "abcd" ou "1234"');
        if (caracteresRepetidos(p, 4)) checks.push('Evite caracteres repetidos em sequência');
        return checks;
    }

    function calcularIdade(dn) {
        if (!dn) return 0;
        const b = new Date(dn);
        const hoje = new Date();
        let idade = hoje.getFullYear() - b.getFullYear();
        const m = hoje.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < b.getDate())) idade--;
        return idade;
    }

    function definirErro(elId, mensagem) {
        const e = erro(elId);
        if (e) e.textContent = mensagem || '';
    }

    function limparTodosErros() {
        ['fullName', 'username', 'email', 'birthdate', 'password', 'confirmPassword', 'terms'].forEach(id => definirErro(id, ''));
        const formErr = document.getElementById('erro-formulario');
        if (formErr) formErr.textContent = '';
    }

    // Em tempo real: indicador de força da senha
    if (senha) {
        const forcaEl = document.getElementById('verificacao-forca-senha');
        senha.addEventListener('input', () => {
            const p = senha.value || '';
            const problemas = forcaSenha(p);
            if (!p) {
                forcaEl.textContent = '';
                forcaEl.className = 'mt-2 text-sm';
                definirErro('password', '');
                return;
            }
            if (problemas.length === 0) {
                forcaEl.textContent = 'Senha forte';
                forcaEl.className = 'mt-2 text-sm text-green-400';
                definirErro('password', '');
            } else {
                forcaEl.textContent = 'Problemas: ' + problemas.join('; ');
                forcaEl.className = 'mt-2 text-sm text-yellow-400';
                definirErro('password', '');
            }
        });
    }

    // verificações leves de nome de usuário/email
    if (nomeUsuario) {
        nomeUsuario.addEventListener('input', () => {
            const v = nomeUsuario.value.trim();
            if (v && !/^[a-zA-Z0-9._-]{3,24}$/.test(v)) {
                definirErro('username', 'Nome de usuário inválido. Use 3–24 caracteres válidos (letras, números, . _ -).');
            } else definirErro('username', '');
        });
    }

    if (email) {
        email.addEventListener('blur', () => {
            const v = email.value.trim();
            if (v && !validarFormatoEmail(v)) definirErro('email', 'Formato de email inválido.');
            else definirErro('email', '');
        });
    }

    if (dataNascimento) {
        dataNascimento.addEventListener('blur', () => {
            const idade = calcularIdade(dataNascimento.value);
            if (idade < 13) definirErro('birthdate', 'É necessário ter 13 anos ou mais.');
            else definirErro('birthdate', '');
        });
    }

    if (confirmarSenha) {
        confirmarSenha.addEventListener('input', () => {
            if (confirmarSenha.value !== senha.value) definirErro('confirmPassword', 'As senhas não correspondem.');
            else definirErro('confirmPassword', '');
        });
    }

    const togglePassword = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeOffIcon = document.getElementById('eye-off-icon');

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            if (senha.type === 'password') {
                senha.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                senha.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        });
    }

    // manipulador de envio
    form.addEventListener('submit', (e) => {
        limparTodosErros();
        let temErro = false;

        // nome completo
        if (!nomeCompleto.value.trim() || nomeCompleto.value.trim().length < 2) {
            definirErro('fullName', 'Informe seu nome completo.');
            temErro = true;
        }

        // nome de usuário
        const u = nomeUsuario.value.trim();
        if (!u || !/^[a-zA-Z0-9._-]{3,24}$/.test(u)) {
            definirErro('username', 'Nome de usuário inválido.');
            temErro = true;
        }

        // email
        const em = email.value.trim();
        if (!em || !validarFormatoEmail(em)) {
            definirErro('email', 'Email inválido.');
            temErro = true;
        }

        // data de nascimento / idade >=13
        const idade = calcularIdade(dataNascimento.value);
        if (!dataNascimento.value || idade < 13) {
            definirErro('birthdate', 'É necessário ter 13 anos ou mais.');
            temErro = true;
        }

        // verificações de senha
        const p = senha.value || '';
        const problemasSenha = forcaSenha(p);
        const parteLocal = (em.split('@')[0] || '').toLowerCase();
        if (!p || problemasSenha.length > 0) {
            definirErro('password', 'Senha não atende aos requisitos: ' + (problemasSenha[0] || 'verifique.'));
            temErro = true;
        } else if (p.toLowerCase().includes(u.toLowerCase()) || (parteLocal && p.toLowerCase().includes(parteLocal))) {
            definirErro('password', 'Senha não pode conter o usuário ou parte do e-mail.');
            temErro = true;
        }

        // confirmar senha
        if (confirmarSenha.value !== p) {
            definirErro('confirmPassword', 'As senhas não correspondem.');
            temErro = true;
        }

        // termos
        if (!termos.checked) {
            definirErro('terms', 'É necessário aceitar os termos.');
            temErro = true;
        }

        if (temErro) {
            e.preventDefault();
            const primeiroErro = form.querySelector('.text-red-400:not(:empty)');
            if (primeiroErro) {
                const associado = primeiroErro.id.replace('err-', '');
                const el = document.getElementById(associado);
                if (el) el.focus();
            }
            const formErr = document.getElementById('erro-formulario');
            if (formErr) formErr.textContent = 'Há erros no formulário. Corrija antes de enviar.';
            return false;
        }

        // últimas medidas antes de permitir envio: bloquear botão e permitir submit
        if(botaoEnviar) {
            botaoEnviar.disabled = true;
            botaoEnviar.textContent = 'Enviando...';
        }
        
        // Para demonstração, prevenimos o envio real e mostramos um alerta
        e.preventDefault();
        alert('Cadastro enviado com sucesso! (simulação)');
        setTimeout(() => {
            form.reset();
            if(botaoEnviar) {
                botaoEnviar.disabled = false;
                botaoEnviar.textContent = 'Criar conta';
            }
            limparTodosErros();
        }, 1000);

        return true;
    });
});