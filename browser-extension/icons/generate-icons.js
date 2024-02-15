const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Draw background circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  
  // Draw cross
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size/16;
  ctx.lineCap = 'round';
  
  // Vertical line
  ctx.beginPath();
  ctx.moveTo(size/2, size/4);
  ctx.lineTo(size/2, size*3/4);
  ctx.stroke();
  
  // Horizontal line
  ctx.beginPath();
  ctx.moveTo(size/4, size/2);
  ctx.lineTo(size*3/4, size/2);
  ctx.stroke();
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/4, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Draw inner circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/6, 0, Math.PI * 2);
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  
  return canvas;
}

// Generate icons in different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const canvas = drawIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, `icon${size}.png`), buffer);
  console.log(`Generated icon${size}.png`);
}); 