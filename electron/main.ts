import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { getAllGames, addGame, deleteGame } from './database'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── IPC Handlers — Controles da janela ─────────────────────

ipcMain.handle("win:minimize", () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.handle("win:maximize", () => {
  const w = BrowserWindow.getFocusedWindow();
  w?.isMaximized() ? w.unmaximize() : w?.maximize();
});
ipcMain.handle("win:close", () => BrowserWindow.getFocusedWindow()?.close());

// ─── IPC Handlers — Banco de dados (SQLite) ─────────────────

ipcMain.handle("db:getAll", () => getAllGames());
ipcMain.handle("db:add", (_event, game) => addGame(game));
ipcMain.handle("db:delete", (_event, id: string) => deleteGame(id));

// ─── IPC Handlers — Steam API (Node.js — sem CORS) ──────────

ipcMain.handle("steam:search", async (_event, query: string) => {
  try {
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&cc=BR`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[steam:search] HTTP ${response.status}`);
      return { items: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("[steam:search] Erro:", error);
    return { items: [] };
  }
});

ipcMain.handle("steam:details", async (_event, appId: string) => {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[steam:details] HTTP ${response.status}`);
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error("[steam:details] Erro:", error);
    return {};
  }
});

// Verifica se uma imagem existe no CDN (HEAD request, sem baixar o corpo)
ipcMain.handle("steam:checkImage", async (_event, imageUrl: string) => {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
});


process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(VITE_DEV_SERVER_URL ? process.env.VITE_PUBLIC : RENDERER_DIST, 'icon.png'),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
