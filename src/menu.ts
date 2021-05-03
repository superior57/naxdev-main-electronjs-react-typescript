import {
  app,
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import { i18n } from 'i18next';
const config = require('./configs/app.config');

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(i18nMenu: i18n): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate(i18nMenu)
        : this.buildDefaultTemplate(i18nMenu);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(i18nMenu: i18n): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: i18nMenu.t('naxCloud'),
      submenu: [
        {
          label: i18nMenu.t('About naxCloud'),
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: i18nMenu.t('Quit'),
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const languageMenu = config.languages.map((languageCode: string) => {
      return {
        label: i18nMenu.t(languageCode),
        type: 'radio',
        checked: i18nMenu.language === languageCode,
        click: () => {
          i18nMenu.changeLanguage(languageCode);
        }
      }
    });

    const language = {
      label: i18nMenu.t('Language'),
      submenu: languageMenu,
    };

    return [subMenuAbout, language];
  }

  buildDefaultTemplate(i18nMenu: i18n) {
    const templateDefault = [
    ];

    const languageMenu = config.languages.map((languageCode: string) => {
      return {
        label: i18nMenu.t(languageCode),
        type: 'radio',
        checked: i18nMenu.language === languageCode,
        click: () => {
          i18nMenu.changeLanguage(languageCode);
        }
      }
    });

    templateDefault.push ({
      label: i18nMenu.t('Language'),
      submenu: languageMenu,
    });

    return templateDefault;
  }
}
