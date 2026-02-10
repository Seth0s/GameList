import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  
})

contextBridge.exposeInMainWorld("windowAPI", {
  minimize: () => ipcRenderer.invoke("win:minimize"),
  maximize: () => ipcRenderer.invoke("win:maximize"),
  close: () => ipcRenderer.invoke("win:close"),
});

contextBridge.exposeInMainWorld("steamAPI", {
  search: (query: string) => ipcRenderer.invoke("steam:search", query),
  getDetails: (appId: string) => ipcRenderer.invoke("steam:details", appId),
});

contextBridge.exposeInMainWorld("gameDB", {
  getAll: () => ipcRenderer.invoke("db:getAll"),
  add: (game: any) => ipcRenderer.invoke("db:add", game),
  delete: (id: string) => ipcRenderer.invoke("db:delete", id),
});
