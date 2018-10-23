<template>
  <div>
    <section id="header" style="background: 'gray'">
      <h1>TODO Notifire</h1>
      <el-button id="add-new-task" v-on:click="addNewTask()">New</el-button>
      <el-button id="switch-notify" v-on:click="switchNotifyFlag()">Notify</el-button>
    </section>
    <section id="content">
      <ul id="task-list">
        <li v-for="(task, index) in taskList" v-bind:key="task._id">
          <el-input class="task-name" type="text" v-model="task.name" v-on:blur="changeTaskName(index)"/>
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
