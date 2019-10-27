let playerScore = 0;
let opponentScore = 0;
let userChoice_div = null;
let button_div = null;
const user1Score_span = document.getElementById("user1-score");
const user2Score_span = document.getElementById("user2-score");
const result_div = document.querySelector(".result > p");

const updateScores = () => {
    user1Score_span.innerHTML = playerScore;
    user2Score_span.innerHTML = opponentScore;
}

const resetButtonGlows = () => {
    ['Rock', 'Scissor', 'Paper'].forEach((choice) => {
        ['gray-glow', 'green-glow', 'red-glow'].forEach((glow) => {
            document.getElementById(choice).classList.remove(glow);
        });
    });
}

const writeEvent = (player) => {
    result_div.innerHTML = player.msg;
    button_div = document.getElementById(player.choice);
   
    if(button_div) {
        resetButtonGlows();
    }

    if(player.result === 'win') {
        button_div.classList.add('green-glow');
        playerScore++;
    }
    else if(player.result === 'lose') {
        button_div.classList.add('red-glow');
        opponentScore++;
    } 

    updateScores();
};

const addGrayGlow = (id) => {
    userChoice_div = document.getElementById(id);
    userChoice_div.classList.add('gray-glow');
}

const addButtonListeners = () => {
    ['Rock', 'Paper', 'Scissor'].forEach((choice) => {
        const button = document.getElementById(choice);
        button.addEventListener('click', () => {
            socket.emit('choice', choice);
            if(userChoice_div) {
                resetButtonGlows();
            }
            addGrayGlow(choice);
        });
    });
};

// Establishes a connection to the server
const socket = io();
socket.on('message', writeEvent);

addButtonListeners();