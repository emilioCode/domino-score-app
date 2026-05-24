# 🁣 Dominó Score

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Expo](https://img.shields.io/badge/Expo-54-000020.svg?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)

> Marcador digital para partidas de dominó. Registra puntos en tiempo real, guarda el historial de partidas y comparte resultados con tu equipo.

---

## 📸 Screenshots

<!-- Add screenshots here -->

---

## ✨ Features

- 🎯 **Marcador en tiempo real** — puntuación actualizada al instante con barra de progreso hacia la meta
- 📝 **Historial de rondas editable** — toca cualquier ronda para corregir puntos; desliza para eliminar
- 💾 **Historial de partidas guardadas** — consulta resultados anteriores con detalle completo de rondas
- 🌙 **Dark / Light mode automático** — sigue el sistema o elige manualmente desde los ajustes
- 📳 **Vibración haptic** — feedback táctil al ganar una partida
- 📤 **Compartir resultados** — comparte el marcador final en cualquier app
- 📢 **Anuncios AdMob** — banner en partida e intersticial en pantalla de ganador
- 🎯 **Meta de puntos configurable** — 100, 150, 200, 250 o 300 puntos

---

## 🛠 Tech Stack

| Tecnología | Versión |
|---|---|
| React Native | 0.81.5 |
| Expo | 54 |
| Expo Router | 6 |
| TypeScript | 5.9 |
| Zustand | 5 |
| AsyncStorage | latest |
| Google AdMob | react-native-google-mobile-ads |

---

## 📋 Prerequisites

- **Node.js** >= 18 ([nvm](https://github.com/nvm-sh/nvm) recomendado)
- **Expo CLI** — `npm install -g expo-cli`
- **Xcode** >= 15 (solo para build iOS)
- **Android Studio** (solo para build Android)
- Cuenta de [Google AdMob](https://admob.google.com) con App IDs y Ad Unit IDs

---

## 🚀 Installation

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/domino-score-app.git
cd domino-score-app

# 2. Usar la versión correcta de Node
nvm use --lts

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
# → Editar .env con tus IDs de AdMob (ver sección de variables)
```

---

## ▶️ Running Locally

```bash
# Expo Go (desarrollo rápido, sin módulos nativos)
npx expo start

# Simulador iOS
npx expo run:ios

# Emulador Android
npx expo run:android

# Dispositivo físico iOS (Apple Silicon)
env /usr/bin/arch -arm64 /bin/bash --login \
  -c "source ~/.nvm/nvm.sh && nvm use --lts \
  && npx expo run:ios --device"
```

> **Nota:** Los anuncios de AdMob muestran anuncios de prueba en modo desarrollo (`__DEV__ === true`). No se requieren IDs reales para correr la app localmente.

---

## 📁 Project Structure

```
domino-score-app/
├── src/
│   ├── app/                  # Rutas y pantallas (Expo Router)
│   │   ├── _layout.tsx       # Layout raíz con Stack navigator
│   │   ├── index.tsx         # Pantalla de inicio y configuración
│   │   ├── game.tsx          # Pantalla de partida en curso
│   │   ├── winner.tsx        # Pantalla de ganador con confetti
│   │   └── history.tsx       # Historial de partidas guardadas
│   │
│   ├── assets/
│   │   ├── images/           # Íconos y splash screen
│   │   ├── fonts/            # Fuentes custom
│   │   └── sounds/           # Efectos de sonido
│   │
│   ├── components/
│   │   ├── ads/              # BannerAd e InterstitialAd (AdMob)
│   │   ├── game/             # Componentes reutilizables del juego
│   │   └── ui/               # Componentes UI genéricos
│   │
│   ├── constants/
│   │   ├── theme.ts          # Tokens de diseño (colores, espaciado, tipografía)
│   │   └── game.ts           # Constantes del juego (meta, opciones de puntos)
│   │
│   ├── hooks/
│   │   ├── useTheme.ts       # Tema dinámico basado en configuración del usuario
│   │   └── useGame.ts        # Lógica de partida (addPoints, undo, etc.)
│   │
│   ├── store/
│   │   ├── gameStore.ts      # Estado de la partida actual (Zustand)
│   │   ├── historyStore.ts   # Historial de partidas guardadas (Zustand)
│   │   └── settingsStore.ts  # Preferencias del usuario (Zustand + AsyncStorage)
│   │
│   ├── types/
│   │   └── game.types.ts     # Interfaces TypeScript (Team, Round, SavedGame...)
│   │
│   └── utils/
│       └── storage.ts        # Helpers de AsyncStorage (save, load, delete)
│
├── assets/                   # Assets estáticos para Expo (icon, splash, favicon)
├── app.json                  # Configuración de Expo (plugins, bundle IDs, AdMob)
├── .env.example              # Plantilla de variables de entorno
└── tsconfig.json             # Configuración de TypeScript
```

---

## 🔑 Environment Variables

Copia `.env.example` a `.env` y rellena los valores:

```env
# AdMob — Banner en pantalla de partida
EXPO_PUBLIC_ADMOB_ANDROID_BANNER=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_IOS_BANNER=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX

# AdMob — Intersticial en pantalla de ganador
EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL=ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
```

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_ADMOB_ANDROID_BANNER` | Ad Unit ID del banner para Android |
| `EXPO_PUBLIC_ADMOB_IOS_BANNER` | Ad Unit ID del banner para iOS |
| `EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL` | Ad Unit ID del intersticial para Android |
| `EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL` | Ad Unit ID del intersticial para iOS |

> En modo `__DEV__`, la app usa automáticamente los IDs de prueba de Google — no necesitas configurar nada para desarrollo.

---

## 📦 Building for Production

```bash
# Android — genera un APK / AAB
npx expo build:android

# iOS — genera un archivo IPA
npx expo build:ios
```

> Se recomienda usar [EAS Build](https://docs.expo.dev/build/introduction/) para builds en CI/CD:
> ```bash
> npm install -g eas-cli
> eas build --platform android
> eas build --platform ios
> ```

---

## 🤝 Contributing

1. Haz fork del repositorio
2. Crea tu rama siguiendo el naming convention:
   - `feat/nombre-funcionalidad`
   - `fix/descripcion-del-bug`
   - `chore/tarea-de-mantenimiento`
3. Haz commit con [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(game): add custom point input
   fix(history): correct date formatting on modal
   chore(deps): bump expo to 54.1.0
   ```
4. Abre un Pull Request describiendo los cambios

---

## 📄 License

MIT
