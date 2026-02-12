/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  windowAPI: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
  }
  steamAPI: {
    search: (query: string) => Promise<any>
    getDetails: (appId: string) => Promise<any>
    checkImage: (url: string) => Promise<boolean>
  }
  gameDB: {
    getAll: () => Promise<any[]>
    add: (game: any) => Promise<any>
    delete: (id: string) => Promise<void>
  }
}
