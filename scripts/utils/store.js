export function getStore(storeName) {
  return JSON.parse(localStorage.getItem(storeName) || "{}");
}

export function setStore(storeName, store) {
  const oldStore = getStore(storeName);
  const newStore = Object.assign({}, oldStore, store);
  localStorage.setItem(storeName, JSON.stringify(newStore));
}

export function getStoreItem(storeName, key) {
  return getStore(storeName)[key];
}

export function setStoreItem(storeName, key, value) {
  const store = getStore(storeName);
  store[key] = value;
  setStore(storeName, store);
}

export function removeStoreItem(storeName, key) {
  const store = getStore(storeName);
  delete store[key];
  setStore(storeName, store);
}

export function clearStore(storeName) {
  localStorage.removeItem(storeName);
}

export function clearAllStores() {
  localStorage.clear();
}
