console.log('Breakout!');

var canvas = document.querySelector('#my-canvas')
var ctx = canvas.getContext('2d')

var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2

var ballRadius = 10

var x = paddleX
var y = canvas.height - (ballRadius * 2)
var dx = 4
var dy = -4

var ballMoving = false

var rightPressed = false
var leftPressed = false

var brickRowCount = 4
var brickColumnCount = 5
var brickWidth = 75
var brickHeight = 20
var brickPadding = 10
var brickOffsetTop = 30
var brickOffsetLeft = 30

var bricks = []
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

var score = 0
var lives = 3

var result = document.querySelector('.gameBoard').firstElementChild

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

// tracks mouse movement for controls

// document.addEventListener('mousemove', mouseMoveHandler, false)
//
// function mouseMoveHandler(event) {
//   var relativeX = event.clientX - canvas.offsetLeft;
//   if (relativeX > 0 && relativeX < canvas.width) {
//     paddleX = relativeX - paddleWidth/2
//   }
// }

function keyDownHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = true
  } else if (event.keyCode == 37) {
    leftPressed = true
  } else if (event.keyCode == 32) {
    ballMoving = true
  }
}

function keyUpHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = false
  } else if (event.keyCode == 37) {
    leftPressed = false
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r]
      // calculations
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score++
          if (score == brickRowCount * brickColumnCount) {
            // set ball back on paddle
            x = paddleX
            y = canvas.height - (ballRadius * 2)
            ballMoving = false
            result.innerHTML = "Win<span class='red'>!</span>"
            result.className = "result"
            setTimeout(function(){
              result.className = "result hide"
              document.location.reload()
            },2000)
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '1em Archivo Black'
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 8, 20)
}

function drawLives() {
  ctx.font = '1em Archivo Black'
  ctx.fillStyle = 'white'
  ctx.fillText('Lives: ' + lives, canvas.width - 75, 20)
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI*2)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, (canvas.height - paddleHeight), paddleWidth, paddleHeight)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.closePath()
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#ef303b'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  drawLives()
  collisionDetection()

  // if ball hits wall, reverse direction
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    // if ball hits paddle reverse direction
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      // remove a life and stop the ball
      ballMoving = false
      lives--
      if (!lives) {
        // if out of lives, game over
        result.innerHTML = "Lose<span class='red'>!</span>"
        result.className = "result"
        setTimeout(function(){
          result.className = "result hide"
          document.location.reload()
        },2000)
        return
      } else {
        // if not out of lives, set ball back on paddle
        x = paddleX
        y = canvas.height - (ballRadius * 2)
        dx = 4
        dy = -4
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }

  // move paddle on left/right key press
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 9
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 9
  }
  // move ball
  if (ballMoving) {
    x += dx
    y += dy
  } else {
    // ball stopped
    x = paddleX + (paddleWidth / 2)
  }
  requestAnimationFrame(draw)
}

draw()
