const RESPONSE_MESSAGES = {
  REJECT: {
    NOT_DELETED: "Неможливо видалити або користувач не існує",
    NOT_BLOCK: "Не вдалося виконати дію",
    NOT_NEW_USER: "Не вдалося зареєструвати користувача",
    NOT_UPDATED: "Не вдалося оновити інформацію",
    ERROR: "Сталася помилка",
    EMPTY_PASS: "Заповніть поле пароля",
    PASS_NOT_MATCHED: "Паролі не співпадають"
  },
  SUCCESS: {
    DELETED: "Користувача видалено",
    BLOKED: "Користувача заблоковано",
    UNBLOKED: "Користувач активний",
    NEW_USER: "Нового користувача зареєстровано",
    UPDATED: "Інформацію оновлено"
  }
};

export { RESPONSE_MESSAGES };
