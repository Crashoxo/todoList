import Vue from "vue";
import VueRouter from "vue-router";

// 自訂元件
import PomodoroTimer from "@/components/PomodoroTimer";
import ToDoList from "@/components/ToDoList";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    components: {
      default: ToDoList,
      // 與 `<router-view>` 上的 `name` 屬性相符
      PomodoroTimer,
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
