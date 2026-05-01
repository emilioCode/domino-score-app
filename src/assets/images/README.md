# App Icon & Splash Assets

Coloca aquí los tres archivos PNG antes de hacer build.

## icon.png
- **Dimensiones:** 1024 × 1024 px
- **Fondo:** `#0D0D0D`
- **Contenido:** texto "DS" centrado en dorado `#D4AF37`, fuente bold ~320px
- **Uso:** ícono principal de la app (iOS y web)

## splash.png
- **Dimensiones:** 1284 × 2778 px  (iPhone 14 Pro Max native)
- **Fondo:** `#0D0D0D`
- **Contenido:** texto "Dominó Score" centrado en dorado `#D4AF37`, fuente bold ~80px; opcional ícono de dominó arriba
- **Uso:** pantalla de carga (`resizeMode: contain`)

## adaptive-icon.png
- **Dimensiones:** 1024 × 1024 px
- **Fondo:** transparente (el color de fondo lo pone app.json: `#0D0D0D`)
- **Contenido:** igual que icon.png — texto "DS" en dorado `#D4AF37` centrado
- **Uso:** ícono adaptativo en Android (la imagen va dentro del "safe zone" 66%)

---

### Herramientas sugeridas
- **Figma / Canva** — exportar como PNG a las dimensiones exactas
- **Script Node con `canvas`:**

```js
const { createCanvas } = require('canvas');
const fs = require('fs');

function makeIcon(w, h, label, outFile) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#D4AF37';
  ctx.font = `bold ${Math.round(h * 0.31)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, w / 2, h / 2);
  fs.writeFileSync(outFile, canvas.toBuffer('image/png'));
  console.log('Creado:', outFile);
}

makeIcon(1024, 1024,  'DS',            'src/assets/images/icon.png');
makeIcon(1284, 2778,  'Dominó Score',  'src/assets/images/splash.png');
makeIcon(1024, 1024,  'DS',            'src/assets/images/adaptive-icon.png');
```

```bash
npm install canvas   # o: yarn add canvas
node generate-assets.js
```
