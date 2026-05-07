const canvas = document.getElementById('mapCanvas')
const ctx = canvas.getContext('2d')

function resize() {

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

window.addEventListener('resize', resize)

resize()

function draw() {

  ctx.clearRect(0,0,canvas.width,canvas.height)

  // fundo
  ctx.fillStyle = '#1a2a1a'
  ctx.fillRect(0,0,canvas.width,canvas.height)

  // grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'

  for(let x=0;x<canvas.width;x+=50){

    ctx.beginPath()
    ctx.moveTo(x,0)
    ctx.lineTo(x,canvas.height)
    ctx.stroke()
  }

  for(let y=0;y<canvas.height;y+=50){

    ctx.beginPath()
    ctx.moveTo(0,y)
    ctx.lineTo(canvas.width,y)
    ctx.stroke()
  }

  // montanha teste
  ctx.fillStyle = '#555'

  ctx.beginPath()
  ctx.moveTo(300,400)
  ctx.lineTo(400,200)
  ctx.lineTo(500,400)
  ctx.fill()

  requestAnimationFrame(draw)
}

draw()
