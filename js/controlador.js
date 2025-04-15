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