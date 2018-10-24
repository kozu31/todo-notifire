import '../css/style.css'
import '../css/task.css'
import '../css/header.css'
import { remote } from 'electron'

const notify = remote.require('./notifier')
const notification = (title, message) => {
  notify.notification(title, message)
}

const database = remote.require('./database')
const setting = remote.require('./setting')
/*
const main = require('electron').remote.require('./notifier')
const notification = () => {
  main.notification()
}
*/
export default {
  data: {
    taskList: [],
    taskCheckInterval: 6000,
    notifyInterval: '30:00',
  },
  created: function () {
    this.taskCheckInterval = setting.get('taskCheckInterval')
    this.notifyInterval = setting.get('notifyInterval')
    database.findData({}, { created: 1 }, (res) => {
      if (!res) {
        console.log('Failed loading')
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
  mounted: function () {
    // 締め切り直前と締め切り後のタスクを通知する
    setInterval(() => {
      let notifyInterval = (() => {
        let strs = this.notifyInterval.split(':')
        let hours = parseInt(strs[0], 10) * 60 * 60 * 1000
        let minutes = parseInt(strs[1], 10) * 60 * 1000
        return hours + minutes
      })()
      for (let task of this.taskList) {
        if (!task.name || !task.limitDateTime) continue
        let now = Date.parse((new Date()))
        let limitDateTime = Date.parse(task.limitDateTime)
        let diff = limitDateTime - now
        if (diff < notifyInterval && diff > 0 && !task.notified) {
          console.log(notifyInterval, diff)
          let title = 'そろそろタスクの締め切り前です!'
          let message = task.name
          database.updateData({ notified: true }, { _id: task._id }, false, (res) => {
            if (!res) {
              console.log('Failed notified')
            } else {
              task.notified = true
              notification(title, message)
            }
          })
        } else if (now > limitDateTime && !task.expired) {
          console.log(notifyInterval, diff)
          let title = '締め切りです!'
          let message = task.name
          task.expired = true
          database.updateData({ expired: true }, { _id: task._id }, false, (res) => {
            if (!res) {
              console.log('Failed expired')
            } else {
              notification(title, message)
            }
          })
        }
      }
    }, this.taskCheckInterval)
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
        limitDateTime: task.limitDateTime,
        notified: false,
        expired: false
      }
      database.updateData(doc, param, false, (res) => {
        if (!res) {
          console.log('Failed updating')
        }
      })
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
    },
    changeNotifyInterval: function () {
      setting.set('notifyInterval', this.notifyInterval)
    }
  }
}
