import axios from 'axios';
import { message } from 'antd';
import { flatten } from 'lodash';
import { constants } from '@/constants';
import {
  AccessPoint,
  SelectedAccessPoint,
  Response,
  Notice,
  Referral,
  Settings,
  SubscribeInfo,
} from '@/type';
import { setToken, getToken } from './token';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post<any, Response>(`${constants.BASE_SERVER_URL}/base/user/login`, {
      email,
      pass_word: password,
    });
    const payload = response.data;
    if (payload.code === 0) {
      setToken(payload.data.token);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const saveCredentials = async (email: string, password: string) => {
  localStorage.setItem(constants.CREDENTIALS_KEY, JSON.stringify({ email, password }));
};

export const getCredentials = async () => {
  const payload = localStorage.getItem(constants.CREDENTIALS_KEY);
  let credentials = {
    email: '',
    password: '',
  };
  if (payload) {
    try {
      credentials = JSON.parse(payload);
    } catch (e) {
      console.log('credentials error', e);
    }
  }
  return credentials;
}

export const getLatestVersion = async (platform: string, arch: string) => {
  const result = await axios.get(`${constants.BASE_URL}/version/latest?os=${platform}&arch=${arch}`);
  return result.data;
};

export const fetchAccessPointList = async (): Promise<AccessPoint[]> => {
  const response = await axios.get<any, Response>(`${constants.BASE_SERVER_URL}/api/node/list`, {
    headers: {
      'x-token': getToken(),
    },
  });
  const payload = response.data;
  if (payload.code === 0) {
    const settings = await getSettings();
    const selectedNode = await getSelectedAccessPoint();
    const { developerMode } = settings;
    const list = payload.data
      .map((node: any, index: number) => {
        let coreTag = '';
        switch (node.type) {
          case 'v2ray':
            coreTag = 'CoreA';
            break;
          case 'trojan':
            coreTag = 'CoreB';
            break;
          case 'shadowsocks':
            coreTag = 'CoreC';
            break;
          default:
            coreTag = 'CoreA';
        };
        const selected = selectedNode ? node.type === selectedNode.type && node.id === selectedNode.id : index === 0
        return {
          ...node,
          core: coreTag,
          selected,
        };
      });
    return flatten<AccessPoint>(list).map(ap => {
      // explictly convert tags from string to array
      const nodeTags = JSON.parse(ap.tags as unknown as string);
      return {
        ...ap,
        tags: developerMode ? [ap.core, ...nodeTags] : nodeTags,
        avgMs: 0,
        alive: true,
      };
    }).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.id - b.id;
    });
  }
  message.error(payload.msg)
  return [];
};

const ACCESS_POINT_KEY = 'ACCESS_POINT';
export const selectAccessPoint = async (id: number, type: string): Promise<boolean> => {
  const payload = {
    id, type
  };
  localStorage.setItem(ACCESS_POINT_KEY, JSON.stringify(payload));
  return true;
};

export const getSelectedAccessPoint = async (): Promise<SelectedAccessPoint> => {
  const payload = localStorage.getItem(ACCESS_POINT_KEY);
  if (payload) {
    return JSON.parse(payload);
  }
  return null;
}

export const getPartialUpdatePath = async (platform: string, arch: string) => {
  const result = await axios.get(`${constants.BASE_URL}/version/latest?os=${platform}&arch=${arch}&type=update`);
  return result.data.url;
};

export const fetchNotices = async (): Promise<Notice[]> => {
  const response = await axios.get<any, Response>(`${constants.BASE_SERVER_URL}/api/notice/list`, {
    headers: {
      'x-token': getToken(),
    },
  });
  const payload = response.data;
  if (payload.code === 0) {
    return Promise.all(payload.data.map(async (item: Notice) => {
      const isRead = await isNewsRead(item.id);
      return {
        ...item,
        read: isRead,
      };
    }));
  }
  message.error(payload.msg)
  return [];
};

export const markAsRead = async (id: number) => {
  const payload = localStorage.getItem(constants.READ_NEWS_KEY) || '[]';
  const readIds = JSON.parse(payload);
  let ids = readIds;
  if (!readIds.find((newsId: number) => newsId === id)) {
    ids = [...ids, id];
  }
  localStorage.setItem(constants.READ_NEWS_KEY, JSON.stringify(ids));
};

const isNewsRead = async (id: number): Promise<boolean> => {
  const payload = localStorage.getItem(constants.READ_NEWS_KEY) || '[]';
  const readIds = JSON.parse(payload);
  return !!readIds.find((newsId: number) => newsId === id);
};

export const hasUnreadNews = async (notices: Notice[]): Promise<boolean> => {
  for (let notice of notices) {
    const read = await isNewsRead(notice.id);
    if (!read) {
      return true;
    } 
  }
  return false;
};

export const createReferral = async () => {
  try {
    const response = await axios.get<any, Response>(`${constants.BASE_SERVER_URL}/api/invite/check`, {
      headers: {
        'x-token': getToken(),
      },
      timeout: 5000,
    });
    console.log('response', response);
    return true;
  } catch (e) {
    console.log('create failed', e);
    return false;
  }
};

export const getReferral = async (): Promise<Referral | null> => {
  try {
    const response = await axios.get<any, Response>(`${constants.BASE_SERVER_URL}/api/invite/list`, {
      headers: {
        'x-token': getToken(),
      },
      timeout: 5000,
    });
    const payload = response.data;
    if (payload.code === 0) {
      return payload.data.data;
    }
    return null;
  } catch (e) {
    console.log('get referral failed', e);
    return null;
  }
}

export const saveSettings = async (settings: Settings) => {
  localStorage.setItem(constants.SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = async (): Promise<Settings> => {
  const payload = localStorage.getItem(constants.SETTINGS_KEY);
  let settings = constants.DEFAULT_SETTINGS;
  if (payload) {
    try {
      settings = JSON.parse(payload);
    } catch (e) {
      console.log('setting error', e);
    }
  }
  return settings;
};

export const getSubscribeInfo = async (): Promise<SubscribeInfo | null> => {
  const response = await axios.get<any, Response>(`${constants.BASE_SERVER_URL}/api/subscribe/list`, {
    headers: {
      'x-token': getToken(),
    },
  });
  const payload = response.data;
  if (payload.code === 0) {
    return payload.data;
  }
  message.error(payload.msg)
  return null;
};
