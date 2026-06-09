document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. GERENCIAMENTO DAS SEÇÕES EXPANSÍVEIS (ACCORDION)
    // ==========================================================================
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const painel = document.getElementById(header.getAttribute('aria-controls'));
            const isExpandido = header.getAttribute('aria-expanded') === 'true';

            // Alterna o estado do item clicado
            header.setAttribute('aria-expanded', !isExpandido);
            painel.hidden = isExpandido;
        });
    });

    // ==========================================================================
    // 2. COMPONENTE INTERATIVO: QUIZ DINÂMICO
    // ==========================================================================
    const dadosQuiz = {
        pergunta: "Qual é o pilar de sustentação do novo paradigma do desenvolvimento sustentável definido pelas Nações Unidas?",
        opcoes: [
            { texto: "Apenas a conservação estrita e intocável dos recursos naturais selvagens.", correta: false },
            { texto: "A união equilibrada de fatores de natureza ambiental, econômica e social.", correta: true },
            { texto: "A maximização do lucro agrícola sem restrições mercadológicas mundiais.", correta: false },
            { texto: "A substituição total da força de trabalho humana rural por inteligências robóticas.", correta: false }
        ]
    };

    const containerCorpo = document.getElementById('quiz-corpo');
    const containerResultado = document.getElementById('quiz-resultado');

    function renderizarQuiz() {
        if (!containerCorpo) return;
        
        let htmlQuiz = `<p class="quiz-pergunta"><strong>${dadosQuiz.pergunta}</strong></p>`;
        dadosQuiz.opcoes.forEach((opcao, index) => {
            htmlQuiz += `
                <button class="quiz-opcao" data-index="${index}">
                    ${opcao.texto}
                </button>
            `;
        });
        containerCorpo.innerHTML = htmlQuiz;

        // Captura cliques nas opções criadas
        const botoesOpcao = containerCorpo.querySelectorAll('.quiz-opcao');
        botoesOpcao.forEach(botao => {
            botao.addEventListener('click', (e) => validarResposta(e.target, botoesOpcao));
        });
    }

    function validarResposta(botaoSelecionado, todosBotoes) {
        const indexSelecionado = parseInt(botaoSelecionado.getAttribute('data-index'));
        const aOpcaoEhCorreta = dadosQuiz.opcoes[indexSelecionado].correta;

        // Desabilita novas interações
        todosBotoes.forEach(b => b.disabled = true);

        if (aOpcaoEhCorreta) {
            botaoSelecionado.classList.add('correta');
            containerResultado.textContent = "Excelente! Você compreendeu o paradigma. A sustentabilidade necessita de viabilidade econômica e justiça social, além da conservação ambiental.";
            containerResultado.style.color = "#81c784";
        } else {
            botaoSelecionado.classList.add('errada');
            containerResultado.textContent = "Resposta incorreta. Lembre-se: o desenvolvimento só é sustentável se for competitivo economicamente e satisfizer as condições sociais.";
            containerResultado.style.color = "#e57373";
        }
        containerResultado.hidden = false;
    }

    renderizarQuiz();

    // ==========================================================================
    // 3. CAIXA FLUTUANTE DE ACESSIBILIDADE
    // ==========================================================================
    const btnAumentar = document.getElementById('btn-aumentar');
    const btnDiminuir = document.getElementById('btn-diminuir');
    const btnTema = document.getElementById('btn-tema');
    const btnFalar = document.getElementById('btn-falar');
    const btnParar = document.getElementById('btn-parar');

    // Controle de Tamanho de Fonte
    btnAumentar.addEventListener('click', () => {
        document.body.classList.remove('font-pequena');
        document.body.classList.add('font-gande');
    });

    btnDiminuir.addEventListener('click', () => {
        document.body.classList.remove('font-gande');
        document.body.classList.add('font-pequena');
    });

    // Controle de Tema Escuro / Claro
    btnTema.addEventListener('click', () => {
        const temaAtual = document.documentElement.getAttribute('data-theme');
        if (temaAtual === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });

    // Controle de Leitura por Voz (SpeechSynthesis API)
    let somFala = null;

    btnFalar.addEventListener('click', () => {
        // Cancela leituras anteriores em andamento
        window.speechSynthesis.cancel();

        // Captura apenas o conteúdo textual do container principal exigido
        const areaTexto = document.getElementById('area-leitura');
        if (!areaTexto) return;

        // Limpa o texto para uma leitura limpa (remove botões do accordion/quiz do fluxo falado)
        const paragrafos = areaTexto.querySelectorAll('.bloco-texto p, .bloco-texto h2, .accordion-section h2, .accordion-intro');
        let textoCompleto = "";
        paragrafos.forEach(p => textoCompleto += p.innerText + ". ");

        somFala = new SpeechSynthesisUtterance(textoCompleto);
        somFala.lang = 'pt-BR';
        somFala.rate = 1.0; // Velocidade natural

        window.speechSynthesis.speak(somFala);
    });

    btnParar.addEventListener('click', () => {
        window.speechSynthesis.cancel();
    });

    // ==========================================================================
    // 4. VALIDAÇÃO E ENVIO DO FORMULÁRIO (SIDEBAR DIREITA)
    // ==========================================================================
    const form = document.getElementById('form-inscricao');
    const formFeedback = document.getElementById('form-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formFeedback.hidden = true;
        formFeedback.className = "form-feedback";

        // Coleta de Campos
        const nome = document.getElementById('txt-nome').value.trim();
        const email = document.getElementById('txt-email').value.trim();
        const cidade = document.getElementById('txt-cidade').value.trim();
        const estado = document.getElementById('txt-estado').value.trim();
        const pais = document.getElementById('txt-pais').value.trim();
        const telefone = document.getElementById('txt-telefone').value.trim();

        // Validação Simples Nativa
        if (!nome || !email || !cidade || !estado || !pais || !telefone) {
            formFeedback.textContent = "Por favor, preencha todos os campos obrigatórios.";
            formFeedback.classList.add('error');
            formFeedback.hidden = false;
            return;
        }

        if (!validarEmailEstrutura(email)) {
            formFeedback.textContent = "Insira um endereço de e-mail válido.";
            formFeedback.classList.add('error');
            formFeedback.hidden = false;
            return;
        }

        // Sucesso simulado
        formFeedback.textContent = `Inscrição realizada com sucesso! Bem-vindo ao ecossistema, ${nome}.`;
        formFeedback.classList.add('success');
        formFeedback.hidden = false;

        // Limpa o formulário
        form.reset();
    });

    function validarEmailEstrutura(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});