let number;
let power;
let credits = 0;
let timer = null;
let timeLeft;
let scanCount = 0;
let scanLog = [];

const wins = Number(localStorage.getItem("wins")) || 0;
const gamesPlayed = Number(localStorage.getItem("gamesPlayed")) || 0;

/* ELEMENTS */

const bootScreen = document.getElementById("bootScreen");
const bootProgress = document.getElementById("bootProgress");

const playerScreen = document.getElementById("playerScreen");
const container = document.querySelector(".container");

const guessInput = document.getElementById("guess");

const livesText = document.getElementById("lives");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");

const message = document.getElementById("message");
const radarFill = document.getElementById("radarFill");
const signalStrength = document.getElementById("signalStrength");

const directionText =
document.getElementById("directionText");

const historyBox =
document.getElementById("history");

const highScoreText =
document.getElementById("highScore");

const winsText =
document.getElementById("wins");

const gamesPlayedText =
document.getElementById("gamesPlayed");

const winModal =
document.getElementById("winModal");

const loseModal =
document.getElementById("loseModal");

const playAgainBtn =
document.getElementById("playAgain");

const retryBtn =
document.getElementById("retryBtn");

const achievementList =
document.getElementById("achievementList");

/* ------------------ */
/* BOOT SCREEN */
/* ------------------ */

window.addEventListener("load", () => {

let progress = 0;

const boot = setInterval(() => {

progress += 10;

bootProgress.style.width =
progress + "%";

if(progress >= 100){

clearInterval(boot);

setTimeout(() => {

bootScreen.classList.add("hidden");

playerScreen.classList.remove("hidden");

},500);

}

},150);

});

/* ------------------ */
/* START BUTTON */
/* ------------------ */

document
.getElementById("startBtn")
.addEventListener("click", () => {

const playerName =
document
.getElementById("playerName")
.value
.trim();

if(playerName === ""){

alert("Enter Commander Name");

return;

}

localStorage.setItem(
"playerName",
playerName
);

playerScreen.classList.add("hidden");

container.classList.remove("hidden");

document.getElementById(
"welcome"
).innerText =
"COMMANDER " +
playerName.toUpperCase();

updateStats();

startMission();

});

/* ------------------ */
/* START MISSION */
/* ------------------ */

function startMission(){

clearInterval(timer);

winModal.classList.add("hidden");
loseModal.classList.add("hidden");

scanCount = 0;
scanLog = [];

historyBox.innerHTML =
"NO SCANS YET";

guessInput.value = "";

message.innerText =
"SYSTEM READY";

directionText.innerText =
"AWAITING SCAN";

radarFill.style.width = "0%";
signalStrength.innerText = "0%";

let level =
document
.getElementById("difficulty")
.value;

if(level === "easy"){

number =
Math.floor(Math.random()*50)+1;

power = 10;
timeLeft = 60;

}

else if(level === "medium"){

number =
Math.floor(Math.random()*100)+1;

power = 7;
timeLeft = 45;

}

else{

number =
Math.floor(Math.random()*500)+1;

power = 5;
timeLeft = 30;

}

livesText.innerText = power;
timerText.innerText = timeLeft;

timer = setInterval(() => {

timeLeft--;

timerText.innerText = timeLeft;

if(timeLeft <= 0){

clearInterval(timer);

missionFailed();

}

},1000);

console.log(
"SECRET NUMBER:",
number
);

}

/* ------------------ */
/* SCAN */
/* ------------------ */

function performScan(){

const guess =
Number(
guessInput.value
);

if(!guess) return;

scanCount++;

scanLog.push(
`SCAN #${scanCount} → ${guess}`
);

historyBox.innerHTML =
scanLog.join("<br>");

const diff =
Math.abs(
number - guess
);

/* Dynamic radar */

let maxRange;

const level =
document
.getElementById("difficulty")
.value;

if(level === "easy"){

maxRange = 50;

}

else if(level === "medium"){

maxRange = 100;

}

else{

maxRange = 500;

}

let strength =
Math.round(
100 -
(diff / maxRange) * 100
);

strength =
Math.max(
0,
Math.min(100,strength)
);

radarFill.style.width =
strength + "%";

signalStrength.innerText =
strength + "%";

/* Direction */

if(guess < number){

directionText.innerText =
"SIGNAL INCREASING ↑";

wrongScan();

}

else if(guess > number){

directionText.innerText =
"SIGNAL DECREASING ↓";

wrongScan();

}

else{

missionSuccess();

}

guessInput.value = "";

}

/* ------------------ */
/* WRONG */
/* ------------------ */

function wrongScan(){

container.classList.add(
"shake"
);

setTimeout(() => {

container.classList.remove(
"shake"
);

},300);

power--;

livesText.innerText =
power;

message.innerText =
"SCAN FAILED";

if(power <= 0){

missionFailed();

}

}

/* ------------------ */
/* SUCCESS */
/* ------------------ */

function missionSuccess(){

clearInterval(timer);

credits += 100;

scoreText.innerText =
credits;

message.innerText =
"TARGET ACQUIRED";

let totalWins =
(Number(localStorage.getItem("wins")) || 0) + 1;

localStorage.setItem(
"wins",
totalWins
);

let highScore =
Number(
localStorage.getItem(
"highscore"
)
) || 0;

if(credits > highScore){

localStorage.setItem(
"highscore",
credits
);

}

unlockAchievements(
totalWins
);

updateStats();

winModal.classList.remove(
"hidden"
);

}

/* ------------------ */
/* FAILED */
/* ------------------ */

function missionFailed(){

clearInterval(timer);

message.innerText =
"SIGNAL LOST";

loseModal.classList.remove(
"hidden"
);

}

/* ------------------ */
/* ACHIEVEMENTS */
/* ------------------ */

function unlockAchievements(
totalWins
){

let achievements = [];

if(totalWins >= 1){

achievements.push(
"🏆 FIRST CONTACT"
);

}

if(totalWins >= 10){

achievements.push(
"🏆 SIGNAL MASTER"
);

}

if(scanCount === 1){

achievements.push(
"🏆 LUCKY SCAN"
);

}

if(power === 1){

achievements.push(
"🏆 SURVIVOR"
);

}

if(achievements.length === 0){

achievements.push(
"NONE UNLOCKED"
);

}

achievementList.innerHTML =
achievements
.map(
a => `<li>${a}</li>`
)
.join("");

}

/* ------------------ */
/* STATS */
/* ------------------ */

function updateStats(){

winsText.innerText =
localStorage.getItem("wins")
|| 0;

gamesPlayedText.innerText =
localStorage.getItem(
"gamesPlayed"
) || 0;

highScoreText.innerText =
localStorage.getItem(
"highscore"
) || 0;

}

/* ------------------ */
/* ENTER TO SCAN */
/* ------------------ */

guessInput.addEventListener(
"keydown",
(e) => {

if(e.key === "Enter"){

performScan();

}

}
);

/* ------------------ */
/* PLAY AGAIN */
/* ------------------ */

playAgainBtn.addEventListener(
"click",
() => {

startMission();

}
);

retryBtn.addEventListener(
"click",
() => {

startMission();

}
);

/* ------------------ */
/* DIFFICULTY */
/* ------------------ */

document
.getElementById("difficulty")
.addEventListener(
"change",
() => {

if(
!container.classList.contains(
"hidden"
)
){

startMission();

}

}
);

/* ------------------ */
/* THEME */
/* ------------------ */

document
.getElementById("themeBtn")
.addEventListener(
"click",
() => {

document.body
.classList.toggle("dark");

}
);