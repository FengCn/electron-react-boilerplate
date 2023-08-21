import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { Fragment, useEffect, useRef, useState } from 'react';
import { WebviewTag } from 'electron';
import { Dialog, Transition } from '@headlessui/react';
import FeoUsers from './FeoUsers/Page';
import MousePos from './components/MousePos';
import Duskui from './Duskui';

function Hello() {
  const [isOpen, setIsOpen] = useState(true);
  const webviewRef = useRef<WebviewTag>();

  window.electron.ipcRenderer.handleUrl((event, url) => {
    console.log(url);
    webviewRef.current?.loadURL(url);
  });

  const loadstart = () => {
    console.log('did-start-loading......');
  };

  const delay = (ms: number | undefined) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const chooseUserHandle = async (p: { aweme_user: { sec_uid: string } }) => {
    console.log(p);
    webviewRef.current?.loadURL(
      `https://www.douyin.com/user/${p.aweme_user.sec_uid}`
    );
    await delay(10000);
    console.log('Waited 10s');
    const node = webviewRef.current?.querySelector('img.PbpHcHqa');
    console.log(node);

    window.electron.ipcRenderer.sendMessage('robotjs', ['enter-room']);
  };

  const sharelink = async () => {
    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.douyin.com/user/MS4wLjABAAAACCO7graOYXxXBH-vKianQZCk58M7cgB749odJQKD5NE',
      }),
    };
    const response = await fetch(
      'https://www.xiaotuan.cn/api/dsr/share_link',
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    setIsOpen(false);
  };

  useEffect(() => {
    webviewRef.current?.addEventListener('did-start-loading', loadstart);
    webviewRef.current?.addEventListener('dom-ready', () => {
      console.log(`WebContentsId: ${webviewRef.current?.getWebContentsId()}`);
      const wcId = webviewRef.current?.getWebContentsId();
      window.electron.ipcRenderer.openWindow(wcId);
    });
  }, [webviewRef]);

  const handleClick = (e: { preventDefault: () => void }) => {
    console.log(e);
    e.preventDefault();
    console.log('The link was clicked...');

    webviewRef.current?.loadURL('http://www.baidu.com');

    // window.electron.ipcRenderer.sendMessage('robotjs', ['robotjs ping']);
  };

  return (
    <div className="h-full flex bg-slate-950">
      <div className="flex flex-col justify-center content-center flex-1">
        <webview
          ref={webviewRef}
          src="http://www.douyin.com"
          autosize
          allowpopups
          style={{ minHeight: '960px', flex: '1 1 0%' }}
        />
        <div className="flex justify-center text-white h-24">
          <div className="swap swap-rotate rounded-lg p-2.5 text-sm text-gray-500 hover:text-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            <input
              type="checkbox"
              onChange={(e) => {
                window.electron.ipcRenderer.sendMessage('robotjs', [
                  e.target.checked ? 'play' : 'pause',
                ]);
              }}
            />

            {/* <!-- pause svg --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="swap-on h-12 w-12 fill-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>

            {/* <!-- play svg --> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="swap-off h-12 w-12 fill-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col w-80 p-6">
        <div className="flex flex-col bg-slate-900 p-6 rounded-lg">
          <div className="py-2 flex justify-between w-full border-b-2 border-gray-500">
            <div className="flex justify-center items-center">
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl text-white">Scients</span>
            </div>
            <div id="button-group">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(true);
                }}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.25 12.75V18H12.75V12.75H18V11.25H12.75V6H11.25V11.25H6V12.75H11.25Z" />
                </svg>
                Add
              </button>
              <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10"
                  onClose={() => setIsOpen(false)}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Payment successful
                          </Dialog.Title>
                          <div className="mt-2">
                            <textarea
                              name="textarea-name"
                              placeholder="Write your thoughts here..."
                              className="focus:shadow-soft-primary-outline min-h-unset text-sm leading-5.6 ease-soft block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
                            />
                          </div>

                          <div className="mt-4">
                            <button
                              type="button"
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              onClick={() => {
                                sharelink();
                              }}
                            >
                              Got it, thanks!
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
          </div>
          <FeoUsers chooseUser={chooseUserHandle} />
        </div>

        <MousePos />
        <Link to="/duskui" className="text-white">go to duskui demo page</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/duskui" element={<Duskui />} />
      </Routes>
    </Router>
  );
}
