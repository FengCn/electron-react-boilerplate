/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  webContents,
  globalShortcut,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let p1: { x: number; y: number },
  p2,
  p3 = null;

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('webview-dom-ready', (_, id) => {
  const wc = webContents.fromId(id);
  let redirectUrl = '';
  wc.setWindowOpenHandler(({ url }) => {
    const protocol = new URL(url).protocol;
    if (['https:', 'http:'].includes(protocol)) {
      // shell.openExternal(url);
      // _.reply('webview-dom-ready', url)
      redirectUrl = url;
      console.log(redirectUrl);
      mainWindow?.webContents?.send('update-url', redirectUrl);
    }
    return { action: 'deny' };
  });
});

const { setTimeout: setTimeoutPromise } = require('node:timers/promises');
const ac = new AbortController();
const signal = ac.signal;

ipcMain.on('robotjs', async (event, args) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(args));
  console.log(mainWindow?.getPosition());
  console.log(args);
  switch (args[0]) {
    case 'enter-room':
      let scaleFactor =
        require('electron').screen.getPrimaryDisplay().scaleFactor;
      console.log(scaleFactor);

      // BrowserWindow.getFocusedWindow()?.loadURL('http://www.douyin.com')
      var robot = require('robotjs');

      const pos = BrowserWindow.getFocusedWindow()?.getPosition();
      // robot.moveMouse(
      //   (pos[0] + 90) * scaleFactor,
      //   (pos[1] + 350) * scaleFactor + 400
      // );
      robot.moveMouse(p1.x, p1.y);
      robot.mouseClick();
      await setTimeoutPromise(
        10000,
        function (resolve, reject) {
          console.log('22222');
          resolve('done');
        },
        { signal }
      )
        .then(console.log)
        .catch((err) => {
          if (err.name === 'AbortError')
            console.error('The timeout was aborted');
        });
      console.log('sleep...');
      await setTimeoutPromise(10000, 'foobar', { signal })
        .then(console.log)
        .catch((err) => {
          if (err.name === 'AbortError')
            console.error('The timeout was aborted');
        });
      console.log('wake up...');
      robot.moveMouse(500, 500);
      robot.mouseClick();

      break;
    case 'stop':
      console.log('ac abort');
      ac.abort('stop');
      break;

    default:
      break;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webviewTag: true,
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    minWidth: 1024,
    minHeight: 728,
  });

  // mainWindow.maximize();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+X');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app
  .whenReady()
  .then(() => {
    createWindow();

    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+X', () => {
      console.log('CommandOrControl+X is pressed');
      var robot = require('robotjs');
      p1 = robot.getMousePos();
      console.log(p1);
      mainWindow?.webContents?.send('mouse-pos', ['p1', p1]);
    });

    if (!ret) {
      console.log('registration failed');
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('CommandOrControl+X'));

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
