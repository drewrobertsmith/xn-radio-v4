import { MMKV } from "react-native-mmkv";

export const mmkv = new MMKV();

export const mmkvStorage = {
  setItem: (key, value) => {
    mmkv.set(key, value);
    return Promise.resolve();
  },
  getItem: (key) => {
    const value = mmkv.getString(key);
    return Promise.resolve(value ? value : null);
  },
  removeItem: (key) => {
    mmkv.delete(key);
    return Promise.resolve();
  },
};
