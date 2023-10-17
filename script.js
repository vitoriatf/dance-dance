let ACTIVE = null;
const DIRECTIONS = ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"];
const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"]
let POINTS = 0;


const board = document.getElementById("board");
const generator = document.getElementById("new-row-generator");
const playButton = document.getElementById("play-button");
const pointCounter = document.getElementById("points");


const boardTop = board.getBoundingClientRect().top;

const music = new Audio('assets/game-music-new.mp3');
music.volume = 0.5;

const playAudio = (clip) => {
    var audio = new Audio(clip);
    audio.volume = 0.2;
    audio.play();
};

const handleKeyDown = (e) => {
    const directionIndex = DIRECTIONS.findIndex(
        (direction) => direction === e.key
    );
    if(!ACTIVE) return 

    const activeArrow = ACTIVE.getAttribute("data-active");
    if (directionIndex == activeArrow) {
        ACTIVE.children[directionIndex].style.setProperty(
            "--arrow-outline",
            "lightgreen"
        );
        ACTIVE.children[directionIndex].style.setProperty(
            "--arrow-color",
            "lightgreen"
        );
        POINTS++
        pointCounter.innerHTML = `Pontos: ${POINTS}`
        const clip = "./assets/win.wav";
        playAudio(clip);
    } else {
        const clip = "./assets/fail.wav";
        playAudio(clip);
    // ATIVO.children[directionIndex].style.setProperty("--arrow-outline", "red")
    }
};

const createRow = (outineColor, speed) => {
    const newRow = board.cloneNode(true);
    newRow.style.position = "absolute";
    const randomizer = Math.floor(Math.random() * 4);
    newRow.setAttribute("data-active", randomizer);
    for (let i = 0; i < 4; i++) {
        if (i === randomizer) {
            newRow.children[i].style.setProperty("--arrow-outline", outineColor);
        } else {
            newRow.children[i].style.setProperty("--arrow-outline", "transparent");
            newRow.children[i].style.setProperty("--arrow-color", "transparent");
        }
    }
    generator.append(newRow);
    animateRow(newRow, speed);
};

const animateRow = (row, speed) => {
    const rowTop = row.getBoundingClientRect().top;
    const proximity = rowTop - boardTop;

    const LOWER_THRESHOLD = 70;
    const UPPER_THRESHOLD = 90;

    setTimeout(() => {
        ACTIVE = row;
        setTimeout(() => {
            if (ACTIVE === row) {
                ACTIVE = null;
        }
        }, (1/speed)* UPPER_THRESHOLD);
    }, (1/speed) * (proximity - LOWER_THRESHOLD));

    const options = [{ transform: "translateY(-10000px)" }];

    const keyframes = {
        duration: (1/speed)*10000, 
        iterations: Infinity,
    };

    row.animate(options, keyframes);

    setTimeout(() => {
        row.remove();
    }, (1/speed)*10000);
};

const startGame = (speed, interval) => { 
    music.play();
    document.addEventListener("keydown", handleKeyDown);
    setInterval(() => {
        const colorRandomizer = Math.floor(Math.random() * 6);
        const color = COLORS[colorRandomizer];
        createRow(color, speed);
    }, interval);
};

music.addEventListener("ended", () => {
    endGame();
});

const endGame = () => {
    alert(`Fim de jogo! Pontuação final: ${POINTS}`);
    restartGame();
};

const restartGame = () => {
    music.play();
    POINTS = 0;
    pointCounter.innerHTML = "Pontos: 0";
    const oldLines = gerador.getElementsByClassName("row");
    while (oldLines.length > 0) {
        oldLines[0].remove();
    }
    playButton.classList.remove("hidden");
    board.classList.add("hidden");
};


playButton.addEventListener("click", () => {
    playButton.classList.add("hidden");
    board.classList.remove("hidden");
    startGame(0.7, 700);
});