<div align="center">

  <br />
  <img src="public/avatar-om-face-v2.webp" alt="Om Prakash Pattjoshi" width="160"/>
  <br />

  <h1>🤖 Om Prakash Pattjoshi — AI-Native Portfolio</h1>
  <p>An interactive portfolio where an AI avatar answers questions about me in real time.</p>
</div>

---
<img width="948" height="446" alt="image" src="https://github.com/user-attachments/assets/18881155-c137-49aa-b1e1-de6590c52cbe" />


### **Badges**

<p align="center">
  <img src="https://img.shields.io/github/repo-size/pattjoshi/om-ai-engineer-portfolio?style=for-the-badge" alt="Repo Size">
  <img src="https://img.shields.io/github/license/pattjoshi/om-ai-engineer-portfolio?style=for-the-badge" alt="License">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deployment"></a>
  <a href="https://mistral.ai/"><img src="https://img.shields.io/badge/Mistral-FF7E00?style=for-the-badge&logo=mistralai&logoColor=white" alt="Mistral API"></a>
  <a href="https://groq.com/"><img src="https://img.shields.io/badge/Groq-F55036?style=for-the-badge" alt="Groq API"></a>
</p>

---

### **About The Project** 💡

Static portfolios are a thing of the past — a one-sided, lifeless view of a developer's journey. This is an **AI-powered, interactive portfolio** where visitors don't scroll through a wall of text; they ask questions and get answers tailored to them, voiced by an AI avatar that knows my background, skills, and projects.

---

### **Features** ✨

- **🗣️ Interactive AI Avatar** — Ask anything about my experience, skills, or projects and get real, context-aware answers (Mistral primary, Groq fallback).
- **⚡ Smart small-talk shortcut** — Trivial messages ("hi", "thanks", "bye") get an instant canned reply with **zero LLM calls**, keeping API costs down.
- **👀 Eye-tracking avatar** — The hero avatar's pupils follow your cursor, a lightweight 2D "googly eyes" effect, no 3D engine required.
- **🖱️ Custom cursor** — A soft glowing dot/ring that lags the real cursor and shifts color over interactive elements (disabled automatically on touch devices).
- **🎵 Generative ambient music** — A toggleable background soundtrack synthesized live in the browser via the Web Audio API (no audio file, infinitely evolving, zero licensing risk).
- **🧲 Magnetic buttons & 3D tilt cards** — Buttons gently pull toward the cursor; project cards tilt in 3D on hover.
- **🛡️ Production-hardened** — Rate-limited chat API, cached Spotify token exchange, proper `error.tsx`/`not-found.tsx` boundaries, and optimized/compressed images throughout.

---

### **Tech Stack** 🛠️

| **Category**        | **Technology**                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**         | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend**          | Next.js API Routes (Node.js runtime)                                                                                     |
| **AI & APIs**        | [Mistral API](https://mistral.ai/) (primary), [Groq](https://groq.com/) (fallback), [AI SDK](https://sdk.vercel.ai/)    |
| **Audio**            | Web Audio API (generative ambient soundtrack — no audio files)                                                          |
| **Deployment**       | [Vercel](https://vercel.com/)                                                                                            |
| **Package Manager**  | [pnpm](https://pnpm.io/)                                                                                                 |

---

### **Installation & Usage** 🚀

#### **Prerequisites**
- Node.js (v18 or higher)
- pnpm package manager
- A Mistral API key (and optionally a Groq key as fallback)

#### **Local Setup**

1. **Clone the repository:**
    ```sh
    git clone https://github.com/pattjoshi/om-ai-engineer-portfolio.git
    cd om-ai-engineer-portfolio
    ```

2. **Install dependencies:**
    ```sh
    pnpm install
    ```

3. **Set up your environment variables:**
    Copy `.env.example` to `.env.local` and fill in:
    ```env
    MISTRAL_API_KEY="your_mistral_api_key_here"
    GROQ_API_KEY="your_groq_api_key_here"   # optional fallback
    GITHUB_TOKEN="your_github_token_here"    # optional, raises GitHub API rate limits

    # Optional: Spotify "now playing" widget
    SPOTIFY_CLIENT_ID=""
    SPOTIFY_CLIENT_SECRET=""
    SPOTIFY_REFRESH_TOKEN=""
    ```
    - Get a Mistral API key from [admin.mistral.ai](https://admin.mistral.ai/organization/api-keys) — **primary AI provider**.
    - Get a Groq API key from [console.groq.com](https://console.groq.com) — **fallback provider**, used automatically if Mistral is unavailable.
    - All keys are server-side only, never exposed to the client.

4. **Run the development server:**
    ```sh
    pnpm dev
    ```

5. **Open your browser** at `http://localhost:3000`.

#### **Production build**
```sh
pnpm build
pnpm start
```

---

### **Deployment** ☁️

Deployed on [Vercel](https://vercel.com/new) — import this repo, add the environment variables above in the project settings, and deploy. No special build configuration needed.

---

### **License** 📄

This project is open-sourced under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

### **Contact & Links** 🔗

**Om Prakash Pattjoshi** — GenAI Engineer | LLM Engineer | Full Stack AI Developer

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/om-prakash-pattjoshi-/)
&nbsp;
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pattjoshi)
&nbsp;
[![Email](https://img.shields.io/badge/Email-omprakashpattjoshi123%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:omprakashpattjoshi123@gmail.com)

</div>

---

### **Tags**

`#AIPortfolio` `#NextJS` `#React` `#Portfolio` `#Vercel` `#MistralAI` `#Groq` `#GenAI` `#LLMEngineer` `#WebDevelopment`
