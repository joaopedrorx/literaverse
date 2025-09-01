document.addEventListener('DOMContentLoaded', () => {
    // --- THEME AND MENU LOGIC ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        document.body.classList.toggle('light-mode', theme === 'light');
        document.body.classList.toggle('dark-mode', theme === 'dark');

        if (sunIcon) sunIcon.classList.toggle('hidden', theme !== 'light');
        if (moonIcon) moonIcon.classList.toggle('hidden', theme !== 'dark');

        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error("Failed to save theme to localStorage", e);
        }
    }

    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // Mobile menu handling
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.setAttribute('aria-controls', 'mobile-menu');
        mobileMenuButton.setAttribute('aria-expanded', 'false');

        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));
            document.body.style.overflow = !isOpen ? 'hidden' : '';
            if(isOpen) mobileMenu.classList.add('hidden');
        };

        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target)) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                toggleMenu(false);
            }
        });

        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggleMenu(false);
            });
        });
    }


    // --- FORM VALIDATION LOGIC ---
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

    const commonPasswords = new Set(['123456', 'password', '123456789', 'qwerty', '111111', '12345678', 'abc123', 'password123']);

    function validateEmailFormat(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    }

    function hasSequence(s, minLen = 4) {
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

    function repeatedCharRun(s, limit = 4) {
        let run = 1;
        for (let i = 1; i < s.length; i++) {
            if (s[i] === s[i - 1]) {
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
        if (hasSequence(p, 4)) checks.push('Evite sequências como "abcd" ou "1234"');
        if (repeatedCharRun(p, 4)) checks.push('Evite caracteres repetidos em sequência');
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
        ['fullName', 'username', 'email', 'birthdate', 'password', 'confirmPassword', 'terms'].forEach(id => setError(id, ''));
        const formErr = document.getElementById('form-error');
        if (formErr) formErr.textContent = '';
    }

    // Real-time: password strength indicator
    if (password) {
        const strengthEl = document.getElementById('password-strength');
        password.addEventListener('input', () => {
            const p = password.value || '';
            const issues = passwordStrength(p);
            if (!p) {
                strengthEl.textContent = '';
                strengthEl.className = 'mt-2 text-sm';
                setError('password', '');
                return;
            }
            if (issues.length === 0) {
                strengthEl.textContent = 'Senha forte';
                strengthEl.className = 'mt-2 text-sm text-green-400';
                setError('password', '');
            } else {
                strengthEl.textContent = 'Problemas: ' + issues.join('; ');
                strengthEl.className = 'mt-2 text-sm text-yellow-400';
                setError('password', '');
            }
        });
    }

    // username/email light checks
    if (username) {
        username.addEventListener('input', () => {
            const v = username.value.trim();
            if (v && !/^[a-zA-Z0-9._-]{3,24}$/.test(v)) {
                setError('username', 'Nome de usuário inválido. Use 3–24 caracteres válidos (letras, números, . _ -).');
            } else setError('username', '');
        });
    }

    if (email) {
        email.addEventListener('blur', () => {
            const v = email.value.trim();
            if (v && !validateEmailFormat(v)) setError('email', 'Formato de email inválido.');
            else setError('email', '');
        });
    }

    if (birthdate) {
        birthdate.addEventListener('blur', () => {
            const age = calculateAge(birthdate.value);
            if (age < 13) setError('birthdate', 'É necessário ter 13 anos ou mais.');
            else setError('birthdate', '');
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            if (confirmPassword.value !== password.value) setError('confirmPassword', 'As senhas não correspondem.');
            else setError('confirmPassword', 'As senhas não correspondem.');
        });
    }

    // submit handler
    form.addEventListener('submit', (e) => {
        clearAllErrors();
        let hasError = false;

        // full name
        if (!fullName.value.trim() || fullName.value.trim().length < 2) {
            setError('fullName', 'Informe seu nome completo.');
            hasError = true;
        }

        // username
        const u = username.value.trim();
        if (!u || !/^[a-zA-Z0-9._-]{3,24}$/.test(u)) {
            setError('username', 'Nome de usuário inválido.');
            hasError = true;
        }

        // email
        const em = email.value.trim();
        if (!em || !validateEmailFormat(em)) {
            setError('email', 'Email inválido.');
            hasError = true;
        }

        // birthdate / age >=13
        const age = calculateAge(birthdate.value);
        if (!birthdate.value || age < 13) {
            setError('birthdate', 'É necessário ter 13 anos ou mais.');
            hasError = true;
        }

        // password checks
        const p = password.value || '';
        const pIssues = passwordStrength(p);
        const localPart = (em.split('@')[0] || '').toLowerCase();
        if (!p || pIssues.length > 0) {
            setError('password', 'Senha não atende aos requisitos: ' + (pIssues[0] || 'verifique.'));
            hasError = true;
        } else if (p.toLowerCase().includes(u.toLowerCase()) || (localPart && p.toLowerCase().includes(localPart))) {
            setError('password', 'Senha não pode conter o usuário ou parte do e-mail.');
            hasError = true;
        }

        // confirm password
        if (confirmPassword.value !== p) {
            setError('confirmPassword', 'As senhas não correspondem.');
            hasError = true;
        }

        // terms
        if (!terms.checked) {
            setError('terms', 'É necessário aceitar os termos.');
            hasError = true;
        }

        if (hasError) {
            e.preventDefault();
            const firstErr = form.querySelector('.text-red-400:not(:empty)');
            if (firstErr) {
                const associated = firstErr.id.replace('err-', '');
                const el = document.getElementById(associated);
                if (el) el.focus();
            }
            const formErr = document.getElementById('form-error');
            if (formErr) formErr.textContent = 'Há erros no formulário. Corrija antes de enviar.';
            return false;
        }

        // últimas medidas antes de permitir envio: bloquear botão e permitir submit
        if(submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
        }
        
        // For demonstration, we prevent actual submission and show an alert
        e.preventDefault();
        alert('Cadastro enviado com sucesso! (simulação)');
        setTimeout(() => {
            form.reset();
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Criar conta';
            }
            clearAllErrors();
        }, 1000);

        return true;
    });
});
