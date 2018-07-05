console.log('Breakout!');

var canvas = document.querySelector('#my-canvas')
var ctx = canvas.getContext('2d')

var x = canvas.width/2
var y = canvas.height-30
var dx = 2
var dy = -2
var ballRadius = 10

var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width-paddleWidth)/2

var rightPressed = false
var leftPressed = false

var brickRowCount = 3
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
    bricks[c][r] = { x: 0, y: 0}
  }
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r].x = 0
      bricks[c][r].y = 0
      ctx.beginPath()
      ctx.rect(0, 0, brickWidth, brickHeight)
      ctx.fillStyle = '#ef303b'
      ctx.fill()
      ctx.closePath()
    }
  }
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
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = 'blue'
  ctx.fill()
  ctx.closePath()
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height-ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      alert('Game over!')
      document.location.reload()
    }
  }
  if (rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
  x += dx
  y += dy
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

function keyDownHandler(event) {
  if (event.keyCode == 39) {
    rightPressed = true
  } else if (event.keyCode == 37) {
    leftPressed = true
  }
}

function keyUpHandler() {
  if (event.keyCode == 39) {
    rightPressed = false
  } else if (event.keyCode == 37) {
    leftPressed = false
  }
}

setInterval(draw, 10)
