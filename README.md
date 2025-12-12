# PwdHash

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)

**PwdHash** is a high-performance, client-side cryptographic playground designed for educational purposes. It allows users to experiment with various hashing and encryption algorithms in real-time, all running locally within the browser using Web Workers.

Experience a modern, neon-inspired interface while learning about the mechanics of digital security.

---

## 🚀 Features

-   **Client-Side Processing**: All hashing and encryption operations run locally on your device. No data is ever sent to a server.
-   **Web Worker Architecture**: Heavy computations (like Argon2 or Bcrypt) are offloaded to background threads to keep the UI buttery smooth.
-   **Real-Time Analytics**: Visual feedback on generation time and cost factors.
-   **Educational Breakdown**: Detailed explanations of outputs, including salts, initialization vectors (IVs), and ciphertexts.
-   **Premium UI**: A fully responsive, dark-mode aesthetic with neon accents, scanlines, and animated interactions.

## 🛡️ Supported Algorithms

### Password Hashing
Robust, slow hashing algorithms designed for password storage.
-   **Bcrypt**: Adaptive hashing based on the Blowfish cipher.
-   **Argon2**: The winner of the Password Hashing Competition (PHC). Supports `Argon2id`.
-   **PBKDF2**: Password-Based Key Derivation Function 2.
-   **Scrypt**: Memory-hard function designed to prevent ASIC attacks.

### Fast Hashing / Message Digests
General-purpose cryptographic hash functions.
-   **MD5** (Legacy)
-   **SHA-1** (Legacy)
-   **SHA-2** Family: `SHA-256`, `SHA-512`
-   **SHA-3** Family: `SHA-3`, `SHA-3-128`
-   **RIPEMD-160**

### Symmetric Encryption
Encrypt and decrypt data using shared secrets.
-   **AES**: Advanced Encryption Standard (CBC mode etc.)
-   **DES**: Data Encryption Standard (Legacy)
-   **3DES**: Triple DES (Legacy)
-   **Blowfish**: Fast block cipher (Legacy/Education)
-   **Twofish**: Successor to Blowfish, AES finalist.
-   **ChaCha20**: High-speed stream cipher.

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript
-   **Build Tool**: Vite
-   **Styling**: TailwindCSS
-   **Animations**: Framer Motion
-   **Cryptography**: `crypto-js`, `bcryptjs`, `argon2-browser`, `scrypt-js`, `egoroof-blowfish`, `twofish-ts`, `ts-chacha20`.

## 📦 Getting Started

### Prerequisites
-   Node.js (v18+ recommended)
-   npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pwd-hash.git
    cd pwd-hash
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  Open your browser to `http://localhost:5173` (or the port shown in your terminal).

## ⚠️ Security Notice

> [!IMPORTANT]
> **Educational Use Only**
>
> This tool is intended for educational purposes to demonstrate how cryptographic algorithms work.
>
> -   **Do not** use this tool to generate passwords for real high-value accounts.
> -   **Do not** paste sensitive production secrets or keys into this tool.
> -   While all processing is local, browser environments have different security models than backend servers.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
