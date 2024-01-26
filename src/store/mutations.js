export default {
  // 方法二 commit是物件型態時
  // payload 接收 commit傳進來的變數
  // 只能動一變數
  UPDATE_MINUTES(state, payload) {
    state.vuexMinutes = payload;
  },
  UPDATE_SECONDS(state, payload) {
    state.vuexSeconds = payload;
  },
  UPDATE_GET_ID(state, payload) {
    state.vuexGetID = payload;
  },
  UPDATE_TITLE(state, payload) {
    state.vuexToDosTitle = payload;
  },
  UPDATE_BREAK_TIME(state, payload) {
    state.vuexBreakTime = payload;
  },
};
