var Task = require('../models/Task');
module.exports = function(io) {
    return {

    	/**
    	 * Handle Index Page Route
    	 * @param  Request   req
    	 * @param  Response  res
    	 * @param  Next      next
    	 * @return Response
    	 */
        getIndex: function(req, res, next) {

        	/**
        	 * Handle Socket IO Connection
        	 */
            io.on('connection', (socket) => {

            	//Remove any previous listeners to prevent duplications
                socket.removeAllListeners()

                //Set Channel
                socket.on('channel', function(channel) {

                	//Leave channel if joined
                    if (socket.channel) socket.leave(socket.channel);

                    //Join channel
                    socket.channel = channel;
                    socket.join(channel);
                });

                // Current Channel
                var channel = 1

                //Get New Task From Client Side
                socket.in(channel).on('newTask', function(task) {

                	//Create Task Insertion Promise
                	var insertTaskPromise = new Promise(function(resolve, reject) {

                		//Insert New Task in DB
                		var db_new_task = Task.insert({title: task, done : false});

                		//Pass the new task
                		resolve(db_new_task);
                	});

                	insertTaskPromise.then(function(db_new_task){

                		//Return Task To Client Side
                        io.sockets.in(channel).emit('getTask', db_new_task);
                	});
                    
                });

                //Mark Task As Done
                socket.in(channel).on('taskDone', function(task_id) {
                	Task.markAsDone(task_id);
                	//Return done status to Client Side
                	io.sockets.in(channel).emit('dbTaskDone', task_id);
                });
            });
            

            //Getting Previous Tasks From DB With Promise
            var gettingTaskspromise = new Promise(function(resolve, reject) {

            	//Getting All Tasks
            	Task.all(function(err, tasks) {
            		//If there's an error fetching data
            		if(err) {
            			reject(Error("It broke"));
            		}

            		//Pass DB Tasks
            		resolve(tasks);
            	});

            });
            
            //Render view and pass DB tasks to it
            gettingTaskspromise.then(function(tasks) {
            	res.render('index', {
                    title: 'Express',
                    tasks : tasks
                });
            });
        }
    }
}