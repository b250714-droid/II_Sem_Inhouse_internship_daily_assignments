let score = 0;
let timeLeft = 30;
let gameInterval;
let fruitInterval;

const fruit = document.getElementById("fruit");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameArea = document.getElementById("gameArea");

function startGame() {
score = 0;
timeLeft = 30;
scoreDisplay.innerText = score;
timeDisplay.innerText = timeLeft;

```
gameInterval = setInterval(updateTime, 1000);
fruitInterval = setInterval(showFruit, 1000);
```

}

function updateTime() {
timeLeft--;
timeDisplay.innerText = timeLeft;

```
if (timeLeft <= 0) {
    clearInterval(gameInterval);
    clearInterval(fruitInterval);
    fruit.style.display = "none";
    alert("Game Over! Your score: " + score);
}
```

}

function showFruit() {
// Random fruit
let fruits = [
"https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
"https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg"
];

```
let randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
fruit.src = randomFruit;

// Random position
let x = Math.random() * (gameArea.clientWidth - 80);
let y = Math.random() * (gameArea.clientHeight - 80);

fruit.style.left = x + "px";
fruit.style.top = y + "px";
fruit.style.display = "block";
```

}

// Click event
fruit.addEventListener("click", function () {
score++;
scoreDisplay.innerText = score;
fruit.style.display = "none";
});
