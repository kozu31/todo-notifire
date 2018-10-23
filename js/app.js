const main = require('electron').remote.require('./main')
const notification = () => {
  main.notificationMainProcess()
}

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    notifyFlag: true,
    taskList: []
  },
  methods: {
    addNewTask: function () {
      console.log(new Date())
      this.taskList.push(
        {
          name: '',
          limitDate: Date.now().toString()
        }
      )
    },
    changeTaskName: function (index) {
      console.log(this.taskList[index].name)
    },
    changeLimitDate: function (index) {
      console.log(this.taskList[index].limitDate)
    },
    switchNotifyFlag: function () {
      this.notifyFlag = !this.notifyFlag
      console.log(this.notifyFlag)
      notification()
    }
  }
})
