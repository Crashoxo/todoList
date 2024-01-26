<template>
  <div class="todo-list-container-area my-3">
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">待辦事項</span>
      </div>
      <!-- v-model抓值 -->
      <!-- @keyup.enter 按enter觸發 -->
      <input
        type="text"
        placeholder="準備要做的任務"
        class="form-control"
        v-model="newToDoValue"
        @keyup.enter="addList"
      />
      <div class="input-group-append">
        <button type="button" class="btn btn-danger" @click="addList">
          新增
        </button>
      </div>
    </div>
    <div class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <!-- 動態顯示 a頁籤 樣式 -->
            <!-- (btnActive = 0), (clickBtnPage = 1) 換頁時 點擊選擇第一頁(clickBtnPage)及樣式(btnActive)為起始值 -->
            <a
              id="all"
              class="nav-link"
              href="#"
              :class="{ active: visibility === 'all' }"
              @click="initClickBtnPage"
              >全部</a
            >
          </li>
          <li class="nav-item">
            <a
              id="active"
              class="nav-link"
              href="#"
              :class="{ active: visibility === 'active' }"
              @click="initClickBtnPage"
              >進行中</a
            >
          </li>
          <li class="nav-item">
            <a
              id="completed"
              href="#"
              class="nav-link"
              :class="{ active: visibility === 'completed' }"
              @click="initClickBtnPage"
              >已完成</a
            >
          </li>
        </ul>
      </div>
      <ul class="list-group list-group-flush text-left">
        <!-- filterToDoList 監聽變數 觸發 -->
        <!-- @dbl = @double 雙擊 編輯-->
        <li
          v-for="(item, key) in curPageList"
          class="list-group-item mission-dom"
          :key="item.id"
          @click="getData(item, key), changeListBg(item, key)"
          @dblclick="editToDoList(item)"
        >
          <!-- v-if 顯示 一般狀態 DOM -->
          <!-- 如果渲染的ID 不等於 選擇的ID 顯示 -->
          <div v-if="item.id !== catchToDoList.id" class="d-flex">
            <div class="form-check">
              <!-- 對應動態:id及:for -->
              <!-- v-model綁值 T or F -->
              <input
                type="checkbox"
                class="form-check-input"
                :id="item.id"
                v-model="item.completed"
                @change="localStorageClickSet"
              />
              <!-- 動態css -->
              <!-- 因v-model綁值item.completed T or F，點擊input or label時會切換value -->
              <label
                class="form-check-label"
                :class="{ completed: item.completed }"
                :for="item.id"
              >
                {{ item.title }}
              </label>
            </div>
            <button
              type="button"
              aria-label="Close"
              class="close btn-close-right"
              @click="removeSelectData(item)"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <!-- v-if 顯示 編輯 DOM -->
          <!-- 如果渲染的ID 等於 選擇的ID 顯示 -->
          <input
            v-if="item.id === catchToDoList.id"
            type="text"
            class="form-control"
            v-model="catchTitle"
            @keyup.esc="cancelEdit"
            @keyup.enter="doneEditToDoList(item)"
          />
        </li>
      </ul>
      <div class="card-footer d-flex justify-content-between">
        <span>共 {{ toDos.length }} 筆任務</span>
        <a class="btn-remove-all" href="#" @click.prevent="removeAll"
          >清除所有任務</a
        >
      </div>
    </div>

    <div
      class="btn-toolbar mb-3"
      role="toolbar"
      aria-label="Toolbar with button groups"
    >
      <div class="changePage mt-5">
        <div class="btn-group me-2" role="group" aria-label="First group">
          <!-- index+1 = 頁數 -->
          <!-- 點擊的頁數 = index + 1 -->
          <button
            v-for="(item, index) in pageCount"
            class="btn btn-outline-secondary"
            type="button"
            :key="item + index"
            :class="{ active: btnActive === index }"
            @click="changePage(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
    <!-- {{ getGetterMinutes }}
    {{ getGetterSeconds }}
    {{ getGetterBreakTime }} -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { localStorageSet } from "@/assets/js/localStorage";

export default {
  data() {
    return {
      newToDoValue: "", // 新增 輸入值
      toDos: [
        {
          id: "123",
          title: "資料1",
          completed: false,
          minutes: "00",
          seconds: "05",
          breakTime: false,
        },
      ],
      visibility: "all", // 頁籤切換倉庫
      catchToDoList: {}, // 暫存欲變動的物件 及 顯示DOM
      catchTitle: "", // 暫存title資料
      getPage: [], // 總共幾頁
      btnActive: 0, // active樣式
      pageData: [], // 該頁數內的資料
      showPageData: 5, //顯示幾頁
      clickBtnPage: 1, // 點擊第幾頁 btn
    };
  },
  methods: {
    // 抓值給 VueX Mutation變更
    ...mapActions({
      getActionGetId: "actionGetId",
      getActionTitle: "actionTitle",
      getActionMinutes: "actionMinutes",
      getActionSeconds: "actionSeconds",
      getActionsBreakTime: "actionsBreakTime",
    }),
    // 增加list資料
    addList() {
      // trim() 清理空白處
      const value = this.newToDoValue.trim();
      const timestamp = Math.floor(Date.now());
      // 防輸入空值
      if (value === "") {
        alert("請輸入任務");
        return;
      } else {
        this.toDos.push({
          id: timestamp,
          title: value,
          completed: false,
          minutes: this.getGetterMinutes,
          seconds: this.getGetterSeconds,
          breakTime: false,
        });
        localStorageSet(this.toDos);
        this.newToDoValue = "";
      }
    },
    // 清除單筆資料
    removeSelectData(selectItem) {
      // 因切換頁面後，index值會跑掉，而刪除到錯誤的資料，因此利用迴圈抓正確的index
      const deleteIndex = this.toDos.findIndex(
        (item) => item.id === selectItem.id
      );
      // console.log(deleteIndex);
      this.toDos.splice(deleteIndex, 1);

      localStorageSet(this.toDos);
    },
    // 清除全部資料
    removeAll() {
      this.toDos = [];
      localStorageSet(this.toDos);
    },
    // 編輯時將資料給予預設倉庫
    editToDoList(myItem) {
      this.catchToDoList = myItem;
      this.catchTitle = myItem.title;
    },
    // 編輯完，將預設倉庫資料及其他資料儲存
    doneEditToDoList(myEditItem) {
      // 抓索引值
      const doneEditIndex = this.toDos.findIndex((item) => {
        return +item.id === +myEditItem.id;
      });
      this.toDos[doneEditIndex] = {
        // 非於此處改時間及休息值，會點到哪給到哪。
        id: myEditItem.id,
        title: this.catchTitle,
        completed: false,
        minutes: this.getGetterMinutes,
        seconds: this.getGetterSeconds,
        breakTime: this.getGetterBreakTime,
      };
      console.log(this.catchTitle);
      // 該item標題 ＝ catchTitle 綁 v-model 輸入值倉庫
      myEditItem.title = this.catchTitle;
      this.catchTitle = "";
      this.catchToDoList = {}; // 回歸原始值 讓v-if顯示Dom
      localStorageSet(this.toDos);
    },
    // 取消編輯
    cancelEdit() {
      this.catchToDoList = {}; // 回歸原始值 讓v-if顯示Dom
    },
    // 改變各任務狀態時，儲存進localStorage
    localStorageClickSet() {
      localStorageSet(this.toDos);
    },
    // 切換工作目錄，回到該目錄第一頁，並給第一個按鈕active
    initClickBtnPage() {
      this.visibility = event.target.id;
      this.btnActive = 0; //給第一個按鈕active
      this.clickBtnPage = 1; //回到該目錄第一頁
    },
    // 點擊頁數，變化
    changePage(myIndex) {
      this.btnActive = myIndex;
      this.clickBtnPage = myIndex + 1;
    },
    // 點擊list給賦予顏色
    changeListBg(item, key) {
      const getAllMissionDom = document.querySelectorAll(".mission-dom");
      getAllMissionDom.forEach(function (item) {
        item.classList.remove("check-data-bg"); // 樣式全清空
      });
      getAllMissionDom[key].classList.add("check-data-bg");
    },
    // 點擊list將單筆資料給予VueX，藉此將資料顯示於另一元件
    getData(getSelectData, getSelectIndex) {
      // 頁數-1*5 解決 v-for 切頁錯誤
      // += 每頁數的第一筆資料外，需使用 ex: 8 = (2 - 1) * 5 + "3"
      if (this.clickBtnPage > 1) {
        getSelectIndex += (this.clickBtnPage - 1) * this.showPageData;
      }
      localStorageSet(this.toDos);
      this.getActionGetId(this.toDos[getSelectIndex].id);
      this.getActionTitle(this.toDos[getSelectIndex].title);
      this.getActionMinutes(this.toDos[getSelectIndex].minutes);
      this.getActionSeconds(this.toDos[getSelectIndex].seconds);
      this.getActionsBreakTime(this.toDos[getSelectIndex].breakTime);
    },
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
    // 取得各狀態總筆數
    filteredVisibleData() {
      return this.toDos.filter((item) => {
        let filterVisibility = "";
        switch (this.visibility) {
          case "active":
            filterVisibility = item.completed === false;
            break;
          case "completed":
            filterVisibility = item.completed === true;
            break;
          default:
            // 全部
            filterVisibility =
              // item.completed true 或 false 都回傳
              item.completed === true || item.completed === false;
            break;
        }
        return filterVisibility;
      });
      // 改成上方 同前
      // if (this.visibility === "all") {
      //   console.log("this.toDos", this.toDos);
      //   return this.toDos;
      // }
      // if (this.visibility === "active") {
      //   let activeFilter = this.toDos.filter((item) => {
      //     return item.completed === false;
      //   });
      //   console.log("activeFilter", activeFilter);
      //   return activeFilter;
      // }
      // if (this.visibility === "completed") {
      //   let completedFilter = this.toDos.filter((item) => {
      //     return item.completed === true;
      //   });
      //   console.log("completedFilter", completedFilter);
      //   return completedFilter;
      // }
      // return "";
    },
    // 使用監聽抓 渲染的方式
    // 目前分頁之列表
    curPageList() {
      if (this.clickBtnPage === 1) {
        let firstPage = this.filteredVisibleData.slice(0, this.showPageData); // 顯示5筆資料
        return firstPage;
      }
      // 顯示第二頁後資料
      return this.filteredVisibleData.slice(
        this.clickBtnPage - 1 * this.showPageData,
        this.clickBtnPage * this.showPageData
      );

      // let offset = (this.clickBtnPage - 1) * this.showPageData;
      // let pageData = this.filteredVisibleData.slice(
      //   offset,
      //   offset + this.showPageData
      // );
      // return pageData;

      // return是結束整個程式
      // break是結束switch（）
      // let activeToDoList = [];
      // let completedToDoList = [];
      // switch (this.visibility) {
      //   case "all":
      //     if (this.clickBtnPage === 1) {
      //       let firstPage = this.toDos.slice(0, this.showPageData); // 顯示5筆資料
      //       return firstPage;
      //     } else {
      //       // 顯示第二頁後資料
      //       let offset = (this.clickBtnPage - 1) * this.showPageData;
      //       let pageData = this.toDos.slice(offset, offset + this.showPageData);
      //       return pageData;
      //     }
      //   case "active":
      //     this.toDos.forEach(function (item) {
      //       if (item.completed === false) {
      //         activeToDoList.push(item);
      //       }
      //     });
      //     if (this.clickBtnPage === 1) {
      //       return activeToDoList.slice(0, this.showPageData); // 顯示5筆資料
      //     } else {
      //       // 顯示第二頁後資料
      //       let offset = (this.clickBtnPage - 1) * this.showPageData;
      //       let pageData = activeToDoList.slice(
      //         offset,
      //         offset + this.showPageData
      //       );
      //       return pageData;
      //     }
      //   case "completed":
      //     this.toDos.forEach(function (item) {
      //       if (item.completed === true) {
      //         completedToDoList.push(item);
      //       }
      //     });
      //     if (this.clickBtnPage === 1) {
      //       return completedToDoList.slice(0, this.showPageData); // 顯示5筆資料
      //     } else {
      //       // 顯示第二頁後資料
      //       let offset = (this.clickBtnPage - 1) * this.showPageData;
      //       let pageData = completedToDoList.slice(
      //         offset,
      //         offset + this.showPageData
      //       );
      //       return pageData;
      //     }
      //   default:
      //     console.warn(`Sorry, we are out of`);
      // }
    },
    // 藉由總筆數取得分頁
    pageCount() {
      // 寫法 1
      // let filterPage = Math.ceil(this.filteredVisibleData.length / 5);
      // 寫法 2
      // this.filteredVisibleData.forEach((item, index) => {
      //   if (index % 5 === 0) {
      //     filterPage.push([]);
      //   }
      // });
      // 寫法 3
      return Math.ceil(this.filteredVisibleData.length / 5) || 0;
    },
  },
  watch: {
    // 監聽 VueX getter
    // pomodoro藉由VueX傳來值，有變動時寫入TodoList
    getGetterSeconds() {
      const selectedItem = this.toDos.find(
        (item) => +item.id === +this.getGetterGetID
      );
      // 傳址
      if (selectedItem) {
        selectedItem.seconds = this.getGetterSeconds;
        selectedItem.breakTime = this.getGetterBreakTime;
      }
    },
    getGetterMinutes() {
      const selectedItem = this.toDos.find(
        (item) => +item.id === +this.getGetterGetID
      );
      // 傳址
      if (selectedItem) {
        selectedItem.minutes = this.getGetterMinutes;
      }
      // 同前，但前更簡略
      // this.toDos.forEach((item, index) => {
      //   if (item.id === this.getGetterGetID) {
      //     this.toDos[index].minutes = this.getGetterMinutes;
      //   }
      // });
    },
  },
  mounted() {
    const vm = this;
    console.log("this", vm);
  },
  created() {
    // 物件要用JSON.parse抓及建立
    if (JSON.parse(localStorage.getItem("myToDos"))) {
      this.toDos = JSON.parse(localStorage.getItem("myToDos"));
    }
  },
};
</script>
<style scoped>
/* <style scoped lang="scss"> */
* {
  text-decoration: none;
}

.todo-list-container-area {
  width: 450px;
}

.completed {
  text-decoration: line-through;
}
.btn-close-right {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  font-size: 18px;
  margin-left: auto;
  border-style: none;
  border-radius: 20px;
}

.btn-close-right {
  transition: all 0.3s ease;
}

.btn-close-right:hover {
  color: aliceblue;
  background-color: red;
  transition: all 0.3s ease;
}

.text-center {
  color: aliceblue;
  background-color: rgba(206, 206, 206, 0.418);
  border-style: none;
}

.nav-item > a {
  color: aliceblue;
}

.btn-remove-all {
  color: red;
}

.list-group-item {
  transition: all 0.3s ease;
}

.list-group-item:hover {
  color: aliceblue;
  background-color: #bb2d3baf;
  transition: all 0.5s ease;
}

.check-data-bg {
  font-weight: bold;
  color: aliceblue;
  background-color: #bb2d3b;
}

.text-left {
  height: 220px;
}
</style>
