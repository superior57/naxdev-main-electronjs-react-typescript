import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';
import { constants } from '@/constants';

const i18n = require('./configs/i18next.config');
const fullUpdater = require('./updates/fullUpdater');
import PartialUpdater from './updates/partialUpdater'
import { pingNodes } from './network/ping';

let mainWindow: BrowserWindow;
let menuBuilder: MenuBuilder;
const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 390,
    height: 620,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      enableRemoteModule: true
    }
  });

  constants.DEV_ENV && mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    constants.DEV_ENV
      ? 'http://localhost:9000/'
      : `file://` + __dirname + `/index.html`
  );

  i18n.on('loaded', () => {
    i18n.changeLanguage('ENG_US');
    i18n.off('loaded');
  });

  menuBuilder = new MenuBuilder(mainWindow);

  i18n.on('languageChanged', (lng: any) => {
    menuBuilder.buildMenu(i18n);
    if (mainWindow) {
      mainWindow.webContents.send('language-changed', { language: lng });
    }
  });

  menuBuilder.buildMenu(i18n);
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.error);

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

ipcMain.on('minimize', (_event, data) => {
  mainWindow?.minimize();
});

ipcMain.on('close', (_event, data) => {
  app.quit();
});

ipcMain.on('upgrade', (_event, data) => {
  console.log('======= Full Upgrade request received');
  fullUpdater.checkForUpdates();
});

ipcMain.on('checkForPartUpdate', (e, msg) => {
  const partialUpdater = new PartialUpdater(mainWindow)

  partialUpdater.checkForUpdates();
});

ipcMain.on('ping', async (_, payload) => {
  await pingNodes(payload);
});

ipcMain.on('changeLanguage', (_, language) => {
  i18n.changeLanguage(language);
  menuBuilder.buildMenu(i18n);
});
