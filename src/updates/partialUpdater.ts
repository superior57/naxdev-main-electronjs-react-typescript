import { getPartialUpdatePath } from '@/api';

const { app, BrowserWindow } = require('electron');
const AdmZip = require('adm-zip');
const isElectronDev = require('electron-is-dev');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

let mainWindow: typeof BrowserWindow |any;
const isDev = () => !app.isPackaged;

let localResourcePath = '';
let resourcePath = '';
let appZipPath = '';

 export default class PartialUpdater {
  constructor(main:any) {
    mainWindow = main ? main : BrowserWindow.getAllWindows()[0];
    if (!isElectronDev && (process.platform === 'win32')) {
      localResourcePath = `./resources/app`;
      resourcePath = `./resources`;
      appZipPath = `./resources/app.zip`;
    }
    if (!isElectronDev && process.platform === 'darwin') {
      localResourcePath = `/Applications/naxCloud.app/Contents/Resources/app`;
      resourcePath = `/Applications/naxCloud.app/Contents/Resources`;
      appZipPath = `/Applications/naxCloud.app/Contents/Resources/app.zip`;
    }
  }
  
  deleteDirSync = (dir: any) => {
    let files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      let newPath = path.join(dir, files[i]);
      let stat = fs.statSync(newPath);
      if (stat.isDirectory()) {
        
        this.deleteDirSync(newPath);
      } else {
        
        fs.unlinkSync(newPath);
      }
    }
    fs.rmdirSync(dir);
  };
  
  async downloadFile(filename: any) {
    const writer = fs.createWriteStream(filename);
    const url = await getPartialUpdatePath(process.platform, process.arch);
    try {
      const { data, headers } = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream'
      });
      const totalLength = headers['content-length'];
      let downloaded = 0;
      data.on('data', (chunk: any) => {
        downloaded = downloaded + chunk.length;
        mainWindow.webContents.send('PartUpdating', { percent: (downloaded / totalLength) * 100 });
      });
      data.pipe(writer);
      return new Promise(async (resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      throw error;
    }
  }
  
  async checkForUpdates() {
    if (isDev()) {
      const error = 'Could not update the app in development mode';
      console.info(error);
      mainWindow = mainWindow ? mainWindow : BrowserWindow.getAllWindows()[0];
      mainWindow.webContents.send('upgrading', { error: error });
    } else {
      try {
        if (fs.existsSync(`${localResourcePath}.back`)) {
          this.deleteDirSync(`${localResourcePath}.back`);
        }
        if (fs.existsSync(localResourcePath)) {
          fs.renameSync(localResourcePath, `${localResourcePath}.back`);
        }
        mainWindow.webContents.send('PartUpdating', `Downloading`);
        await this.downloadFile(appZipPath);
        mainWindow.webContents.send('PartUpdating', `Downloaded`);
        if (!fs.existsSync(`${localResourcePath}`)) {
          fs.mkdirSync(localResourcePath);
        }
        try {
          const unzip = new AdmZip(appZipPath);
          unzip.extractAllTo(resourcePath, true);
          
          setTimeout(() => {
            app.relaunch();
            app.exit(0);
          }, 1800);
        } catch (error) {
          mainWindow.webContents.send('PartUpdating', { error: error });
        }
      } catch (error) {
        mainWindow.webContents.send('PartUpdating', { error: error });
      } finally {
        if (fs.existsSync(`${localResourcePath}.back`)) {
          fs.renameSync(`${localResourcePath}.back`, localResourcePath);
        }
      }
    }
  }
}
