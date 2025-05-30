"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let questions = [];
let currentQuestion = null;
let score1 = 0;
let score2 = 0;
let turn = 1; // alterna entre jogador 1 e 2
const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");
const playBtn = document.getElementById("playBtn");
const popup = document.getElementById("popup");
const questionText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const closeBtn = document.getElementById("closeBtn");
function loadQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("questions.json");
        questions = yield res.json();
    });
}
function showQuestion() {
    if (questions.length === 0)
        return;
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    // Exibe a pergunta
    questionText.textContent = currentQuestion.question;
    optionsEl.innerHTML = "";
    // Cria os botões de resposta
    currentQuestion.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => handleAnswer(btn);
        optionsEl.appendChild(btn);
    });
    popup.style.display = "flex";
}
function handleAnswer(button) {
    if (!currentQuestion)
        return;
    const isCorrect = button.textContent === currentQuestion.answer;
    const buttons = optionsEl.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === (currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.answer)) {
            btn.classList.add("correct");
        }
        else if (btn === button) {
            btn.classList.add("wrong");
        }
    });
    // Atualiza a pontuação do jogador da vez
    if (isCorrect) {
        if (turn === 1) {
            score1++;
            score1El.textContent = score1.toString();
        }
        else {
            score2++;
            score2El.textContent = score2.toString();
        }
    }
    // Alterna o turno
    turn = turn === 1 ? 2 : 1;
}
function setupManualButtons() {
    const addButtons = document.querySelectorAll(".add");
    const removeButtons = document.querySelectorAll(".remove");
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const player = Number(btn.dataset.player);
            if (player === 1) {
                score1++;
                score1El.textContent = score1.toString();
            }
            else {
                score2++;
                score2El.textContent = score2.toString();
            }
        });
    });
    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const player = Number(btn.dataset.player);
            if (player === 1 && score1 > 0) {
                score1--;
                score1El.textContent = score1.toString();
            }
            else if (player === 2 && score2 > 0) {
                score2--;
                score2El.textContent = score2.toString();
            }
        });
    });
}
// Botões principais
playBtn.addEventListener("click", showQuestion);
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});
// Inicialização
loadQuestions();
setupManualButtons();
