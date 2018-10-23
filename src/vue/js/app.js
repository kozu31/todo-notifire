import '../css/style.css'
import '../css/task.css'
import '../css/header.css'
import { remote } from 'electron'

const notify = remote.require('./notifier')
const notification = () => {
  notify.notification()
}

const database = remote.require('./database')
/*
const main = require('electron').remote.require('./notifier')
const notification = () => {
  main.notification()
}
*/
export default {
  data: {
    message: 'Hello Vue3!',
    taskList: []
  },
  created: function () {
    database.findData({}, { created: 1 }, (res) => {
      if (!res) {
        window.alert('Failed loading')
      } else {
        let datas = res
        for (let index in datas) {
          let data = datas[index]
          this.taskList.push({
            _id: data._id,
            name: data.name,
            limitDateTime: data.limitDateTime
          })
        }
      }
    })
  },
  methods: {
    addNewTask: function () {
      let task = {
        name: '',
        limitDateTime: '',
        notified: false,
        expired: false
      }
      database.insertData(task, (res) => {
        console.log(res)
        this.taskList.push(res)
      })
    },
    changeTaskName: function (index) {
      let task = this.taskList[index]
      let param = {
        _id: task._id
      }
      let doc = {
        name: task.name.trim()
      }
      database.updateData(doc, param, false, (res) => {
        if (!res) {
          console.log('Failed updating')
        }
      })
    },
    changeLimitDateTime: function (index) {
      let task = this.taskList[index]
      let param = {
        _id: task._id
      }
      let doc = {
        limitDateTime: task.limitDateTime
      }
      database.updateData(doc, param, false, (res) => {
        if (!res) {
          console.log('Failed updating')
        }
      })
    },
    switchNotifyFlag: function () {
      this.notifyFlag = !this.notifyFlag
      console.log(this.notifyFlag)
      notification()
    },
    removeTask: function (index) {
      let task = this.taskList[index]
      let param = {
        _id: task._id
      }
      database.removeData(param, false, (res) => {
        if (!res) {
          console.log('Failed removing')
        } else {
          this.taskList.splice(index, 1)
        }
      })
    }
  }
}
