type Alternativas = Record<string, string>;

type Pergunta = {
  questao: number;
  texto_base: string;
  alternativas: Alternativas;
  resposta_correta: string;
  tem_imagem: boolean;
};

type BancoDePerguntas = Record<string, Pergunta[]>;

let bancoPerguntas: BancoDePerguntas = {};
let perguntasRestantes: Pergunta[] = [];
let perguntaAtual: Pergunta | null = null;

let score1 = 0;
let score2 = 0;
let vez = 1;

// Elementos do DOM
const score1El = document.getElementById("score1")!;
const score2El = document.getElementById("score2")!;
const playBtn = document.getElementById("playBtn") as HTMLButtonElement;
const popup = document.getElementById("popup")!;
const questionText = document.getElementById("questionText")!;
const optionsEl = document.getElementById("options")!;
const closeBtn = document.getElementById("closeBtn")!;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

async function carregarPerguntas() {
  const res = await fetch("questions.json");
  bancoPerguntas = await res.json();
  reiniciarJogo();
}

function reiniciarJogo() {
  perguntasRestantes = Object.values(bancoPerguntas).flat();
  shuffle(perguntasRestantes);
  score1 = 0;
  score2 = 0;
  score1El.textContent = score1.toString();
  score2El.textContent = score2.toString();
  vez = 1;
}

function shuffle(array: Pergunta[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function mostrarPergunta() {
  if (perguntasRestantes.length === 0) {
    alert("Nenhuma pergunta restante! O jogo será reiniciado.");
    reiniciarJogo();
    return;
  }

  perguntaAtual = perguntasRestantes.pop()!;
  questionText.textContent = perguntaAtual.texto_base;
  optionsEl.innerHTML = "";

  for (const [letra, texto] of Object.entries(perguntaAtual.alternativas)) {
    const btn = document.createElement("button");
    btn.textContent = `${letra}) ${texto}`;
    btn.onclick = () => responder(btn, letra);
    optionsEl.appendChild(btn);
  }

  popup.style.display = "flex";
}

function responder(botao: HTMLButtonElement, letra: string) {
  if (!perguntaAtual) return;

  const correta = letra === perguntaAtual.resposta_correta;
  const botoes = optionsEl.querySelectorAll("button");

  botoes.forEach(btn => {
    btn.disabled = true;

    const letraBotao = btn.textContent?.charAt(0);

    if (letraBotao === perguntaAtual!.resposta_correta) {
      btn.classList.add("correct");
    }

    if (btn === botao && letraBotao !== perguntaAtual!.resposta_correta) {
      btn.classList.add("wrong");
    }
  });

  if (correta) {
    if (vez === 1) {
      score1++;
      score1El.textContent = score1.toString();
    } else {
      score2++;
      score2El.textContent = score2.toString();
    }
  }

  vez = vez === 1 ? 2 : 1;
}

function configurarBotoesDePonto() {
  const addBtns = document.querySelectorAll(".add");
  const removeBtns = document.querySelectorAll(".remove");

  addBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const player = Number((btn as HTMLButtonElement).dataset.player);
      if (player === 1) {
        score1++;
        score1El.textContent = score1.toString();
      } else {
        score2++;
        score2El.textContent = score2.toString();
      }
    });
  });

  removeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const player = Number((btn as HTMLButtonElement).dataset.player);
      if (player === 1 && score1 > 0) {
        score1--;
        score1El.textContent = score1.toString();
      } else if (player === 2 && score2 > 0) {
        score2--;
        score2El.textContent = score2.toString();
      }
    });
  });
}

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

playBtn.addEventListener("click", mostrarPergunta);
resetBtn.addEventListener("click", reiniciarJogo);

carregarPerguntas();
configurarBotoesDePonto();
