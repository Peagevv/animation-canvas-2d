// Obtiene el canvas por su ID y el contexto 2D para dibujar en él
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la ventana actual del navegador
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Ajusta las dimensiones del canvas para que coincidan con las dimensiones de la ventana
canvas.height = window_height;
canvas.width = window_width;

// Establece un fondo transparente para el canvas y cambia el color de fondo de la página
canvas.style.background = "transparent";
document.body.style.backgroundColor = "white"; // Cambia el fondo de la página a blanco

// Ajusta la configuración del fondo de la página (para que sea una imagen de fondo centrada y no se repita)
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";

// Clase para representar un círculo con sus propiedades y comportamiento
class Circle {
  // Constructor que define las propiedades iniciales del círculo
  constructor(x, y, radius, color, speed, label, explodeAt, explosionType) {
    this.posX = x; // Posición X del círculo
    this.posY = y; // Posición Y del círculo
    this.radius = radius; // Radio del círculo
    this.color = color; // Color del círculo
    this.speed = speed; // Velocidad de movimiento
    this.dx = 1 * this.speed; // Velocidad en el eje X
    this.dy = 1 * this.speed; // Velocidad en el eje Y
    this.bounceCount = 0; // Contador de rebotes
    this.label = label; // Etiqueta del círculo
    this.exploded = false; // Estado de explosión
    this.explodeAt = explodeAt; // Número de rebotes necesarios para la explosión
    this.explosionType = explosionType; // Tipo de explosión (corazones, flores, estrellas)
    this.explosionParticles = []; // Lista de partículas para la explosión
  }

  // Método para dibujar el círculo en el canvas
  draw(context) {
    if (!this.exploded) {
      // Si el círculo no ha explotado, dibuja el círculo y su etiqueta
      context.beginPath();
      context.strokeStyle = this.color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "20px Arial";
      context.fillText(this.label + this.bounceCount, this.posX, this.posY); // Muestra la etiqueta y los rebotes
      context.lineWidth = 2;
      context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
      context.stroke();
      context.closePath();
    } else {
      // Si el círculo ha explotado, dibuja la explosión
      this.drawExplosion(context);
    }
  }

  // Método para dibujar la explosión de partículas
  drawExplosion(context) {
    if (this.explosionParticles.length === 0) {
      // Si no hay partículas de explosión, crea nuevas partículas
      const symbols = this.explosionType === "hearts" ? ["❤"] : ["🌸", "✨", "⭐", "💮"];
      for (let i = 0; i < 30; i++) {
        let angle = Math.random() * Math.PI * 2; // Ángulo aleatorio para la dirección
        let speed = Math.random() * 5 + 4; // Velocidad aleatoria
        this.explosionParticles.push({
          x: this.posX, // Posición inicial X de la partícula
          y: this.posY, // Posición inicial Y de la partícula
          dx: Math.cos(angle) * speed, // Velocidad en el eje X
          dy: Math.sin(angle) * speed, // Velocidad en el eje Y
          symbol: symbols[Math.floor(Math.random() * symbols.length)], // Símbolo de la partícula (corazón, flor, etc.)
          life: 100 // Vida de la partícula (número de frames antes de desaparecer)
        });
      }
    }
    
    // Dibuja cada partícula de la explosión
    this.explosionParticles.forEach((p) => {
      p.x += p.dx; // Actualiza la posición X de la partícula
      p.y += p.dy; // Actualiza la posición Y de la partícula
      p.life -= 1; // Reduce la vida de la partícula
      //HSL (Hue, Saturation, Lightness)
      context.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`; // Asigna un color aleatorio a la partícula
      context.font = "30px Arial"; // Establece el tamaño de fuente, tamaño del simbolo
      context.fillText(p.symbol, p.x, p.y); // Dibuja el símbolo de la partícula
    });
    
    // Filtra las partículas para eliminar las que ya han "muerto"
    this.explosionParticles = this.explosionParticles.filter(p => p.life > 0);
  }

  // Método para actualizar la posición del círculo y gestionar rebotes y explosión
  update(context) {
    // Si el número de rebotes alcanza el límite, provoca la explosión
    if (this.bounceCount >= this.explodeAt && !this.exploded) {
      this.exploded = true;
      if (this.explosionType === "hearts") {
        // Si la explosión es de corazones, cambia el fondo de la página
        document.body.style.backgroundImage = "url('https://images.pexels.com/photos/6005373/pexels-photo-6005373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')";
      }
    }

    // Dibuja el círculo o la explosión
    this.draw(context);

    // Si el círculo no ha explotado, detecta los rebotes
    if (!this.exploded) {
      // Detecta si el círculo rebota con los límites de la pantalla
      if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
        this.dx = -this.dx; // Rebote en el eje X
        this.bounceCount++; // Incrementa el contador de rebotes
      }

      if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
        this.dy = -this.dy; // Rebote en el eje Y
        this.bounceCount++; // Incrementa el contador de rebotes
      }

      // Actualiza la posición del círculo
      this.posX += this.dx;
      this.posY += this.dy;
    }
  }
}

// Crea dos círculos con posiciones y tamaños aleatorios
let randomRadius = Math.floor(Math.random() * 50 + 30);
let randomX = Math.random() * (window_width - 2 * randomRadius) + randomRadius;
let randomY = Math.random() * (window_height - 2 * randomRadius) + randomRadius;

// Instancia dos círculos con características diferentes
let miCirculo = new Circle(randomX, randomY, randomRadius, "blue", 6, "Tec", 10, "hearts"); 
let miCirculo2 = new Circle(randomX, randomY, randomRadius, "red", 2, "Tec", 5, "flowers");

// Función para actualizar continuamente los círculos
function updateCircle() {
  requestAnimationFrame(updateCircle); // Llama la función de nuevo para crear una animación continua
  ctx.clearRect(0, 0, window_width, window_height); // Limpia el canvas en cada frame
  miCirculo.update(ctx); // Actualiza el primer círculo
  miCirculo2.update(ctx); // Actualiza el segundo círculo
}

// Inicia la animación de los círculos
updateCircle();
