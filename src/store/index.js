import Vue from "vue";
import Vuex from "vuex";

// 拆分
const wholeModule = ["state", "getters", "actions", "mutations"].reduce(
  (root, name) => {
    // 執行(`./${name}`) 的 default
    // require 似 import
    // https://blog.niclin.tw/2019/10/03/nodejs-require-vs-es6-import-export/
    const storeFile = require(`./${name}`).default;

    // 格式會與原始的index.js相同
    return {
      // []動態
      [name]: {
        ...storeFile,
      },
      ...root,
    };
  },
  {}
);
Vue.use(Vuex);

export default new Vuex.Store(wholeModule);

// 以下被拆分到各資料夾內
// export default new Vuex.Store({
//   state: {
//     vuexSeconds: "",
//     vuexGetID: "",
//     vuexToDosTitle: "",
//     vuexBreakTime: "",
//     vuexMinutes: "",
//   },
//   // 修改state的唯一方法是透過提交(commit)某個mutations的屬性
//   // mutations 裡 無法使用 async/await 或 promise 等 "mutations"
//   mutations: {
//     // 方法二 commit是物件型態時
//     // payload 接收 commit傳進來的變數
//     // 只能動一變數
//     UPDATE_MINUTES(state, payload) {
//       state.vuexMinutes = payload;
//     },
//     UPDATE_SECONDS(state, payload) {
//       state.vuexSeconds = payload;
//     },
//     UPDATE_GET_ID(state, payload) {
//       state.vuexGetID = payload;
//     },
//     UPDATE_TITLE(state, payload) {
//       state.vuexToDosTitle = payload;
//     },
//     UPDATE_BREAK_TIME(state, payload) {
//       state.vuexBreakTime = payload;
//     },
//   },
//   actions: {
//     // fn( context用來commit 或 dispatch 呼叫actions裡的其他方法 , 外部傳入的參數(沒有可省略) )
//     actionMinutes(context, payload) {
//       context.commit("UPDATE_MINUTES", payload);
//     },
//     actionSeconds(context, payload) {
//       context.commit("UPDATE_SECONDS", payload);
//     },
//     actionGetId(context, payload) {
//       context.commit("UPDATE_GET_ID", payload);
//     },
//     actionTitle(context, payload) {
//       context.commit("UPDATE_TITLE", payload);
//     },
//     actionsBreakTime(context, payload) {
//       context.commit("UPDATE_BREAK_TIME", payload);
//     },
//   },
//   modules: {},
//   getters: {
//     // 要傳參數state + return
//     // 不會變更state
//     getterVuexMinutes(state) {
//       return state.vuexMinutes;
//     },
//     getterVuexSeconds(state) {
//       return state.vuexSeconds;
//     },
//     getterVuexGetID(state) {
//       return state.vuexGetID;
//     },
//     getterVuexToDosTitle(state) {
//       return state.vuexToDosTitle;
//     },
//     getterVuexBreakTime(state) {
//       return state.vuexBreakTime;
//     },
//   },
// });
