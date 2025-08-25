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