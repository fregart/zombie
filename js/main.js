// declare arrays and variables
var houseArray = []; // to hold uninfected and infected houses
var zombieArray = []; // number of zombies
var runsArray = []; // to store game running times
var gameRunCounter = 0; // game run counter
var t0; // start game running time
var t1; // end game running time
const button = document.querySelector("button"); // set button

window.onload = function() {
  // check localstorage if game is running and if it is
  // get game data from localstorage
  var isGameRunning = localStorage.getItem("isGameRunning");
  if (isGameRunning == true) {
    // retrieve stored data
    var storedHouseData = localStorage.getItem("houseArrayData ");
    var storedZombieData = localStorage.getItem("zombieArrayData ");
    var storedRunsData = localStorage.getItem("runsArrayData ");

    // convert stored data back to houseArray, zombieArray and runsArray
    if (storedHouseData) {
      houseArray = JSON.parse(storedHouseData);
      zombieArray = JSON.parse(storedZombieData);
      runsArray = JSON.parse(storedRunsData);

      // run the game and render based on arrays
      runGame();
    }
  } else {
    // enable run button if game is not running
    button.disabled = false;
  }
};

// start fresh run
function init() {
  // clear localstorage at start
  clearLocalStorage();

  // add one to counter and store it in localstorage
  gameRunCounter++;
  localStorage.setItem("gameRuns", gameRunCounter);
  var statRuns = document.getElementById("statRunsDiv");
  statRuns.innerHTML = gameRunCounter;

  // disable run button on game start
  button.disabled = true;

  // store stat that game is now running
  localStorage.setItem("isGameRunning", true);

  // fill houseArray with 100 houses
  for (var i = 1; i <= 100; i++) {
    houseArray.push("uninfected");
  }

  // fill zombieArray with 1 zombie
  zombieArray.push(1);

  // start timer and run game
  t0 = performance.now();
  runGame();
}

// run the game with 0.5 sec delay
function runGame() {
  setTimeout(runGame2, 500);
}

// run game
function runGame2() {
  // clear the zombie and house div before rendering them
  clearDivs();

  // render zombies and houses
  renderZombies();
  renderHouses();

  // check if all 100 houses are infected
  // zombieArray is 101 since one zombie exist at start
  if (zombieArray.length < 101) {
    zombieVisit();
  } else {
    // end timer and store value in localstorage
    var t1 = performance.now();
    var time = t1 - t0;
    time = time / 1000;
    time = time.toFixed(2);
    runsArray.push(time);
    localStorage.setItem("runsArrayData", JSON.stringify(runsArray));

    // check if game has run 10 times
    if (gameRunCounter < 10) {
      // clear arrays and run game again
      houseArray = [];
      zombieArray = [];
      init();
    } else {
      // store value that game is not running
      localStorage.setItem("isGameRunning", false);

      // enable run button
      button.disabled = false;

      // print out the game stats and averege time
      for (let i = 0; i < runsArray.length; i++) {
        var statel = document.getElementById("run" + i);
        statel.innerHTML = runsArray[i];
      }

      var avg;
      var aveTime = document.getElementById("run10");
      //avg = calcAverage(runsArray);
      aveTime.innerHTML = avg + " seconds";

      // clear game runs
      runsArray = [];

      // clear counter and remove it from localstorage
      gameRunCounter = 0;
      localStorage.removeItem("runsArrayData");

      alert("10 game runs complete!\n now showing stats");
    }
  }
}

// render zombies
function renderZombies() {
  for (i = 0; i < zombieArray.length; i++) {
    // if number of zombies is 10 add break
    // to make a new row
    if (i % 10 === 0) {
      var newDiv = document.createElement("div");
      var br = document.createElement("br");
    } else {
      var newDiv = document.createElement("div");
    }

    newDiv.classList.add("zombie");

    if (typeof br != "undefined") {
      // add the zombie element with break
      var currentDiv = document.getElementById("zombieDiv");
      currentDiv.appendChild(newDiv);
      currentDiv.appendChild(br);
    } else {
      // add the zombie element without break
      var currentDiv = document.getElementById("zombieDiv");
      currentDiv.appendChild(newDiv);
    }
  }
  // store the current stat of zombies to localstorage
  localStorage.setItem("zombieArrayData", JSON.stringify(zombieArray));
}

// render houses
function renderHouses() {
  for (i = 0; i < houseArray.length; i++) {
    // if number of houses is 10 add break
    // to make a new row
    if (i % 10 === 0) {
      var newDiv = document.createElement("div");
      var br = document.createElement("br");
    } else {
      var newDiv = document.createElement("div");
    }

    // check if house is infected and render correct color
    if (houseArray[i].includes("uninfected")) {
      // create a new uninfected house element
      newDiv.classList.add("house");
      newDiv.classList.add("uninfected");
    } else {
      // create a new infected house element
      newDiv.classList.add("house");
      newDiv.classList.add("infected");
    }

    // add houses to houseDiv
    if (typeof br != "undefined") {
      // add the house element with break
      var currentDiv = document.getElementById("houseDiv");
      currentDiv.appendChild(newDiv);
      currentDiv.appendChild(br);
    } else {
      // add the house element without break
      var currentDiv = document.getElementById("houseDiv");
      currentDiv.appendChild(newDiv);
    }
  }
  // store the current stat of houses to localstorage
  localStorage.setItem("houseArrayData", JSON.stringify(houseArray));
}

// zombies visit a random house
// if the house is uninfected, infect the house and add to houseArray
// add a new zombie to zombieArray
function zombieVisit() {
  for (i = 0; i < zombieArray.length; i++) {
    var rand = Math.floor(Math.random() * houseArray.length);
    if (houseArray[rand] == "uninfected") {
      houseArray.splice(rand, 1, "infected");
      zombieArray.push(1);
    }
  }
  runGame();
}

// clear the zombie and house divs
function clearDivs() {
  var cleareZombieDiv = document.getElementById("zombieDiv");
  var cleareHouseDiv = document.getElementById("houseDiv");
  while (cleareZombieDiv.hasChildNodes()) {
    cleareZombieDiv.removeChild(cleareZombieDiv.lastChild);
  }
  while (cleareHouseDiv.hasChildNodes()) {
    cleareHouseDiv.removeChild(cleareHouseDiv.lastChild);
  }
}

// clear localstorage
function clearLocalStorage() {
  localStorage.removeItem("houseArrayData");
  localStorage.removeItem("zombieArrayData");
  localStorage.removeItem("isGameRunning");
}