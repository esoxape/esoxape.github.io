(function() {
  var canvas = document.getElementById('gameCanvas');
  var context = canvas.getContext('2d');

  function drawSmileyFace() {
      // Draw the circle (face)
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, 200, 0, Math.PI * 2, true);
      context.fillStyle = 'yellow';
      context.fill();
      context.lineWidth = 4;
      context.strokeStyle = 'black';
      context.stroke();
      context.closePath();

      // Draw the eyes
      context.beginPath();
      context.arc(canvas.width / 2 - 80, canvas.height / 2 - 80, 20, 0, Math.PI * 2, true);
      context.arc(canvas.width / 2 + 80, canvas.height / 2 - 80, 20, 0, Math.PI * 2, true);
      context.fillStyle = 'black';
      context.fill();
      context.closePath();

      // Draw the smile
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height / 2, 120, Math.PI / 6, 5 * Math.PI / 6);
      context.lineWidth = 6;
      context.stroke();
      context.closePath();
  }

  drawSmileyFace();
})();
