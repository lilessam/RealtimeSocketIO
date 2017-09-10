<template>
<div>
    <h2>{{ title }}</h2>
    <div class="row">
        <input type="text" :class="{'form-control' : true}" v-model="task"  @keyup.enter="add()">
    </div>
    <div class="row" v-for="task in dbTasks">
    	{{ task.title }} - {{ task.done }} <button v-if="!task.done" class="btn btn-primary" type="button" @click="done(task._id)">Done</button>
    </div>
    <div class="row" v-for="task in tasks">
    	{{ task.title }} - {{ task.done }} <button v-if="!task.done" class="btn btn-primary" type="button" @click="done(task._id)">Done</button>
    </div>
</div>
</template>
<script>
	export default {

		/**
		 * Required Properties.
		 * @type {Array}
		 */
		props: ['title', 'dbTasks'],

		/**
		 * The component loaded.
		 * @return void
		 */
		mounted() {

			//Connect and add the channel
			socket.on('connect', () => {
				socket.emit('channel', this.channel)
			});

			//Set Tasks Listener
			socket.on('getTask', function(data) {
				//Push task to tasks array
                this.tasks.push(data)
            }.bind(this));

            //Set Mark Done Listenr
            socket.on('dbTaskDone', function(task_id) {
            	this.markAsDone(task_id);
            }.bind(this));
		},

		/**
		 * Component Data
		 * @return {object}
		 */
		data() {
			return {
			    task : null,
			    channel : 1,
			    tasks: []
			}
		},

		/**
		 * Component Methods.
		 * @type {Object}
		 */
		methods : {
			/**
			 * Add new task by emiting the task through socket.
			 */
			add : function () {
				socket.emit('newTask', this.task)

				//Empty the field
				this.task = null
			},

			/**
			 * Mark task as donw
			 * @param  {object} task
			 * @return void
			 */
			done(task_id) {
				socket.emit('taskDone', task_id);
			},

			/**
			 * Mark task as done by deleting its done button.
			 * @param  Integer  task_id
			 * @return void
			 */
			markAsDone(task_id) {
				var task = this.dbTasks.find(function(o) { return o._id == task_id; });
				if(task == undefined || task == null) {
					task = this.tasks.find(function(o) { return o._id == task_id; });
				}
				task.done = true;

				this.$forceUpdate();

				console.log(task);

			}
		}
	}
</script>