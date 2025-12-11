Whistle Frames | Beyond Reality

A high-performance, cinematic video portfolio website featuring a continuous 8K-ready carousel, real-time color grading comparisons, and a cyberpunk aesthetic with plexus network animations.

🚀 Prerequisites

Before you start, make sure you have Node.js installed on your computer.

Download it here: https://nodejs.org/ (Choose the "LTS" version).

To check if it's installed, open your terminal and type: node -v

🛠️ Installation & Setup (VS Code)

Open the Project:

Launch Visual Studio Code.

Go to File > Open Folder...

Select the whistle-frames folder.

Open the Terminal:

In VS Code, press Ctrl + ~ (Control + Tilde) to open the integrated terminal.

Or go to the top menu: Terminal > New Terminal.

Install Dependencies:

Type the following command and hit Enter:

npm install


This will download React, Tailwind, Framer Motion, and other tools into a node_modules folder.

Configure API Key:

Open src/App.jsx.

Find line 32: const apiKey = "";

Paste your Google Gemini API key inside the quotes.

▶️ How to Run Locally

To see your website running on your computer:

In the terminal, run:

npm run dev


You will see a link, usually http://localhost:5173/.

Ctrl + Click (or Cmd + Click on Mac) that link to open it in your browser.

Any changes you make to the code will update the website instantly!

📦 How to Deploy (Go Live)

When you are ready to share the website with the world:

Create the Production Build:
In your terminal, run:

npm run build


This creates a dist folder with optimized files.

Upload to Vercel (Recommended):

Push your code to a GitHub repository.

Go to Vercel.com and import your repo.

Vercel will detect the settings automatically. Click Deploy.

📂 Project Structure

src/App.jsx: The main logic, animations, and video player code.

src/index.css: Global styles and Tailwind imports.

vite.config.js: Settings for the build tool (Vite).

tailwind.config.js: Settings for the styling engine.

🔑 Key Features

Infinite Carousel: Videos play continuously and scroll automatically.

Smart Loading: Optimizes buffering by only preloading active videos.

Color Grade Slider: Interactive "Before/After" comparison tool.

AI Integration: "Auto-Enhance Brief" feature in the contact form (requires API Key).