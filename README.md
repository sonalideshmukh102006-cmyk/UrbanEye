# Citylens Dashboard

A modern, responsive dashboard for city operations, incident management, and geospatial analytics. Built with React, TypeScript, Tailwind CSS (v4), and MapLibre GL.

## Prerequisites

Before running this project, make sure you have the following installed on your machine:
1. **Node.js**: Download and install the latest LTS version from [nodejs.org](https://nodejs.org/) (Version 18.0.0 or higher is recommended).
2. **VS Code (Visual Studio Code)**: Download from [code.visualstudio.com](https://code.visualstudio.com/).
3. *(Optional but recommended)* **Git**: Download from [git-scm.com](https://git-scm.com/).

## Getting Started

Follow these steps to open and run the project locally:

### 1. Extract the Project
If you received this project as a ZIP file, extract it to a folder on your computer.

### 2. Open in VS Code
1. Open **VS Code**.
2. Go to `File` > `Open Folder...` (or `Open...` on Mac).
3. Select the extracted `dashboard` folder (the folder containing this `README.md` file).

### 3. Open the Terminal
In VS Code, open a new terminal by clicking `Terminal` > `New Terminal` in the top menu (or press `` Ctrl + ` ``).

### 4. Install Dependencies
Run the following command in the terminal to download all required libraries (React, MapLibre, Tailwind, etc.):
```bash
npm install
```
*(This may take a minute or two depending on your internet connection).*

### 5. Run the Project
Once the installation is complete, start the local development server by running:
```bash
npm run dev
```

### 6. View in Browser
The terminal will output a local URL, typically `http://localhost:5173/`. 
Hold `Ctrl` (or `Cmd` on Mac) and click the link, or copy and paste it into your web browser (Chrome, Edge, Firefox, Safari) to view the dashboard!

## Technologies Used
- **Frontend Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Tailwind Merge + CLSX
- **Maps**: MapLibre GL (`maplibre-gl`) & `react-map-gl` (Using OpenStreetMap tiles)
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **Charts**: Recharts
- **Icons**: Lucide React
