# FREEZEPAY1 by NONGOWE EPANE RODRIGUE ANDREW sdia4
Freezepay – Application mobile P2P de paiement sans contact (QR code &amp; Bluetooth) avec authentification multifactorielle (OTP, biométrie). Construit avec React Native, Express et PostgreSQL.

# FreezePay

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()  
[![Coverage](https://img.shields.io/badge/coverage–%25-lightgrey)]()  
[![Version](https://img.shields.io/badge/version-0.0.1-blue)]()  
[![License](https://img.shields.io/badge/license-MIT-green)]()

**FreezePay** est une solution mobile cross‑platform (React Native CLI) et back‑end (Node.js + Express + PostgreSQL) qui permet des paiements peer‑to‑peer rapides et sécurisés par QR code ou Bluetooth, avec authentification multifactorielle (OTP, biométrie) et gestion de contacts.

---

## Table des matières

1. [Installation](#installation)  
2. [Configuration](#configuration)  
3. [Usage](#usage)  
4. [Fonctionnalités](#fonctionnalités)  
5. [Architecture](#architecture)  
6. [Tests](#tests)  
7. [Contribution](#contribution)  
8. [CI / CD & Déploiement](#ci--cd--déploiement)  
9. [FAQ & Debug](#faq--debug)  
10. [Licence](#licence)  
11. [Auteurs & Remerciements](#auteurs--remerciements)  
12. [Contact & Support](#contact--support)  

---

## Installation

### Prérequis

  - **Node.js** ≥ 18  
  - **React Native CLI**  
  - **Android NDK/SDK** ou **Xcode** (pour builds natifs)  
  - **Java JDK** 11+  
  - **PostgreSQL** 14+  

### Front‑end (mobile)

  ```bash
  git clone https://github.com/votre-org/freezepay.git
  cd freezepay/front
  npm install            # ou yarn install
  npx pod-install ios    # sous iOS
  ```
  ### Back-end (API)
  ```bash
  cd freezepay/server
  npm install
  ```

### Configuration
  Variables d’environnement
  Créez deux fichiers ```.env``` à la racine des dossiers ```front``` et ```server```, à partir de .env.example.
  
  Front (```front/.env```) :
  ```env
  API_BASE_URL=http://<IP_LOCALE>:3000/api
  JWT_EXPIRES_IN=7200
  OTP_TTL=300
  ```
  Back‑end (```server/.env```) :
  
  ```env
  PORT=3000
  DATABASE_URL=postgresql://user:pass@localhost:5432/freezepay_db
  JWT_SECRET=<votre_secret_jwt>
  OTP_TTL=300
  EMAIL_USER=<votre_email>
  EMAIL_PASS=<mot_de_passe_app>
  ```
  Permissions natives
  iOS (```Info.plist```) :
  
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>Requis pour scanner les QR codes</string>
  <key>NSBluetoothAlwaysUsageDescription</key>
  <string>Requis pour paiements via Bluetooth</string>
  ```
  Android (```AndroidManifest.xml```) :
  
  ```xml
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.CAMERA"/>
  <uses-permission android:name="android.permission.BLUETOOTH"/>
  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
  ```
### Usage
En développement
  ```bash
  # API
  cd freezepay/server
  npm start            # Express + nodemon
  
  # Mobile
  cd freezepay/front
  npm start -- --reset-cache
  npm run android      # Android
  npm run ios          # iOS
  ```
Scripts utiles

  - ```npm run``` lint — ESLint
  
  - ```npm test``` — Jest (backend) + React Testing Library (front)
  
  - ```npm run build``` — build production (backend)
  
  - ```npx react-native bundle``` — bundle mobile

### Fonctionnalités
    - Authentification
    
    - Inscription / connexion par OTP (SMS/email)
    
    - Authentification multifactorielle (OTP + biométrie)
    
    - Gestion de sessions via JWT
    
    - Paiement
    
    - Génération et scan de QR codes
    
    - Paiement peer‑to‑peer par Bluetooth (mode offline)
    
    - Gestion de contacts à proximité
    
    - Expérience utilisateur
    
    - Animations Lottie
    
    - Toaster in‑app (retours success / error)
    
    - Thème sombre / clair et indicateur de force du mot de passe

### Architecture
  ```bash
  freezepay/
  ├── front/                  # React Native CLI
  │   ├─ src/
  │   │  ├─ components/      # UI réutilisables (Input, ToastBubble…)
  │   │  ├─ navigation/      # AuthStack, AppStack
  │   │  ├─ screens/         # Login, Registration, QR, Payment…
  │   │  ├─ controllers/     # hooks (useAuth, usePayment…)
  │   │  └─ services/        # ApiService (axios + interceptors)
  │   └─ .env
  ├── server/                 # Node.js + Express + PostgreSQL
  │   ├─ src/
  │   │  ├─ config/          # db.js, mailer.js
  │   │  ├─ controllers/     # authController, paymentController
  │   │  ├─ services/        # otpService, bioService
  │   │  ├─ middleware/      # jwtMiddleware
  │   │  └─ utils/           # jwtUtils, validators
  │   ├─ models/             # Sequelize / TypeORM models
  │   └─ .env
  └── README.md               # Ce document
  ```
### Tests
  ```Front‑end ```: Jest + React Native Testing Library
  
  ```Back‑end ```: Jest + Supertest
  
  ```bash
  # API
  cd server && npm test
  
  # Mobile
  cd front && npm test
  ```
  Les rapports de couverture se trouvent dans```coverage/```.

### Contribution
  1. Fork → clone
  
  2. ```npm install```
  
  3. Créez une branche feature/xxx ou fix/xxx
  
  4. Codez selon les Conventional Commits
  
  5. ```npm run lint && npm test```
  
  6. Ouvrez une Pull Request

### CI / CD & Déploiement
  - GitHub Actions : lint ✔︎, tests ✔︎, build ✔︎ sur ```main```
  
  - Fastlane (iOS) et Gradle Play Publisher (Android)
  
  - Bump de version via ```npm version [patch|minor|major]``` et tags Git

### FAQ & Debug
  - Metro ne démarre pas : ```npm start -- --reset-cache``` vous pouvez aussi supprimer le dossier ```android/app/buid```
  
  - Permissions caméra/Bluetooth : vérifier ```Info.plist``` / ```AndroidManifest.xml```
  
  - “No space left on device” : nettoyer caches (```watchman```, ```gradle```, ```npm cache```)
  
  - Logs :
  
      - Mobile Android : ```adb logcat *:S ReactNative:V ReactNativeJS:V```
  
      - Mobile iOS : console Xcode
  
      - Back‑end : console Node (morgan)

### Licence
  Ce projet est sous licence MIT. Voir le fichier LICENSE.

### Auteurs & Remerciements
  - NONGOWE EPANE Rodrique Andrew (Drew77) – Développement full‑stack data scientist

  - Inspirations : React Native Vision Camera, Sequelize/PostgreSQL, Axios, Lottie

### Contact & Support
  - Issues : https://github.com/votre-org/freezepay/issues

  - E‑mail : ```r22109267@gmail.com``` | ```671885652```

  - Slack : #freezepay-dev (workspace interne)
