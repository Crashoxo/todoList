export default {
  // fn( context用來commit 或 dispatch 呼叫actions裡的其他方法 , 外部傳入的參數(沒有可省略) )
  // { commit } 解構賦值，只使用context.commit的方法
  actionMinutes({ commit }, payload) {
    commit("UPDATE_MINUTES", payload);
  },
  actionSeconds(context, payload) {
    context.commit("UPDATE_SECONDS", payload);
  },
  actionGetId(context, payload) {
    context.commit("UPDATE_GET_ID", payload);
  },
  actionTitle(context, payload) {
    context.commit("UPDATE_TITLE", payload);
  },
  actionsBreakTime(context, payload) {
    context.commit("UPDATE_BREAK_TIME", payload);
  },
};
