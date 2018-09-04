/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb", "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let openCards = [];
let moves = 0;
let interval = 0;
let gameInterval = 0;
let stars = 3;
const maxCards = 16;

/**
 * Starts the game as soon as the user loads the page
 */
document.addEventListener("DOMContentLoaded", function (event) {
    initGame();
});

/*
 * Display the cards on the page
 *   - initialize some variables
 *   - resets the cards, moves and stars
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 *   - start time count
 *   - updates UI
 */
function initGame() {
    interval = 0;
    stars = 3;

    resetOpenCards();
    resetMoves();
    resetStars();

    let shuffledCards = shuffle(cards);
    shuffledCards.forEach(createHTML);

    startTimeCount();

    document.querySelector(".seconds").textContent = interval;
    document.querySelector(".moves").textContent = moves;
}

function resetOpenCards() {
    openCards = [];
}

/**
 * Updates the UI each second to show the total time of gameplay in seconds
 */
function startTimeCount() {
    gameInterval = setInterval(function () { interval++; document.querySelector(".seconds").textContent = interval; }, 1000);
}

/**
 * Resets all starts to original state
 */
function resetStars() {
    document.querySelectorAll(".far.fa-star").forEach(function (element, index) { element.setAttribute("class", "fa fa-star") });
}

/**
 * Create the HTML for the card
 * @param {*card name} value 
 */
function createHTML(value) {
    let i = document.createElement("i");
    let li = document.createElement("li");
    let ul = document.querySelector(".deck");
    i.setAttribute("class", "fa " + value);
    li.appendChild(i);
    li.setAttribute("class", "card");
    ul.appendChild(li);
    li.addEventListener("click", clickListener);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function clickListener(e) {
    console.log(e.target);
    openCard(e.target);
    addCardToList(e.target);
}

function openCard(element) {
    element.setAttribute("class", "card open reveal");
}

/**
 * Add card to list and check for a match. If positive, also checks if the game is finished. 
 * @param {*} element 
 */
function addCardToList(element) {
    openCards.push(element);
    if (openCards.length == 2) {
        if (openCards[0].isEqualNode(openCards[1])) {
            openCards[0].removeEventListener("animationend", animationEndCallback);
            openCards[1].removeEventListener("animationend", animationEndCallback);
            lockCards(openCards[0], openCards[1]);
            if (isFinished()) {
                console.log("Game Over");
                clearInterval(gameInterval);
                document.querySelector(".finalMoves").textContent = moves;
                document.querySelector(".finalStars").textContent = stars;
                document.querySelector(".finalSeconds").textContent = interval;
                $("#winModal").modal();
            }
        } else {
            incrementMoves();
            rateStar();
            openCards[0].addEventListener("animationend", animationEndCallback);
            openCards[0].setAttribute("class", "card error");
            openCards[1].setAttribute("class", "card error");
        }
    }
}

function isFinished() {
    return document.getElementsByClassName("match").length === maxCards;
}

function animationEndCallback() {
    resetCards(openCards);
    resetOpenCards();
}


function restartGame() {
    openCards = [];
    cardList = document.querySelectorAll(".card");
    deck = document.querySelector(".deck");
    cardList.forEach((value) => {
        deck.removeChild(value);
    });
    initGame();
}

function lockCards(cardOne, cardTwo) {
    cardOne.setAttribute("class", "card match");
    cardTwo.setAttribute("class", "card match");
    incrementMoves();
    rateStar();
    resetOpenCards();
}

function resetCards(openCards) {
    if (openCards[0] != undefined) {
        openCards[0].setAttribute("class", "card");
    }
    if (openCards[1] != undefined) {
        openCards[1].setAttribute("class", "card");
    }
}

function incrementMoves() {
    moves++;
    document.querySelector(".moves").textContent = moves;
}

function rateStar() {
    if (moves === 11) {
        stars--;
        document.querySelectorAll(".fa.fa-star")[2].setAttribute("class", "far fa-star")
    } else if (moves === 16) {
        stars--;
        document.querySelectorAll(".fa.fa-star")[1].setAttribute("class", "far fa-star")
    }
}

function resetMoves() {
    moves = 0;
}
