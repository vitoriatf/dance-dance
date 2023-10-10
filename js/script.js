
// Bliss por Luke Bergs | https://soundcloud.com/bergscloud/
// Creative Commons - Atribuição-CompartilhaIgual 3.0 Não Adaptada
// https://creativecommons.org/licenses/by-sa/3.0/
// Música promovida por https://www.chosic.com/free-music/all/

let ATIVO = null;  // Ativo
const DIRECOES = ["SetaEsquerda", "SetaCima", "SetaBaixo", "SetaDireita"];
const CORES = ["vermelho", "laranja", "amarelo", "verde", "azul", "roxo"];  // Cores
let PONTOS = 0;

// const arrowTemplate = document.getElementById("arrow-template");
// const arrowPanel = document.getElementById("primary");

const quadro = document.getElementById("board");
const gerador = document.getElementById("new-row-generator");
const botaoPlay = document.getElementById("play-button");
const contadorPontos = document.getElementById("points");  // Contador de Pontos

const topoQuadro = quadro.getBoundingClientRect().top;

const reproduzirAudio = (clip) => {
    var audio = new Audio(clip);
    audio.play();
};

const lidarComPressionamentoTecla = (e) => {
    const indiceDirecao = DIRECOES.findIndex(
        (direcao) => direcao === e.key
    );
    if(!ATIVO) return 

    const setaAtiva = ATIVO.getAttribute("data-active");
    if (indiceDirecao == setaAtiva) {
        ATIVO.children[indiceDirecao].style.setProperty(
            "--arrow-outline",
            "lightgreen"
        );
        ATIVO.children[indiceDirecao].style.setProperty(
            "--arrow-color",
            "lightgreen"
        );
        PONTOS++
        contadorPontos.innerHTML = `Pontos: ${PONTOS}`
        const clip = "./assets/win.wav";
        reproduzirAudio(clip);
    } else {
        const clip = "./assets/fail.wav";
        reproduzirAudio(clip);
    }
};

const criarLinha = (corExterna, velocidade) => {
    const novaLinha = quadro.cloneNode(true);
    novaLinha.style.position = "absolute";
    const aleatorizador = Math.floor(Math.random() * 4);
    novaLinha.setAttribute("data-active", aleatorizador);
    for (let i = 0; i < 4; i++) {
        if (i === aleatorizador) {
            novaLinha.children[i].style.setProperty("--arrow-outline", corExterna);
        } else {
            novaLinha.children[i].style.setProperty("--arrow-outline", "transparent");
            novaLinha.children[i].style.setProperty("--arrow-color", "transparent");
        }
    }
    gerador.append(novaLinha);
    animarLinha(novaLinha, velocidade);
};

const animarLinha = (linha, velocidade) => {
    const topoLinha = linha.getBoundingClientRect().top;
    const proximidade = topoLinha - topoQuadro;

    const LIMIAR_INFERIOR = 70;
    const LIMIAR_SUPERIOR = 90;

    setTimeout(() => {
        ATIVO = linha;
        setTimeout(() => {
            if (ATIVO === linha) {
                ATIVO = null;
        }
        }, (1/velocidade)* LIMIAR_SUPERIOR);
    }, (1/velocidade) * (proximidade - LIMIAR_INFERIOR));

    const opcoes = [{ transform: "translateY(-10000px)" }];

    const quadrosChave = {
        duration: (1/velocidade)*10000, // 1 pixel a cada 2 milissegundos
        iterations: Infinity,
    };

    linha.animate(opcoes, quadrosChave);

    setTimeout(() => {
        linha.remove();
    }, (1/velocidade)*10000);
};

const iniciarJogo = (velocidade, intervalo) => { // velocidade = pixels por milissegundo
    const clip = "./assets/game-music-new.mp3";
    reproduzirAudio(clip);
    document.addEventListener("keydown", lidarComPressionamentoTecla);
    setInterval(() => {
        const aleatorizadorCor = Math.floor(Math.random() * 6);
        const cor = CORES[aleatorizadorCor];
        criarLinha(cor, velocidade);
    }, intervalo);
};

botaoPlay.addEventListener("click", () => {
    botaoPlay.classList.add("hidden");
    quadro.classList.remove("hidden");
    iniciarJogo(0.7, 700);
});
