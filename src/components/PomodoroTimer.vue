<template>
  <div class="pomodoro-area">
    <div class="outerRing">
      <div class="timer">
        <h1 class="isShowTitle" v-show="isShowTitle">
          {{ getGetterToDosTitle }}
        </h1>
        <div id="time">
          <input
            type="text"
            id="minutes"
            v-model="minutes"
            :disabled="inputLock"
            :class="{ border: border }"
            @change="changeTime"
            @blur="resetStyleAndClearInterval"
          />
          <span id="colon">:</span>
          <input
            type="text"
            id="seconds"
            v-model="seconds"
            :disabled="inputLock"
            :class="{ border: border }"
            @blur="resetStyleAndClearInterval"
            @change="changeTime"
          />
        </div>
        <div @click="startAndStop" id="stop">{{ startStop }}</div>
        <span @click="editTime" id="setting">⚙</span>
      </div>
    </div>
    <h1 class="isShowBreak" v-if="isShowBreak">Take A Break</h1>

    <!-- {{ getGetterMinutes }}
    {{ getGetterSeconds }}
    {{ getGetterGetID }}
    {{ getGetterBreakTime }} -->
  </div>
</template>
<script>
// https://codepen.io/skay/pen/xxXGKZy
import { mapGetters, mapActions } from "vuex";
export default {
  name: "pomodoro",
  data() {
    return {
      startStop: "START",
      minutes: "00",
      seconds: "10",
      progress: false, // 偵測setInterval
      // 以下計算用
      speed: 1000,
      progressStart: 0,
      progressEnd: "",
      secRem: 0,
      minRem: 0,
      degTravel: 0,
      inputLock: true, // 編輯解鎖
      breakTimes: false, // 休息時間次數
      border: false, // 顯示編輯樣式框
      isShowBreak: false, // 顯示休息樣式
      isShowTitle: false, // 顯示任務名稱
    };
  },
  methods: {
    // 起始樣式
    resetStyleAndClearInterval() {
      if (this.progress) {
        clearInterval(this.progress);
      }
      const progressBar = document.querySelector(".outerRing");
      const minElem = document.querySelector("#minutes");
      const secElem = document.querySelector("#seconds");
      minElem.style.borderBottom = `none`;
      secElem.style.borderBottom = `none`;
      this.progress = false;
      this.progressStart = 0;
      progressBar.style.background = `conic-gradient(
				#17171a 360deg,
				#17171a 360deg
		  )`;
    },
    // 重置計算
    calculatingTime() {
      this.progressEnd = parseInt(this.minutes) * 60 + parseInt(this.seconds);
      this.degTravel = 360 / this.progressEnd;
    },
    // 執行 START 及 STOP
    startAndStop() {
      this.border = false;
      this.inputLock = true;
      // 全新番茄鐘
      if (this.startStop === "START") {
        this.calculatingTime();
        // 如果空值
        if (!(parseInt(this.minutes) === 0 && parseInt(this.seconds) === 0)) {
          this.startStop = "STOP";
          this.startStopProgress();
        } else {
          alert("Enter the Time Value in your Timer!");
        }
        // 執行到一半
      } else {
        this.startStop = "START";
        this.calculatingTime();
        this.startStopProgress(); // 關計算器
      }
    },
    // 判斷有沒有開過該時鐘
    startStopProgress() {
      // 判斷有沒有開過 setInterval
      // 如果沒有 新增 setInterval
      if (!this.progress) {
        this.progress = setInterval(this.progressTrack, this.speed);
      } else {
        // 有,關掉 clearInterval
        clearInterval(this.progress);
        this.progress = false;
        this.progressStart = 0;
        // 關掉 樣式保留
        // const progressBar = document.querySelector(".outerRing");
        // progressBar.style.background = `conic-gradient(
        // 	#17171a 360deg,
        // 	#17171a 360deg
        // )`;
      }
    },
    // 計算及每秒給樣式
    progressTrack() {
      this.startStop = "STOP";
      this.progressStart++;
      this.secRem = Math.floor((this.progressEnd - this.progressStart) % 60);
      this.minRem = Math.floor((this.progressEnd - this.progressStart) / 60);

      this.seconds =
        this.secRem.toString().length === 2 ? this.secRem : `0${this.secRem}`;

      this.minutes =
        this.minRem.toString().length === 2 ? this.minRem : `0${this.minRem}`;

      const progressBar = document.querySelector(".outerRing");
      progressBar.style.background = `conic-gradient(
      	#9d0000 ${this.progressStart * this.degTravel}deg,
      	#17171a ${this.progressStart * this.degTravel}deg
  		)`;
      this.getActionMinutes(this.minutes);
      this.getActionSeconds(this.seconds);

      // 時間到
      if (this.progressStart === this.progressEnd) {
        // 進入休息時間
        if (!this.breakTimes) {
          alert("休息時間開始");
          this.isShowBreak = true;
          // 預設休息時間
          this.minutes = "00";
          this.seconds = "05";
          this.calculatingTime(); // 重新計算
          this.resetStyleAndClearInterval(); // 起始樣式
          this.startAndStop();
        }
        // 休息時間結束
        else {
          progressBar.style.background = `conic-gradient(
				#00aa51 360deg,
				#00aa51 360deg
		  )`;
          clearInterval(this.progress);
          this.progress = false;
          this.startStop = "START";
          this.progressStart = 0;

          // 時間狀態轉起始
          this.breakTimes = false;
          this.getActionsBreakTime(this.breakTimes);

          if (parseInt(this.seconds) === 0) {
            alert("休息時間結束");
            return;
          }
        }
        this.breakTimes = true;
        this.getActionsBreakTime(this.breakTimes);
      }
    },
    // 點擊⚙編輯按鈕
    editTime() {
      this.inputLock = false;
      this.border = true;

      this.getActionMinutes(this.minutes);
      this.getActionSeconds(this.seconds);

      // 如果運行完休息時間，新的一輪
      if (!this.breakTimes) {
        this.isShowBreak = false;
      }
    },
    // 改input時間
    changeTime() {
      this.border = false; // 變換input完值關閉樣式
      this.getActionMinutes(this.minutes);
      this.getActionSeconds(this.seconds);
    },
    // 抓值給 VueX Mutation變更
    ...mapActions({
      getActionMinutes: "actionMinutes",
      getActionSeconds: "actionSeconds",
      getActionsBreakTime: "actionsBreakTime",
    }),
  },
  computed: {
    // 從VueX收值
    ...mapGetters({
      getGetterMinutes: "getterVuexMinutes",
      getGetterSeconds: "getterVuexSeconds",
      getGetterGetID: "getterVuexGetID",
      getGetterToDosTitle: "getterVuexToDosTitle",
      getGetterBreakTime: "getterVuexBreakTime",
    }),
  },
  watch: {
    // 監聽 VueX getter
    // 點擊todolist時，因id變動而執行此處
    getGetterGetID() {
      this.seconds = this.getGetterSeconds;
      this.minutes = this.getGetterMinutes;
      this.calculatingTime();
      // 關閉正在執行中的蕃茄鐘
      clearInterval(this.progress);
      this.startStop = "START";
      this.progress = false;
      this.progressStart = 0;
      // 顯示標題 關閉休息狀態
      this.isShowTitle = true;
      this.isShowBreak = this.getGetterBreakTime;
      // 圓環樣式清空
      const progressBar = document.querySelector(".outerRing");
      progressBar.style.background = `conic-gradient(
				#17171a 360deg,
				#17171a 360deg
      )`;
    },
  },
  mounted() {
    this.resetStyleAndClearInterval();
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700&display=swap");

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #616161;
  --normal-ring: #17171a;
  --red-ring: #9d0000;
  --green-ring: #00aa51;
  --timer-bg: radial-gradient(
    71.4% 71.4% at 51.7% 28.6%,
    #3a393f 0%,
    #17171a 100%
  );
  --font-timer: "Bebas Neue", cursive;
  --font-stsp: "Montserrat", sans-serif;
  --font-clr: #ffffff;
}

body {
  /* background: var(--bg); */
  /* background-image: url("../assets/bg9.gif"); */
  /* overflow: hidden; */
  min-height: 100vh;
  background-image: url("../assets/bg.jpg");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

.pomodoro-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 500px;
  background-color: transparent;
}

.outerRing {
  display: grid;
  place-items: center;
  height: 415px;
  width: 415px;
  background: var(--normal-ring);
  box-shadow: -5px 14px 44px #000000, 5px -16px 50px rgba(255, 255, 255, 0.15);
  border-radius: 50%;
}

.timer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  background: var(--timer-bg);
  box-shadow: inset 0px 0px 114px rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  padding: 8rem;
}

#time {
  display: flex;
  justify-content: center;
  text-align: center;
  width: 300px;
  align-items: center;
  margin: 3rem 0 0 0;
}

#time input {
  width: 50%;
  color: var(--font-clr);
  text-align: center;
  font-family: var(--font-timer);
  font-size: 7rem;
  letter-spacing: 0.1em;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: transparent;
  border-style: none;
}

#colon {
  color: var(--font-clr);
  font-size: 64px;
}

#stop {
  color: var(--font-clr);
  cursor: pointer;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.25rem;
  text-align: center;
  letter-spacing: 0.6em;
  margin: 1rem 0;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

#setting {
  width: 25px;
  height: 25px;
  color: var(--font-clr);
  font-size: 2rem;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
}

#setting:hover {
  color: red;
  transition: all 0.3s ease;
}

.isShowBreak {
  position: absolute;
  top: -18%;
  left: 22%;
  color: var(--font-clr);
  /* border: 1px var(--font-clr) solid;
  border-radius: 20px;
  padding: 5px; */
}
.isShowTitle {
  color: var(--font-clr);
  font-size: 2rem;
  text-align: center;
  letter-spacing: 5px;
  margin-bottom: -27%;
}
</style>
