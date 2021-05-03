import { getPartialUpdatePath } from '@/api';

const {
  autoUpdater,
  CancellationToken
} = require('@imjs/electron-differential-updater');

const { app, BrowserWindow } = require('electron');

let mainWindow: typeof BrowserWindow|any;

const isDev = () => !app.isPackaged;

function sendMessageToRendererProcess(args: {}) {
  mainWindow = mainWindow ? mainWindow : BrowserWindow.getAllWindows()[0];
  mainWindow.webContents.send('upgrading', args);
}

class FullUpdater {
  constructor() {
    autoUpdater.logger = console;
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowDowngrade = false;
    autoUpdater.allowPrerelease = true;
    autoUpdater.on('error', (error: any) => this.onUpdateError(error));
    autoUpdater.on('checking-for-update', () => this.onCheckingForUpdateStarted());
    autoUpdater.on('update-available', (info: any) => this.onUpdateAvailable(info));
    autoUpdater.on('update-not-available', () => this.onUpdateNotAvailable());
    autoUpdater.on('update-downloaded', (info: any) => this.onUpdateDownloaded(info));
    autoUpdater.on('download-progress', (progress: any) => this.onDownloadProgressChanged(progress));
    try {
      const { platform, arch } = process;
      getPartialUpdatePath(platform, arch)
        .then((url:any) => {
          autoUpdater.setFeedURL(url);
        });
    } catch (e) {
      console.error(e);
      sendMessageToRendererProcess({ error: e });
    }
  }

  onUpdateError(error: any) {
    console.error('Error in auto-updater. ' + error);
    // Send last so other notifications have a chance to get sent before main process reacts
    sendMessageToRendererProcess({ error: error });
  }

  onCheckingForUpdateStarted() {
    console.info('onCheckingForUpdateStarted');
  }

  async onUpdateAvailable(info: any) {
    console.info('onUpdateAvailable', info);
    const fCancellationToken = new CancellationToken();
    try {
      await autoUpdater.downloadUpdate(fCancellationToken);
    } catch (error) {
      console.log(
        'An error occurred attempting to download the update',
        error.message
      );
      sendMessageToRendererProcess({ error: error.message });
    }
  }

  onUpdateNotAvailable() {
    console.info('onUpdateNotAvailable');
  }

  onDownloadProgressChanged(progress: any) {
    console.log('download-progress', progress);
    let log_message = `Download speed: ${progress.bytesPerSecond}`;
    log_message = `${log_message} - Downloaded ${progress.percent} %`;
    log_message = `${log_message} (${progress.transferred}/${progress.total})`;
    console.log(progress.percent);
    sendMessageToRendererProcess({ percent: progress.percent });
    console.log(log_message);
  }

  ensureSafeQuitAndInstall() {
    app.removeAllListeners('window-all-closed');
    let browserWindows = BrowserWindow.getAllWindows();
    browserWindows.forEach(function(browserWindow: typeof BrowserWindow|any) {
      browserWindow.removeAllListeners('close');
    });
  }

  onUpdateDownloaded(info: any) {
    console.info('onUpdateDownloaded');
    this.ensureSafeQuitAndInstall();
    autoUpdater.quitAndInstall(false, true);
  }

  async checkForUpdates() {
    if (isDev()) {
      console.info('Could not update the app in development mode');
      await Promise.resolve();
    } else {
      console.info('Checking for updates');
      await autoUpdater.checkForUpdates();
    }
  }
}

module.exports = new FullUpdater();
