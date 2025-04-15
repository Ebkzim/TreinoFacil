class Exercicio {
    /**
      @param {string} nome 
      @param {string} maquina 
      @param {number} tempo 
      @param {number} series 
      @param {number} repeticoes 
      @param {number} descanso 
      @param {string} observacao 
     */
    constructor(nome, maquina, tempo, series, repeticoes, descanso, observacao) {
        this.nome = nome || '';
        this.maquina = maquina || '';
        this.tempo = tempo || 0;
        this.series = series || 0;
        this.repeticoes = repeticoes || 0;
        this.descanso = descanso || 0;
        this.observacao = observacao || '';
    }
}


class Treino {
    /**
      @param {string} nome 
      @param {string} descricao 
      @param {Array<Exercicio>} exercicios 
     */
    constructor(nome, descricao, exercicios = []) {
        this.id = this.gerarId();
        this.nome = nome || '';
        this.descricao = descricao || '';
        this.exercicios = exercicios || [];
        this.dataCriacao = new Date();
    }

    /**
      @returns {string} 
     */
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     @param {Exercicio} exercicio 
     */
    adicionarExercicio(exercicio) {
        this.exercicios.push(exercicio);
    }

    /**
     @param {number} indice 
     */
    removerExercicio(indice) {
        if (indice >= 0 && indice < this.exercicios.length) {
            this.exercicios.splice(indice, 1);
        }
    }

    /**
      @param {number} indice 
      @param {Exercicio} exercicioAtualizado 
     */
    atualizarExercicio(indice, exercicioAtualizado) {
        if (indice >= 0 && indice < this.exercicios.length) {
            this.exercicios[indice] = exercicioAtualizado;
        }
    }
}


class GerenciadorTreinos {
    
    constructor() {
        this.treinos = [];
        this.carregarTreinos();
    }

    /**
    
      @param {Treino} treino 
     */
    adicionarTreino(treino) {
        this.treinos.push(treino);
        this.salvarTreinos();
    }

    /**
      @param {string} id 
      @param {Treino} treinoAtualizado 
     */
    atualizarTreino(id, treinoAtualizado) {
        const indice = this.treinos.findIndex(t => t.id === id);
        if (indice !== -1) {
            
            treinoAtualizado.id = id;
            this.treinos[indice] = treinoAtualizado;
            this.salvarTreinos();
        }
    }

    /**
      @param {string} id 
     */
    removerTreino(id) {
        const indice = this.treinos.findIndex(t => t.id === id);
        if (indice !== -1) {
            this.treinos.splice(indice, 1);
            this.salvarTreinos();
        }
    }

    /**
      @param {string} id 
      @returns {Treino|null}
     */
    obterTreinoPorId(id) {
        return this.treinos.find(t => t.id === id) || null;
    }

    
    salvarTreinos() {
        localStorage.setItem('treinos', JSON.stringify(this.treinos));
    }

    
    carregarTreinos() {
        const treinosSalvos = localStorage.getItem('treinos');
        if (treinosSalvos) {
            this.treinos = JSON.parse(treinosSalvos);
        }
    }
}


class Visualizacao {
    constructor() {
      
        this.listaTreinos = document.getElementById('listaTreinos');
        this.listaExercicios = document.getElementById('listaExercicios');
        this.treinoAtualTitulo = document.getElementById('treinoAtualTitulo');
        
        
        this.formTreino = document.getElementById('formTreino');
        this.inputNomeTreino = document.getElementById('nomeTreino');
        this.inputDescricaoTreino = document.getElementById('descricaoTreino');
        
        
        this.modalExercicio = new bootstrap.Modal(document.getElementById('modalExercicio'));
        this.formExercicio = document.getElementById('formExercicio');
        this.inputExercicioIndex = document.getElementById('exercicioIndex');
        this.inputNomeExercicio = document.getElementById('nomeExercicio');
        this.inputMaquinaExercicio = document.getElementById('maquinaExercicio');
        this.inputTempoExercicio = document.getElementById('tempoExercicio');
        this.inputSeriesExercicio = document.getElementById('seriesExercicio');
        this.inputRepeticoesExercicio = document.getElementById('repeticoesExercicio');
        this.inputDescansoExercicio = document.getElementById('descansoExercicio');
        this.inputObservacaoExercicio = document.getElementById('observacaoExercicio');
        
        
        this.modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
        this.btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    }

    /**
      @param {Array<Treino>} treinos 
      @param {string|null} treinoAtivoId 
     */
    renderizarListaTreinos(treinos, treinoAtivoId) {
        this.listaTreinos.innerHTML = '';
        
        if (treinos.length === 0) {
            this.listaTreinos.innerHTML = `
                <div class="list-group-item text-center text-muted py-3">
                    <i class="fas fa-clipboard-list mb-2" style="font-size: 2rem;"></i>
                    <p class="mb-0">Nenhum treino cadastrado</p>
                </div>
            `;
            return;
        }
        
        treinos.forEach(treino => {
            const itemTreino = document.createElement('div');
            itemTreino.className = `list-group-item list-group-item-action treino-item ${treino.id === treinoAtivoId ? 'ativo' : ''}`;
            itemTreino.dataset.id = treino.id;
            
            itemTreino.innerHTML = `
                <div>
                    <h6 class="mb-1">${treino.nome}</h6>
                    <small class="text-muted">${treino.exercicios.length} exercício(s)</small>
                </div>
                <div class="treino-acoes">
                    <button class="btn btn-sm btn-outline-danger btn-excluir-treino" data-id="${treino.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            this.listaTreinos.appendChild(itemTreino);
        });
    }

    /**
      @param {Array<Exercicio>} exercicios 
     */
    renderizarExercicios(exercicios) {
        this.listaExercicios.innerHTML = '';
        
        if (exercicios.length === 0) {
            this.listaExercicios.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-dumbbell mb-2" style="font-size: 2rem;"></i>
                    <p class="mb-0">Nenhum exercício adicionado</p>
                    <small>Clique em "Adicionar Exercício" para começar</small>
                </div>
            `;
            return;
        }
        
        exercicios.forEach((exercicio, indice) => {
            const itemExercicio = document.createElement('div');
            itemExercicio.className = 'exercicio-item';
            itemExercicio.dataset.indice = indice;
            
            itemExercicio.innerHTML = `
                <div class="exercicio-cabecalho">
                    <h6 class="exercicio-titulo">${exercicio.nome}</h6>
                    <div class="exercicio-botoes">
                        <button type="button" class="btn btn-sm btn-outline-info btn-editar-exercicio" data-indice="${indice}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-remover-exercicio" data-indice="${indice}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="exercicio-detalhes">
                    ${exercicio.maquina ? `<span class="detalhe-item"><i class="fas fa-cog"></i>${exercicio.maquina}</span>` : ''}
                    ${exercicio.series ? `<span class="detalhe-item"><i class="fas fa-layer-group"></i>${exercicio.series} séries</span>` : ''}
                    ${exercicio.repeticoes ? `<span class="detalhe-item"><i class="fas fa-redo"></i>${exercicio.repeticoes} repetições</span>` : ''}
                    ${exercicio.tempo ? `<span class="detalhe-item"><i class="fas fa-clock"></i>${exercicio.tempo} minutos</span>` : ''}
                    ${exercicio.descanso ? `<span class="detalhe-item"><i class="fas fa-stopwatch"></i>${exercicio.descanso}s descanso</span>` : ''}
                </div>
                
                ${exercicio.observacao ? `
                <div class="exercicio-observacao mt-2">
                    <small class="text-muted"><i class="fas fa-info-circle me-1"></i>${exercicio.observacao}</small>
                </div>` : ''}
            `;
            
            this.listaExercicios.appendChild(itemExercicio);
        });
    }

    mostrarFormularioNovoExercicio() {
        
        this.formExercicio.reset();
        this.inputExercicioIndex.value = '';
        
        
        document.getElementById('modalExercicioLabel').textContent = 'Adicionar Exercício';
      
        this.modalExercicio.show();
    }

    /**
    
      @param {number} indice
      @param {Exercicio} exercicio 
     */
    mostrarFormularioEditarExercicio(indice, exercicio) {
        
        this.inputExercicioIndex.value = indice;
        this.inputNomeExercicio.value = exercicio.nome;
        this.inputMaquinaExercicio.value = exercicio.maquina;
        this.inputTempoExercicio.value = exercicio.tempo;
        this.inputSeriesExercicio.value = exercicio.series;
        this.inputRepeticoesExercicio.value = exercicio.repeticoes;
        this.inputDescansoExercicio.value = exercicio.descanso;
        this.inputObservacaoExercicio.value = exercicio.observacao;
        
       
        document.getElementById('modalExercicioLabel').textContent = 'Editar Exercício';
        
        
        this.modalExercicio.show();
    }

    /**
     @returns {Exercicio} 
     */
    obterDadosFormularioExercicio() {
        return new Exercicio(
            this.inputNomeExercicio.value,
            this.inputMaquinaExercicio.value,
            parseInt(this.inputTempoExercicio.value) || 0,
            parseInt(this.inputSeriesExercicio.value) || 0,
            parseInt(this.inputRepeticoesExercicio.value) || 0,
            parseInt(this.inputDescansoExercicio.value) || 0,
            this.inputObservacaoExercicio.value
        );
    }

    /**
     
      @param {Treino} treino 
     */
    preencherFormularioTreino(treino) {
        this.inputNomeTreino.value = treino.nome;
        this.inputDescricaoTreino.value = treino.descricao;
        this.treinoAtualTitulo.textContent = treino.nome || 'Editar Treino';
        this.renderizarExercicios(treino.exercicios);
    }

    
    limparFormularioTreino() {
        this.formTreino.reset();
        this.treinoAtualTitulo.textContent = 'Criar Novo Treino';
        this.renderizarExercicios([]);
    }

    /**
    
      @returns {Object} 
     */
    obterDadosFormularioTreino() {
        return {
            nome: this.inputNomeTreino.value,
            descricao: this.inputDescricaoTreino.value
        };
    }

    /**
      @param {Function} callbackConfirmacao 
     */
    mostrarConfirmacaoExclusao(callbackConfirmacao) {
        
        this.btnConfirmarExclusao.onclick = () => {
            callbackConfirmacao();
            this.modalConfirmacao.hide();
        };
        
        
        this.modalConfirmacao.show();
    }

    
    fecharModalExercicio() {
        this.modalExercicio.hide();
    }

    /**
      @param {string} mensagem 
      @param {string} tipo 
     */
    mostrarAlerta(mensagem, tipo = 'info') {
        
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
        alerta.setAttribute('role', 'alert');
        alerta.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        `;
        
        
        const container = document.querySelector('.container');
        container.insertBefore(alerta, container.firstChild);
        
      
        setTimeout(() => {
            alerta.classList.remove('show');
            setTimeout(() => alerta.remove(), 150);
        }, 3000);
    }
}


class Controlador {
    constructor() {
       
        this.gerenciadorTreinos = new GerenciadorTreinos();
        this.visualizacao = new Visualizacao();
        
        
        this.treinoAtual = null;
        this.treinoAtualId = null;
        this.modoEdicao = false;
        
        
        this.inicializarEventos();
        
        
        this.atualizarInterface();
    }

    
    inicializarEventos() {
      
        document.getElementById('btnNovoTreino').addEventListener('click', () => {
            this.criarNovoTreino();
        });
        
       
        document.getElementById('btnSalvarTreino').addEventListener('click', () => {
            this.salvarTreino();
        });
        
        
        document.getElementById('btnAdicionarExercicio').addEventListener('click', () => {
            this.visualizacao.mostrarFormularioNovoExercicio();
        });
        
        
        document.getElementById('btnSalvarExercicio').addEventListener('click', () => {
            this.salvarExercicio();
        });
        
        s
        this.visualizacao.listaTreinos.addEventListener('click', (evento) => {
            
            if (evento.target.closest('.btn-excluir-treino')) {
                const id = evento.target.closest('.btn-excluir-treino').dataset.id;
                this.confirmarExclusaoTreino(id);
                evento.stopPropagation();
                return;
            }
            
           
            const itemTreino = evento.target.closest('.treino-item');
            if (itemTreino) {
                const id = itemTreino.dataset.id;
                this.selecionarTreino(id);
            }
        });
        
        
        this.visualizacao.listaExercicios.addEventListener('click', (evento) => {
           
            if (evento.target.closest('.btn-editar-exercicio')) {
                const indice = parseInt(evento.target.closest('.btn-editar-exercicio').dataset.indice);
                this.editarExercicio(indice);
                return;
            }
            
          
            if (evento.target.closest('.btn-remover-exercicio')) {
                const indice = parseInt(evento.target.closest('.btn-remover-exercicio').dataset.indice);
                this.confirmarExclusaoExercicio(indice);
                return;
            }
        });
    }

   
    atualizarInterface() {
       
        this.visualizacao.renderizarListaTreinos(
            this.gerenciadorTreinos.treinos,
            this.treinoAtualId
        );
        
       
        if (this.treinoAtual) {
            this.visualizacao.preencherFormularioTreino(this.treinoAtual);
        } else {
            this.visualizacao.limparFormularioTreino();
        }
    }

    
    criarNovoTreino() {
        this.treinoAtual = new Treino('Novo Treino', '');
        this.treinoAtualId = null;
        this.modoEdicao = false;
        this.atualizarInterface();
    }

    /**
    
      @param {string} id 
     */
    selecionarTreino(id) {
        const treino = this.gerenciadorTreinos.obterTreinoPorId(id);
        if (treino) {
            this.treinoAtual = { ...treino };
            this.treinoAtualId = id;
            this.modoEdicao = true;
            this.atualizarInterface();
        }
    }

   
    salvarTreino() {
        
        const dadosTreino = this.visualizacao.obterDadosFormularioTreino();
        
        
        if (!dadosTreino.nome.trim()) {
            this.visualizacao.mostrarAlerta('Por favor, informe um nome para o treino.', 'warning');
            return;
        }
        
       
        this.treinoAtual.nome = dadosTreino.nome;
        this.treinoAtual.descricao = dadosTreino.descricao;
        
        if (this.modoEdicao) {
           
            this.gerenciadorTreinos.atualizarTreino(this.treinoAtualId, this.treinoAtual);
            this.visualizacao.mostrarAlerta('Treino atualizado com sucesso!', 'success');
        } else {
          
            this.gerenciadorTreinos.adicionarTreino(this.treinoAtual);
            this.treinoAtualId = this.treinoAtual.id;
            this.modoEdicao = true;
            this.visualizacao.mostrarAlerta('Treino criado com sucesso!', 'success');
        }
        
        this.atualizarInterface();
    }

    /**
      @param {number} indice 
     */
    editarExercicio(indice) {
        if (this.treinoAtual && this.treinoAtual.exercicios[indice]) {
            const exercicio = this.treinoAtual.exercicios[indice];
            this.visualizacao.mostrarFormularioEditarExercicio(indice, exercicio);
        }
    }

    /**
     * Salva os dados do exercício do formulário
     */
    salvarExercicio() {
        
        if (!this.visualizacao.inputNomeExercicio.value.trim()) {
            alert('Por favor, informe o nome do exercício.');
            return;
        }
        
        
        const exercicio = this.visualizacao.obterDadosFormularioExercicio();
        
        
        const indiceExercicio = this.visualizacao.inputExercicioIndex.value;
        
        if (indiceExercicio !== '') {
            
            this.treinoAtual.atualizarExercicio(parseInt(indiceExercicio), exercicio);
        } else {
           
            this.treinoAtual.adicionarExercicio(exercicio);
        }
        
        
        this.visualizacao.fecharModalExercicio();
        this.visualizacao.renderizarExercicios(this.treinoAtual.exercicios);
    }

    /**
      @param {number} indice 
     */
    confirmarExclusaoExercicio(indice) {
        this.visualizacao.mostrarConfirmacaoExclusao(() => {
            this.treinoAtual.removerExercicio(indice);
            this.visualizacao.renderizarExercicios(this.treinoAtual.exercicios);
        });
    }

    /**
    
      @param {string} id 
     */
    confirmarExclusaoTreino(id) {
        this.visualizacao.mostrarConfirmacaoExclusao(() => {
            this.gerenciadorTreinos.removerTreino(id);
            
            
            if (id === this.treinoAtualId) {
                this.treinoAtual = null;
                this.treinoAtualId = null;
                this.modoEdicao = false;
            }
            
            this.atualizarInterface();
            this.visualizacao.mostrarAlerta('Treino excluído com sucesso!', 'success');
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new Controlador();
});