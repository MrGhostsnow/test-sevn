const API_URL = "https://sevn-pleno-esportes.deno.dev/rounds";
let currentRound = 1;
let totalRounds = 0;
let allRoundsData = [];

document.addEventListener("DOMContentLoaded", () => {
  const gamesContainer = document.getElementById("gamesContainer");
  const prevRoundButton = document.getElementById("prevRound");
  const nextRoundButton = document.getElementById("nextRound");
  const currentRoundDisplay = document.getElementById("currentRound");

  // Função para buscar todas as rodadas da API
  async function fetchRounds() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();

      // Verifica se os dados estão corretos
      console.log("Dados recebidos da API:", data);

      // Armazenar os dados recebidos
      allRoundsData = data;
      totalRounds = data.length; // O total de rodadas é o tamanho do array
      fetchRound(currentRound); // Buscar a primeira rodada
    } catch (error) {
      console.error("Erro ao buscar as rodadas:", error);
    }
  }

  // Função para buscar e exibir uma rodada específica
  function fetchRound(round) {
    // Verifica se o número da rodada é válido
    if (round < 1 || round > totalRounds) {
      console.error("Número de rodada inválido");
      return;
    }

    const roundData = allRoundsData.find((r) => r.round === round);

    if (roundData && roundData.games) {
      displayGames(roundData.games);
      updateRoundDisplay(round);
      updateButtons();
    } else {
      console.error("Dados da rodada incompletos ou indefinidos:", roundData);
    }
  }

  // Função para exibir os jogos na tela
  function displayGames(games) {
    // Limpar jogos antigos antes de adicionar novos
    gamesContainer.innerHTML = "";

    if (games && Array.isArray(games)) {
      games.forEach((game) => {
        const gameElement = document.createElement("div");
        gameElement.classList.add("game");
        gameElement.innerHTML = `
        <div class="game-time">
          <img src="./assets/img/${game.team_home_id}.png" alt="${game.team_home_name}">
          <span>${game.team_home_name}</div> <div class="game-score"><span>${game.team_home_score}</span> X <span>${game.team_away_score}</span></div> <div class="game-time"> <span>${game.team_away_name}</span>
          <img src="./assets/img/${game.team_away_id}.png" alt="${game.team_away_name}">
        </div>
        `;
        gamesContainer.appendChild(gameElement);
      });
    } else {
      console.error("Jogos não encontrados ou inválidos:", games);
    }
  }

  // Função para atualizar o texto da rodada
  function updateRoundDisplay(round) {
    currentRoundDisplay.textContent = `Rodada ${round}`;
  }

  // Função para habilitar/desabilitar os botões
  function updateButtons() {
    prevRoundButton.disabled = currentRound === 1;
    nextRoundButton.disabled = currentRound === totalRounds;
  }

  // Event Listeners para navegação
  prevRoundButton.addEventListener("click", () => {
    if (currentRound > 1) {
      currentRound--;
      fetchRound(currentRound);
    }
  });

  nextRoundButton.addEventListener("click", () => {
    if (currentRound < totalRounds) {
      currentRound++;
      fetchRound(currentRound);
    }
  });

  // Inicializar e buscar todas as rodadas
  fetchRounds();
});
