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

let p1: { x: number; y: number };
let p2: { x: number; y: number };
let p3: { x: number; y: number };

const fruits: Array<string> = [
  '77777777777777777777777777777777777777777777777777',
  '交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友交朋友谢谢 抠鼻',
  '交朋友👬交朋友👬求关注交朋友👬交朋友👬求关注交朋友👬交朋友👬求关注交朋友👬交朋友👬求关注',
  '有关必回！有关必回！有关必回！有关必回！有关必回！有关必回！有关必回！有关必回！有关必回！有关必回！',
  '诚信交友！诚信交友！诚信交友！诚信交友！诚信交友！诚信交友！诚信交友！诚信交友！诚信交友！诚信交友！',
  '加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油加油',
];

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('webview-dom-ready', (_, id) => {
  const wc = webContents.fromId(id);
  let redirectUrl = '';
  wc?.setWindowOpenHandler(({ url }) => {
    const { protocol } = new URL(url);
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
let ac = new AbortController();

ipcMain.on('robotjs', async (event, args) => {
  const { clipboard } = require('electron');
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(args));
  console.log(mainWindow?.getPosition());
  console.log(args);
  switch (args[0]) {
    case 'enter-room':
      console.log(`enter-room`);
      // let scaleFactor =
      //   require('electron').screen.getPrimaryDisplay().scaleFactor;
      // console.log(scaleFactor);

      // BrowserWindow.getFocusedWindow()?.loadURL('http://www.douyin.com')
      // var robot = require('robotjs');

      // const pos = BrowserWindow.getFocusedWindow()?.getPosition();
      // robot.moveMouse(
      //   (pos[0] + 90) * scaleFactor,
      //   (pos[1] + 350) * scaleFactor + 400
      // );

      break;
    case 'stop':
      console.log('ac abort');
      ac.abort('stop');
      break;
    case 'play':
      console.log('play');
      var robot = require('robotjs');
      ac = new AbortController();
      while (!ac.signal.aborted) {
        await fetch('https://pro.xiaotuan.cn/api/polls/feo_user_list', {
          signal: ac.signal,
        })
          .then((response) => response.json())
          .then((jsonData) => {
            mainWindow?.webContents?.send('push-feo-users', [jsonData]);
            var onlineOnly = jsonData.filter(function (entry, index) {
              return entry.live_status == 1;
            });
            console.log(onlineOnly);
            var greeting =
              onlineOnly[Math.floor(Math.random() * onlineOnly.length)];
            console.log(greeting.aweme_user.nickname);

            for (let index = 0; index < jsonData.length; index++) {
              const element = jsonData[index];
              jsonData[index] =
                element.id == greeting.id
                  ? Object.assign(element, { selected: 1 })
                  : Object.assign(element, { selected: 0 });
            }

            console.log(jsonData);

            mainWindow?.webContents?.send(
              'update-url',
              `https://www.douyin.com/user/${greeting.aweme_user.sec_uid}`
            );
          })
          .catch((reason) => {
            console.log(reason);
          });
        await setTimeoutPromise(5000, '222222222222222', { signal: ac.signal })
          .then(() => {
            // 点击个人主页头像进入直播间
            robot.moveMouse(p1.x, p1.y);
            robot.mouseClick();
          })
          .catch((err) => {
            if (err.name === 'AbortError')
              console.error('The timeout was aborted');
          });

        await setTimeoutPromise(5000, '222222222222222', { signal: ac.signal })
          .then(() => {
            // 首次进入延时一点
            console.log(`delay 5 secs`);
          })
          .catch((err) => {
            if (err.name === 'AbortError')
              console.error('The timeout was aborted');
          });

        for (let i = 0; i < 30; i++) {
          if (ac.signal.aborted) {
            console.log(`Signal aborted is: ? ${ac.signal.aborted}`);
            break;
          }
          const random = Math.floor(Math.random() * fruits.length);
          console.log(random, fruits[random]);
          clipboard.writeText(fruits[random]);
          await setTimeoutPromise(3000, '333333333333333', {
            signal: ac.signal,
          })
            .then(() => {
              robot.moveMouse(p2.x, p2.y);
              robot.mouseClick();
            })
            .catch((err) => {
              if (err.name === 'AbortError')
                console.error('The timeout was aborted');
            });

          await setTimeoutPromise(1000, '333333333333333', {
            signal: ac.signal,
          })
            .then(() => {
              robot.keyTap('v', 'control');
            })
            .catch((err) => {
              if (err.name === 'AbortError')
                console.error('The timeout was aborted');
            });
          await setTimeoutPromise(1000, '333333333333333', {
            signal: ac.signal,
          })
            .then(() => {
              robot.keyTap('enter');
              robot.keyTap('enter');
            })
            .catch((err) => {
              if (err.name === 'AbortError')
                console.error('The timeout was aborted');
            });
        }
      }

      break;
    case 'pause':
      console.log('pause');
      ac.abort();
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
    height: 1200,
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
    const shortcutsMousePos = [
      'CommandOrControl+1',
      'CommandOrControl+2',
      'CommandOrControl+3',
    ];
    shortcutsMousePos.forEach((value) => {
      let ret = globalShortcut.register(value, () => {
        console.log(`${value} is pressed.`);
        var robot = require('robotjs');
        let pos = robot.getMousePos();
        switch (value) {
          case 'CommandOrControl+1':
            p1 = pos;
            mainWindow?.webContents?.send('mouse-pos', ['p1', p1]);
            break;
          case 'CommandOrControl+2':
            p2 = pos;
            mainWindow?.webContents?.send('mouse-pos', ['p2', p2]);
            break;
          case 'CommandOrControl+3':
            p3 = pos;
            mainWindow?.webContents?.send('mouse-pos', ['p3', p3]);
            break;

          default:
            break;
        }
      });

      if (!ret) {
        console.log('registration failed');
      }

      // Check whether a shortcut is registered.
      console.log(globalShortcut.isRegistered(value));
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
