function getUsuariosDB() {
    try {
        const users = localStorage.getItem('literaverse_users');
        return users ? JSON.parse(users) : [];
    } catch (e) {
        console.error("Erro ao ler usuários do localStorage", e);
        return [];
    }
}

/**
 * Salva a lista de usuários no localStorage.
 * @param {Array<object>} users
 */
function setUsuariosDB(users) {
    try {
        localStorage.setItem('literaverse_users', JSON.stringify(users));
    } catch (e) {
        console.error("Erro ao salvar usuários no localStorage", e);
    }
}

// --- Simulação de API (Autenticação) ---

/**
 * Simula uma chamada de API de login (como um fetch).
 * Retorna uma Promise que resolve com dados do usuário se for sucesso,
 * ou rejeita com uma mensagem de erro.
 * @param {string} email
 * @param {string} senha
 * @returns {Promise<object>}
 */
function simularLoginAPI(email, senha) {
    console.log(`[API] Tentando login para: ${email}`);
    return new Promise((resolve, reject) => {
        // Simula a demora da rede (como o fetch faria)
        setTimeout(() => {
            const usuarios = getUsuariosDB();
            const usuarioEncontrado = usuarios.find(u => u.email === email);

            // (Nota: Em um app real, a senha seria comparada com hash no backend)
            if (usuarioEncontrado && usuarioEncontrado.senha === senha) {
                console.log("[API] Login bem-sucedido.");
                // Remove a senha antes de retornar os dados da sessão
                const sessaoUsuario = {
                    id: usuarioEncontrado.id,
                    nome: usuarioEncontrado.nome,
                    email: usuarioEncontrado.email,
                    usuario: usuarioEncontrado.usuario // Adiciona o nome de usuário à sessão
                };
                resolve(sessaoUsuario);
            } else if (usuarioEncontrado) {
                console.warn("[API] Senha incorreta.");
                reject(new Error('Senha incorreta.'));
            } else {
                console.warn("[API] Usuário não encontrado.");
                reject(new Error('Usuário não encontrado.'));
            }
        }, 800); // 800ms de delay
    });
}

/**
 * Simula uma chamada de API de Registro (como um fetch).
 * @param {object} novoUsuario
 * @returns {Promise<object>}
 */
function simularRegistroAPI(novoUsuario) {
     console.log(`[API] Tentando registrar: ${novoUsuario.email}`);
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const usuarios = getUsuariosDB();
            if (usuarios.find(u => u.email === novoUsuario.email.toLowerCase())) {
                console.warn("[API] Email já existe.");
                reject(new Error('Este email já está cadastrado.'));
                return;
            }
            if (usuarios.find(u => u.usuario === novoUsuario.usuario)) {
                 console.warn("[API] Nome de usuário já existe.");
                reject(new Error('Este nome de usuário já está em uso.'));
                return;
            }

            // (Em app real, a senha seria "hasheada" aqui antes de salvar)
            const usuarioSalvo = {
                id: 'user_' + Date.now(),
                nome: novoUsuario.nome,
                usuario: novoUsuario.usuario,
                email: novoUsuario.email.toLowerCase(),
                nascimento: novoUsuario.nascimento,
                senha: novoUsuario.senha, // Salvando senha como texto (APENAS PARA SIMULAÇÃO)
                dataCadastro: new Date().toISOString()
            };
            
            usuarios.push(usuarioSalvo);
            setUsuariosDB(usuarios);
            console.log("[API] Registro bem-sucedido.");
            
            // Retorna os dados da sessão (sem a senha)
            const sessaoUsuario = {
                id: usuarioSalvo.id,
                nome: usuarioSalvo.nome,
                email: usuarioSalvo.email,
                usuario: usuarioSalvo.usuario
            };
            resolve(sessaoUsuario);

        }, 800);
     });
}


/**
 * Salva a sessão do usuário no localStorage (simulando um token JWT)
 * @param {object} sessaoUsuario
 */
function salvarSessao(sessaoUsuario) {
    try {
        localStorage.setItem('literaverse_session', JSON.stringify(sessaoUsuario));
        console.log("Sessão salva:", sessaoUsuario);
    } catch (e) {
        console.error("Erro ao salvar sessão", e);
    }
}

/**
 * Recupera a sessão do usuário
 * @returns {object | null}
 */
function getSessao() {
     try {
        const sessao = localStorage.getItem('literaverse_session');
        return sessao ? JSON.parse(sessao) : null;
    } catch (e) {
        console.error("Erro ao ler sessão", e);
        return null;
    }
}

/**
 * Limpa a sessão (logout)
 */
function fazerLogout() {
    console.log("Fazendo logout...");
    localStorage.removeItem('literaverse_session');
    // Redireciona para a home
    window.location.href = 'index.html';
}

// --- Execução Principal (quando o DOM carregar) ---
document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM carregado. Iniciando script principal.");

    // --- Lógica de Tema (Existente) ---
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
        // Mudei o padrão para escuro, como na index.html
        const temaInicial = temaSalvo || (prefereEscuro ? 'escuro' : 'escuro'); 
        aplicarTema(temaInicial);
    }

    if (botaoTema) {
        inicializarTema();
        botaoTema.addEventListener('click', () => {
            const atual = body.classList.contains('tema-claro') ? 'claro' : 'escuro';
            aplicarTema(atual === 'claro' ? 'escuro' : 'claro');
        });
    }

    // --- Lógica de Mostrar/Ocultar Senha (Existente) ---
    const botoesMostrarSenha = document.querySelectorAll('.botao-mostrar-senha');
    botoesMostrarSenha.forEach(botao => {
        botao.addEventListener('click', () => {
            const targetId = botao.getAttribute('data-target');
            const campoSenha = document.getElementById(targetId);

            if (campoSenha) {
                const isPassword = campoSenha.type === 'password';
                campoSenha.type = isPassword ? 'text' : 'password';
                botao.classList.toggle('ativo', isPassword);
                botao.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
            }
        });
    });

    // --- Atualização da UI de Autenticação (Roda em todas as páginas) ---
    function atualizarHeaderAuth() {
        const sessao = getSessao();
        const containerAcoes = document.getElementById('acoes-usuario-auth-container');

        if (!containerAcoes) {
             console.warn("Container 'acoes-usuario-auth-container' não encontrado no header.");
             return;
        }

        if (sessao) {
            // Usuário logado
            // console.log("Atualizando header: Usuário LOGADO", sessao);
            containerAcoes.innerHTML = `
                <a href="escrever.html" class="botao-cadastro me-2">Publicar</a>
                <a href="usuario.html" class="botao-cadastro me-2">Meu Perfil (@${sessao.usuario || sessao.nome})</a>
                <button id="botao-logout" class="botao-acao me-2" style="border: 1px solid var(--cor-terciaria); color: var(--cor-terciaria); padding: .5rem 1rem; border-radius: 9999px; font-weight: 700;">Sair</button>
            `;
            const btnLogout = document.getElementById('botao-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', (e) => {
                    e.preventDefault();
                    fazerLogout();
                });
            }
        } else {
            // Usuário deslogado
            // console.log("Atualizando header: Usuário DESLOGADO");
            containerAcoes.innerHTML = `
                <a href="login.html" class="botao-cadastro me-2">Publicar</a>
                <a href="login.html" class="botao-cadastro me-2">Registrar/Logar</a>
            `;
            // Nota: O botão "Publicar" agora leva ao login se não estiver logado.
        }
    }
    atualizarHeaderAuth();


    // --- Lógica da Página de Cadastro (cadastro.html) ---
    const formCadastro = document.getElementById('formulario-cadastro');
    if (formCadastro) {
        console.log("Página de cadastro detectada.");
        
        // (Função validarSenha do script.js original)
        function validarSenha(valor) {
           const erros = [];
            if (!valor || valor.length < 8) {
                erros.push('Mínimo de 8 caracteres.');
            }
            if (!/[A-Z]/.test(valor)) erros.push('Inclua pelo menos uma letra maiúscula.');
            if (!/[a-z]/.test(valor)) erros.push('Inclua pelo menos uma letra minúscula.');
            if (!/\d/.test(valor)) erros.push('Inclua pelo menos um número.');
            if (!/[!@#\$%\^&\*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(valor)) erros.push('Inclua pelo menos um caractere especial.');
            if (/(.)\1\1/.test(valor)) erros.push('Não use o mesmo caractere repetido 3 vezes seguidas.');
            
            function temSequencia(s) {
                const seqLen = 3;
                for (let i = 0; i <= s.length - seqLen; i++) {
                    const slice = s.slice(i, i + seqLen);
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
            if (temSequencia(valor)) erros.push('Evite sequências (ex: 123 ou abc).');
            return erros;
        }

        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Formulário de cadastro enviado.");

            const nome = document.getElementById('nome');
            const usuarioEl = document.getElementById('usuario');
            const email = document.getElementById('email');
            const nascimento = document.getElementById('nascimento');
            const senha = document.getElementById('senha');
            const confirmar = document.getElementById('confirmar-senha');
            const termos = document.getElementById('termos');
            const erroForm = document.getElementById('erro-formulario');

            let valido = true;
            formCadastro.querySelectorAll('.mensagem-erro').forEach(el => el.textContent = '');

            if (!nome || !nome.value.trim()) { document.getElementById('erro-nome').textContent = 'Informe seu nome.'; valido = false; }
            if (!usuarioEl || !usuarioEl.value.trim()) { document.getElementById('erro-usuario').textContent = 'Informe um nome de usuário.'; valido = false; }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { document.getElementById('erro-email').textContent = 'Email inválido.'; valido = false; }
            if (!nascimento || !nascimento.value) { document.getElementById('erro-nascimento').textContent = 'Informe sua data de nascimento.'; valido = false; }

            const errosSenha = validarSenha(senha ? senha.value : '');
            if (errosSenha.length) {
                document.getElementById('erro-senha').textContent = errosSenha.join(' ');
                valido = false;
            }

            if (senha && confirmar && senha.value !== confirmar.value) { document.getElementById('erro-confirmar-senha').textContent = 'As senhas não coincidem.'; valido = false; }
            if (!termos || !termos.checked) { if(erroForm) erroForm.textContent = 'Aceite os termos para continuar.'; valido = false; }

            if (!valido) {
                console.warn("Validação do formulário falhou.");
                return;
            }
            
            const novoUsuario = {
                nome: nome.value.trim(),
                usuario: usuarioEl.value.trim(),
                email: email.value.toLowerCase(),
                nascimento: nascimento.value,
                senha: senha.value
            };

            const botao = document.getElementById('botao-enviar');
            if (botao) { botao.disabled = true; botao.textContent = 'Criando conta...'; }

            // Usando a simulação de API (Promise)
            simularRegistroAPI(novoUsuario)
                .then(sessaoUsuario => {
                    // Sucesso no registro
                    console.log("Registro bem-sucedido, salvando sessão...");
                    salvarSessao(sessaoUsuario);
                    
                    // Redireciona para o perfil
                    window.location.href = 'usuario.html';
                })
                .catch(erro => {
                    // Falha no registro (ex: email duplicado)
                    console.error("Falha no registro:", erro.message);
                    if (erro.message.includes('email')) {
                        document.getElementById('erro-email').textContent = erro.message;
                    } else if (erro.message.includes('usuário')) {
                         document.getElementById('erro-usuario').textContent = erro.message;
                    } else {
                        if(erroForm) erroForm.textContent = erro.message;
                    }
                    if (botao) { botao.disabled = false; botao.textContent = 'Criar conta'; }
                });
        });
    }
    
    // --- Lógica da Página de Login (login.html) ---
    const formLogin = document.getElementById('formulario-login');
    if(formLogin) {
        console.log("Página de login detectada.");
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Formulário de login enviado.");
            
            const email = document.getElementById('email');
            const senha = document.getElementById('senha');
            const erroEl = document.getElementById('erro-formulario-login');
            const botao = document.getElementById('botao-enviar-login');

            if (erroEl) erroEl.textContent = '';
            if (botao) { botao.disabled = true; botao.textContent = 'Entrando...'; }

            // Usando a simulação de API (Promise)
            simularLoginAPI(email.value.toLowerCase(), senha.value)
                .then(sessaoUsuario => {
                    // Sucesso
                    console.log("Login bem-sucedido, salvando sessão...");
                    salvarSessao(sessaoUsuario);
                    
                    // Verifica se há um redirecionamento pendente
                    const redirectUrl = localStorage.getItem('redirect_after_login');
                    if(redirectUrl) {
                        localStorage.removeItem('redirect_after_login'); // Limpa
                        console.log("Redirecionando para:", redirectUrl);
                        window.location.href = redirectUrl;
                    } else {
                        console.log("Redirecionando para usuario.html");
                        window.location.href = 'usuario.html'; // Padrão: vai para o perfil
                    }
                })
                .catch(erro => {
                    // Falha
                    console.error("Falha no login:", erro.message);
                    if (erroEl) erroEl.textContent = erro.message;
                    if (botao) { botao.disabled = false; botao.textContent = 'Entrar'; }
                });
        });
    }

    // --- Proteção de Páginas (Roda em páginas específicas) ---
    function protegerPagina() {
        const sessao = getSessao();
        // Se o body tiver uma classe específica, verificamos
        if (document.body.classList.contains('pagina-protegida')) {
            console.log("Verificando proteção de página...");
            if (!sessao) {
                console.warn("Acesso negado. Usuário não logado. Redirecionando para login...");
                // Se não está logado, redireciona para o login
                // Salva a página atual para redirecionar de volta após o login
                localStorage.setItem('redirect_after_login', window.location.pathname + window.location.search);
                window.location.href = 'login.html';
            } else {
                console.log("Acesso permitido.");
                // Se está logado, podemos carregar os dados do usuário
                // (Ex: em usuario.html, carregar os dados da sessão)
                if (document.body.classList.contains('pagina-usuario')) {
                    carregarDadosUsuario(sessao);
                }
            }
        }
    }
    protegerPagina();
    
    // Função para carregar dados em usuario.html
    function carregarDadosUsuario(sessao) {
        console.log("Carregando dados do usuário na página de perfil...");
        const nomeEl = document.getElementById('perfil-nome-usuario');
        const bioEl = document.getElementById('perfil-bio-usuario');
        
        // Busca o usuário completo no DB (para pegar data de cadastro, etc.)
        const usuarios = getUsuariosDB();
        const usuarioCompleto = usuarios.find(u => u.id === sessao.id);

        if (!usuarioCompleto) {
            console.error("Não foi possível encontrar dados completos do usuário na DB. Forçando logout.");
            fazerLogout();
            return;
        }

        if (nomeEl) {
            nomeEl.textContent = usuarioCompleto.usuario; // Usa o nome de usuário salvo
        }
         if (bioEl) {
             const dataCadastro = new Date(usuarioCompleto.dataCadastro).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
             bioEl.textContent = `Um explorador de mundos literários. Juntou-se em ${dataCadastro}.`;
         }
    }

});

// modal
const botaoCurtir = document.getElementById("curtirLivro");
const modal = document.getElementById("model");
const fecharModal = document.getElementById("FecharModal");

botaoCurtir.onclick = function AbrirModel() {
    modal.showModal();
}

fecharModal.onclick = function FecharModel() {
    modal.close();
}
