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