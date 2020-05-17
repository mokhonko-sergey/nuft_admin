function setPersistenceLocal(value) {
  localStorage.setItem("state", JSON.stringify(value));
}

function setPersistenceSession(value) {
  sessionStorage.setItem("state", JSON.stringify(value));
}

function clearPersistence() {
  localStorage.clear();
  sessionStorage.clear();
}

export { setPersistenceLocal, setPersistenceSession, clearPersistence };
