var mongoose = require('mongoose')
var connection = mongoose.createConnection('mongodb://localhost:27017/taskapp');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var TaskSchema = new Schema ({
    	title : String,
    	done : Boolean
    });


TaskSchema.statics.first = function (callBack) {
    return this.model('Task').findOne({}, {}, {}, callBack);
}

TaskSchema.statics.all = function (callBack) {
	return this.model('Task').find({}, callBack);
}

TaskSchema.statics.insert = function (params) {
	var task = this.model('Task')({
		title: params.title,
		done: params.done
	});
	return task.save(function(err, task) {
		console.log('A new user has been saved.');
	});
}

TaskSchema.statics.markAsDone = function (task_id) {
	
		this.model('Task').findById(task_id, function(err, task) {
			if(task == undefined || task == null ) {
				return console.log("TASK NOT FOUND.");
			}
			task.done = true;
			task.save(function(err) {
				if(err) {
					console.log("Task Saving Failed");
				}

				console.log("Task " + task._id + "has been saved");
			});
		});
	

}

var Task = connection.model('Task', TaskSchema);
module.exports = Task;