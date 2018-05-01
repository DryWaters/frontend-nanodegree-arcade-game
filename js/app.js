
// IIFE to hide from global scope
;(function (global) {

  // Enemies our player must avoid
  var Enemy = function () {

    // these values are the constant Y values
    // that are equal to the values of the
    // rock blocks
    this.enemyStartY = [143, 226, 309];
    this.enemyStartX = -100;
    this.sprite = 'images/enemy-bug.png';
    this.initEnemy();
  };

  // Parameter: dt, a time delta between ticks
  Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt;

    // if enemy runs off the screen
    // then reset themselves back to the left
    if (this.x >= 500) {
      this.initEnemy();
    }
    // if player collides remove a heart
    // and reset them back to beginning
    if (this.hasCollision()) {
      player.reset();
      removeHeart();
    }
  };

  // check collision with player and enemy
  // by finding the absolute difference between
  // the two characters which sould be  
  // less than half the width/height of a block
  Enemy.prototype.hasCollision = function () {
    if (
      Math.abs(this.x - player.x) < 60 &&
      Math.abs(this.y - player.y) < 40
    ) {
      score.updateScore(-5);
      return true;
    }
  }

  // Set the enemy random starting location and speed
  Enemy.prototype.initEnemy = function () {
    // the base speed is 200
    this.speed = Math.floor(Math.random() * 200) + 200;
    
    // multiple by -1 to move the enemies slightly off the screen
    this.x = (Math.floor(Math.random() * 300) * -1) + this.enemyStartX;
    this.y = this.enemyStartY[Math.floor(Math.random() * this.enemyStartY.length)];
  }

  // Draw the enemy on the screen
  Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  // Player object
  var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.init();
  }

  // reset the player if they collide
  // with enemy or make it to the end
  Player.prototype.init = function () {
    this.x = 202;
    this.y = 458;
  }

  // if player makes it to the end
  // then recreate the gems
  Player.prototype.reset = function () {
    gems.forEach(function (gem) {
      gem.init();
    });
    this.init();
  };

  Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // handles the keyboard input
  // adding 10 to the score if they
  // make it to the end 
  Player.prototype.handleInput = function (keyNum) {
    switch (keyNum) {
      case 'left': {
        if (this.x > 100) {
          this.x -= 101;
        }
        return;
      }
      case 'right': {
        if (this.x < 400) {
          this.x += 101;
        }
        return;
      }
      case 'up': {
        if (this.y < 200) {
          score.updateScore(10);
          this.reset();
          return;
        }
        this.y -= 83;
        return;
      }
      case 'down': {
        if (this.y < 400) {
          this.y += 83;
        }
        return;
      }
    }
  }

  // Heart object used to display
  // the number of lives the player has left
  // They start with 3 lives.
  var Heart = function (x) {
    this.x = x;
    this.y = 40;
    this.sprite = 'images/Heart.png'
  }

  Heart.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Score object used to display
  // the players current score
  // This object also keeps track of how 
  // many gems they have collected.
  var Score = function () {
    this.score = 0;
    this.greenGems = 0;
    this.blueGems = 0;
    this.orangeGems = 0;
  }

  // reset function if player wants
  // to play again
  Score.prototype.init = function () {
    this.score = 0;
    this.greenGems = 0;
    this.blueGems = 0;
    this.orangeGems = 0;
  }

  Score.prototype.render = function () {
    ctx.font = 'bold 40px Arial';
    ctx.fillText(this.score, 0, 120);
  }

  Score.prototype.updateScore = function (score) {
    this.score += score;
  }

  // Gems object that is used to
  // increase the players score
  // they randomly appear and move
  // around randomly
  var Gem = function () {
    this.inPlay = true;
    this.init();
  }

  Gem.prototype.init = function () {
    this.inPlay = true;
    this.gemSprites = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
    this.sprite = this.gemSprites[Math.floor(Math.random() * this.gemSprites.length)];
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = 134 + Math.floor(Math.random() * 3) * 83;
  }

  Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Gems are randomly moved if 1/1000th chance
  // on every update
  // Gem points are setup as 
  // green = 200
  // blue = 100
  // orange = 50
  // If player makes it across to the
  // other side the gems reappear by 
  // updating the "inPlay" property
  Gem.prototype.update = function () {
    if (this.inPlay) {
      if (Math.floor(Math.random() * 1000) === 500) {
        this.init();
      }
      if (this.hasCollision()) {
        if (this.sprite === 'images/gem-blue.png') {
          score.blueGems++;
          score.updateScore(100);
        } else if (this.sprite === 'images/gem-green.png') {
          score.greenGems++;
          score.updateScore(200);
        } else {
          score.orangeGems++;
          score.updateScore(50);
        }
        this.removeGem();
      }
    }
  }

  // if player picks up the gem
  // do not allow it to reappear
  Gem.prototype.hasCollision = function () {
    if (
      Math.abs(this.x - player.x) < 50 &&
      Math.abs(this.y - player.y) < 41
    ) {
      return true;
    }
  }

  // remove the gem by moving it off the page
  // instead of recreating the object
  Gem.prototype.removeGem = function () {
    this.x = 1000;
    this.inPlay = false;
  }

  // This listens for key presses and sends the keys to your
  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function (e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  });

  function removeHeart() {
    if (hearts.length > 0) {
      hearts.pop();
      if (hearts.length === 0) {
        gameOver();
      }
    }
  }

  // function for when player runs out of hearts
  // 1.  it updates the local storage high score (if needed)
  // 2.  stops the updating of the game by changing the 
  //     isRunning variable within the "Engine"
  // 3.  it removes gems and enemies
  // 4.  Displays modal after updating the score/highscore
  function gameOver() {
    processHighScore();
    allEnemies.forEach(function (enemy) {
      enemy.initEnemy();
    });
    gems.forEach(function (gem) {
      gem.removeGem();
    });
    document.querySelector('.modal__score').textContent = `Final Score: ${score.score}`;
    document.querySelector('.modal__background').style.display = "block";
    displayGems();
    stopGame();
  }

  // displays the number of gems the player collected on the
  // game over modal
  function displayGems() {
    document.querySelector('.modal__gems__green').textContent = score.greenGems;
    document.querySelector('.modal__gems__blue').textContent = score.blueGems;
    document.querySelector('.modal__gems__orange').textContent = score.orangeGems;
  }

  // function that updates the local storage high score (if available)
  // depending on if the player beats the high score, a different message
  // is displayed
  function processHighScore() {
    if (localStorage === undefined) {
      document.querySelector('.modal__message').textContent = 'Sorry, local storage is not enabled';
      return;
    }

    let currentHighScore;

    // check if the highscore variable has not be saved yet (first time playing)
    if (localStorage.getItem('highScore') !== null) {
      currentHighScore = Number.parseInt(localStorage.getItem('highScore'));
    } else {
      currentHighScore = score.score;
    }

    if (score.score >= currentHighScore) {
      createPositiveMessage(score.score);
      localStorage.setItem('highScore', ""+score.score);
    } else {
      createNegativeMessage(currentHighScore);
    }
  }

  function createPositiveMessage(score) {
    document.querySelector('.modal__message').textContent = `Nice!  You got the new High Score!`;
    document.querySelector('.modal__highscore').textContent = `High Score:  ${score}`;
  }

  function createNegativeMessage(score) {
    document.querySelector('.modal__message').textContent = `Keep trying!!`;
    document.querySelector('.modal__highscore').textContent = `High Score:  ${score}`;

  }

  // resets the hearts back to 3 when player wants to play again
  function resetHearts() {
    hearts = [heart1, heart2, heart3];
  }

  // resets the gems when player wants to play again
  function resetGems() {
    gems.forEach(function (gem) {
      gem.init();
    });
  }

  // starts the game back when player wants to play again
  function resetGame() {
    score.score = 0;
    player.init();
    score.init();
    document.querySelector('.modal__background').style.display = "none";
    resetHearts();
    resetGems();
    reset();
  }

  // Objects created
  const enemy1 = new Enemy();
  const enemy2 = new Enemy();
  const enemy3 = new Enemy();

  // The argument is the Heart's X value
  const heart1 = new Heart(400);
  const heart2 = new Heart(300);
  const heart3 = new Heart(200);
  const gem1 = new Gem();
  const gem2 = new Gem();
  const gem3 = new Gem();

  // objects that are shown to the global name space
  // this access is needed by the "Engine" to properly
  // render/update the objects
  global.hearts = [heart1, heart2, heart3];
  global.allEnemies = [enemy1, enemy2, enemy3];
  global.gems = [gem1, gem2, gem3];
  global.score = new Score();
  global.player = new Player();
  global.resetGame = resetGame;

})(this);

// attach a listener that will randomly change the background
// color of the modal on hover
// (colors are the colors of the gems)
(function randomButtonColor () {
  let button = document.querySelector('.modal__button');
  button.addEventListener('mouseover', function(event) {
    const colors = ['orange', 'blue', 'green'];
    this.className = `${colors[Math.floor(Math.random() * colors.length)]}-gem modal__button`;
  });
})();