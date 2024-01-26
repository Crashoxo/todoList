export const localStorageSet = (toDos) =>
  localStorage.setItem("myToDos", JSON.stringify(toDos));
