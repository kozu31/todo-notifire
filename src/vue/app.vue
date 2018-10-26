<template>
  <div>
    <section id="header" style="background: 'gray'">
      <h1>TODO Notifire</h1>
      <el-button id="add-new-task" v-on:click="addNewTask()">New</el-button>
      <span>Notify Time: </span>
      <el-time-select
        v-model="notifyInterval"
        v-bind:picker-options="{
          start: '00:00',
          step: '00:15',
          end: '23:45'
        }"
        v-on:change="changeNotifyInterval()"
        placeholder="Select notify time">
      </el-time-select>
    </section>
    <section id="content">
      <ul id="task-list">
        <li v-for="(task, index) in taskList">
          <span v-bind:style="{ color: task.statusColor}">{{ task.statusText }}</span>
          <el-input class="task-name" type="text" v-model="task.name" v-on:change="changeTaskName(index)"/>
          <el-date-picker
            v-model="task.limitDateTime"
            v-on:change="changeLimitDateTime(index)"
            type="datetime"
            placeholder="Select limit datetime">
          </el-date-picker>
          <el-button type="primary" icon="el-icon-delete" class="remove-task" v-on:click="removeTask(index)"></el-button>
        </li>
      </ul>
    </section>
  </div>
</template>
<script src="./js/app.js"></script>
