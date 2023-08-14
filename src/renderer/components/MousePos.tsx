import React, { useState } from 'react';

interface pos {
  x: number;
  y: number;
}

function MousePos() {
  const [p1, setP1] = useState<pos>({ x: 0, y: 0 });
  window.electron.ipcRenderer.handleMousePos((e, args) => {
    console.log(args);
    switch (args[0]) {
      case 'p1':
        setP1(args[1])
        break;

      default:
        break;
    }
  });

  return (
    <div className="flex flex-row w-full">
      <div className="basis-1/3 ml-3 text-xs leading-5 font-medium text-sky-600 dark:text-sky-400 bg-sky-400/10 rounded-full py-1 px-3 hidden xl:flex items-center hover:bg-sky-400/20">
        x: {p1.x}, y: {p1.y}
      </div>
      <div className="basis-1/3 ml-3 text-xs leading-5 font-medium text-sky-600 dark:text-sky-400 bg-sky-400/10 rounded-full py-1 px-3 hidden xl:flex items-center hover:bg-sky-400/20">
        2
      </div>
      <div className="basis-1/3 ml-3 text-xs leading-5 font-medium text-sky-600 dark:text-sky-400 bg-sky-400/10 rounded-full py-1 px-3 hidden xl:flex items-center hover:bg-sky-400/20">
        3
      </div>
    </div>
  );
}

export default MousePos;
