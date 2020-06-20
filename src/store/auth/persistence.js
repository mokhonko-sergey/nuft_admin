function setPersistenceLocal(value) {
  localStorage.setItem("state", JSON.stringify(value));
  localStorage.setItem("remember", "true");
}

function isRemember() {
  return localStorage.getItem("remember") || false;
}

function setPersistenceSession(value) {
  sessionStorage.setItem("state", JSON.stringify(value));
}

function getPersistence() {
  return sessionStorage.getItem("state") || localStorage.getItem("state");
}

function clearPersistence() {
  localStorage.clear();
  sessionStorage.clear();
}

export {
  setPersistenceLocal,
  setPersistenceSession,
  getPersistence,
  clearPersistence,
  isRemember
};
