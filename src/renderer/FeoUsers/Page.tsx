import React, { useEffect, useState } from 'react';

interface people {
  id: number;
  live_status: number;
  aweme_user: {
    nickname: string;
    avatar_thumb_url_list_0: string;
    signature: string;
  };
}

function FeoUsers({ chooseUser }) {
  const [users, setUsers] = useState<people[]>([]);

  const fetchUsers = async () => {
    const resp = await fetch('https://pro.xiaotuan.cn/api/polls/feo_user_list');
    const data = await resp.json();
    setUsers(data);
  };

  function renderStatus(status: any) {
    switch (status) {
      case 0:
        return <p className="mt-1 text-xs leading-5 text-gray-500">Offline</p>;
      case 1:
        return (
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className="flex-none rounded-full bg-red-500/20 p-1">
              <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
            </div>
            <p className="text-xs leading-5 text-gray-500">直播中</p>
          </div>
        );
      case 2:
        return (
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs leading-5 text-gray-500">连线中</p>
          </div>
        );
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ul role="list" className=" divide-y divide-gray-100 overflow-scroll">
      {users.map((person) => (
        <li key={person.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={
                'https://p3-pc.douyinpic.com/img/' +
                person.aweme_user.avatar_thumb_url_list_0 +
                '~c5_300x300.jpeg?from=2956013662'
              }
              alt=""
            />
            <div className="min-w-0 flex-auto">
              <p className="text-xs text-white">
                <button onClick={() => chooseUser(person)}>
                  {person.aweme_user.nickname}
                </button>
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-300">
                {person.aweme_user.signature}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{person.role}</p>
            {renderStatus(person.live_status)}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default FeoUsers;
