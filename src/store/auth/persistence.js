function setPersistenceLocal(value) {
  localStorage.setItem("state", JSON.stringify(value));
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
  clearPersistence
};
