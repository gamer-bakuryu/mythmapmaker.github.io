export class GridSystem {
  constructor(size = 50) {
    this.size = size;
    this.enabled = true;
  }

  draw(ctx, width, height, camera) {
    if (!this.enabled) return;

    const gridSize = this.size * camera.zoom;

    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;

    for (let x = camera.x % gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = camera.y % gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  snap(value) {
    return Math.round(value / this.size) * this.size;
  }
}
