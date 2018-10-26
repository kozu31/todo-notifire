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
const taskStatus = {
  todo: { text: 'Todo', color: '#39ff64' },
  notified: { text: 'Notified', color: '#ffec2a' },
  expired: { text: 'Expired', color: '#ff2a2a' }
}

export default {
  data: {
    taskList: [],
    taskCheckInterval: 1000,
    notifyInterval: '30:00'
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
            limitDateTime: data.limitDateTime,
            notified: data.notified,
            expired: data.expired,
            statusText: data.statusText,
            statusColor: data.statusColor
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
        if (diff < notifyInterval && diff > 0) {
          if (task.notified) continue
          let title = 'そろそろタスクの締め切り前です!'
          let message = task.name
          let doc = {
            expired: true,
            statusText: taskStatus.notified.text,
            statusColor: taskStatus.notified.color
          }

          database.updateData(doc, { _id: task._id }, false, (res) => {
            if (!res) {
              console.log('Failed to change mode')
            } else {
              task.notified = true
              task.statusText = taskStatus.notified.text
              task.statusColor = taskStatus.notified.color
              notification(title, message)
            }
          })
        } else if (diff < 0) {
          if (task.expired) continue
          let title = '締め切りです!'
          let message = task.name
          let doc = {
            expired: true,
            statusText: taskStatus.expired.text,
            statusColor: taskStatus.expired.color
          }
          database.updateData(doc, { _id: task._id }, false, (res) => {
            if (!res) {
              console.log('Failed to change mode')
            } else {
              task.expired = true
              task.statusText = taskStatus.expired.text
              task.statusColor = taskStatus.expired.color
              notification(title, message)
            }
          })
        } else {
          let doc = {
            notified: false,
            expired: false,
            statusText: taskStatus.todo.text,
            statusColor: taskStatus.todo.color
          }
          database.updateData(doc, { _id: task._id }, false, (res) => {
            if (!res) {
              console.log('Failed to change mode')
            } else {
              task.expired = false
              task.notified = false
              task.statusText = taskStatus.todo.text
              task.statusColor = taskStatus.todo.color
            }
          })
        }
      }
    }, this.taskCheckInterval)
  },
  methods: {
    addNewTask: function () {
      let now = new Date()
      let date = now.setDate(now.getDate() + 1)
      let task = {
        name: '',
        limitDateTime: date,
        statusText: taskStatus.todo.text,
        statusColor: taskStatus.todo.color,
        notified: false,
        expired: false
      }
      this.taskList.push(task)
      database.insertData(task, (res) => {
        console.log(res)
        let _id = res._id
        let index = this.taskList.length - 1
        this.taskList[index]._id = _id
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
      console.log('changeTask')
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
