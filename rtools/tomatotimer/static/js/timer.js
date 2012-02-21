$(document).ready(function(){

    //
    // CONSTANT
    //
    window.VIEW_TASK_ID_PREFIX = 'task-';
    window.INIT_TASK_ID = 0;

    window.TASK_TYPE = {
        'UNDEFINED':    'TASK-TYPE-UNDEFINED',
        'AI':           'TASK-TYPE-AI',
        'TODO':         'TASK-TYPE-TODO'
    };

    window.PRIORITY_2_STYLE = {
        'ITP-CRITICAL': 'label-important',
        'ITP-RUSH':     'label-warning',
        'ITP-NORMAL':   'label-info',
        'ITP-LOW':      '',
    };
    window.PRIORITY_2_TEXT = {
        'ITP-CRITICAL': 'Critical',
        'ITP-RUSH':     'Rush',
        'ITP-NORMAL':   'Normal',
        'ITP-LOW':      'Low',
    };
    window.PRIORITY_2_SHORT_TEXT = {
        'ITP-CRITICAL': 'C',
        'ITP-RUSH':     'R',
        'ITP-NORMAL':   'N',
        'ITP-LOW':      'L',
    };

	var AIViewGroups = [
		"AIListView", "AIAddView"
	];

	var buttonGroups = [
		"startButtonGroup", "interruptionButtonGroup", "breakButtonGroup"
	];

	var timers = [
// RELEASE
		{ name: "tomato", title: "Tomato", time: 1500 },
		{ name: "long_break", title: "Long Break", time: 900 },
		{ name: "short_break", title: "Short Break", time: 300 }

// DEBUG
//		{ name: "tomato", title: "Pomodoro Task", time: 25 },
//		{ name: "long_break", title: "Long break", time: 15 },
//		{ name: "short_break", title: "Short break", time: 5 }
//		{ name: "tomato", title: "Pomodoro Task", time: 5 },
//		{ name: "long_break", title: "Long break", time: 3 },
//		{ name: "short_break", title: "Short break", time: 1 }
	];

    //
    // TEMPLATE VAR
    //
    window.t_task = {
        id:             null, 
        title:          'Noname Task',
        desc:           'Task Description',
        priority:       'ITP-LOW',
        tomato:         0,
        interrupution:  0,
        taskType:       TASK_TYPE['UNDEFINED']
    };

    //
    // GLOBAL VARS
    //
    window.g_task_storage = new Array();
    window.g_current_task = new Object();
	var finalTaskMillis = -1;
	var timeout = null;

    //
    // PERMISSION
    //

	// check for notifications support
	if (window.webkitNotifications) {
		console.log("Notifications are supported!");

		permission = window.webkitNotifications.checkPermission();
		console.log("Current permission: " + permission);

		if ( permission == 2 ) {
			$('#no_permission').slideDown("slow");
		}
	} else {
		console.log("Notifications are not supported for this Browser/OS version yet.");
		$('#wrong_browser').slideDown("slow");
	}

	function requestPermission() {
		reqPerm = window.webkitNotifications.requestPermission(requestPermissionCallback)
		console.log("Request Permission: " + reqPerm);
	}

	function requestPermissionCallback() {
		permission = window.webkitNotifications.checkPermission();
		console.log("requestPermissionCallback: " + permission);
		if (permission == 1) {
			$('#missing_permission').modal('show');
		} else if ( permission == 2 ) {
			$('#no_permission').slideDown("slow");
		}
	}

    //
    // Utils
    //
    window.trace = function(funcName, message) {
        console.log('>' + funcName + ' starting----');
        console.log('>' + funcName + ' paraments:');
            
        if (typeof(message) != 'undefined') {
            $.each(message, function(key, val) {
                console.log('==>' + key + ': ' + val);
            });
        }
    };

    window.cloneObj = function(obj) {
        console.log('cloneObj>' + obj);

        return $.extend(true, {}, obj);
    };

    //
    // AJAX REQUEST
    //
    window.ajaxTaskCreate = function(task) {
        trace('ajaxTaskCreate');
        
        window._newid = null;

        $.ajax({
            async: false,
            url: '/tomatotimer/task/create/',
            data: {
                'title': task.title,
                'desc': task.desc,
                'priority': task.priority,
                'taskType': task.taskType
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);

                _newid = data;
            }
        });

        task.id = _newid;
        delete _newid;
    };

    window.ajaxTaskUpdate = function(task) {
        trace('ajaxTaskUpdate', {'task-id': task.id});

        $.ajax({
            async: false,
            url: '/tomatotimer/task/update/' + task.id +'/',
            data: {
                'title': task.title,
                'desc': task.desc,
                'priority': task.priority,
                'taskType': task.taskType
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
            }
        });
    };

    window.ajaxTaskDelete = function(id) {
        trace('ajaxTaskDelete', {'task-id': id});

        $.ajax({
            async: false,
            url: '/tomatotimer/task/delete/' + id +'/',
            success: function(data) {
                console.log(data);
            }
        });
    };

    //
    // TASK STORAGE
    //
    window.getTask = function(id) {
        trace('getTask', {'task-id': id});

        for (var _i=0; _i < g_task_storage.length; _i++) {
            if (g_task_storage[_i].id == id) {
                return cloneObj(g_task_storage[_i]);
            }
        }
    };

    window.getTaskIndex = function(id) {
        trace('getTaskIndex', {'task-id': id});

        for (var _i=0; _i < g_task_storage.length; _i++) {
            if (g_task_storage[_i].id == id) {
                return _i;
            }
        }
    };

    window.addTask = function(task) {
        trace('addTask', {'task-id': task.id});

        g_task_storage[g_task_storage.length] = cloneObj(task);
    };

    window.removeTask = function(id) {
        trace('removeTask', {'task-id': id});

        g_task_storage.splice(getTaskIndex(id), 1);
        // update server data
        ajaxTaskDelete(id);
    };

    window.addToTodo = function(id) {
        trace('addToTodo', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['TODO'];
        // update server data
        ajaxTaskUpdate(getTask(id));
    };

    window.removeFromTodo = function(id) {
        trace('removeFromTodo', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['UNDEFINED'];
        // update server data
        ajaxTaskUpdate(getTask(id));
    };

    window.addToAI = function(id) {
        trace('addToAI', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['AI'];
        // update server data
        ajaxTaskUpdate(getTask(id));
    };

    window.removeFromAI = function(id) {
        trace('removeFromAI', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['UNDEFINED'];
        // update server data
        ajaxTaskUpdate(getTask(id));
    };

    //
    // TASK VIEW
    //
    window.createTodoNode = function(task) {
        trace('createTodoNode', {'task-id': task.id});

        var _html = '';
        _html += '<tr id="'+VIEW_TASK_ID_PREFIX+task.id+ '">';
        _html += '<td>';
        _html += '<i class="icon-chevron-right"></i> <span class="label ' +PRIORITY_2_STYLE[task.priority]+ '">' +PRIORITY_2_SHORT_TEXT[task.priority]+ '</span> ';
        _html += '<span>' +task.title+ '</span> ';
        _html += '<span class="pull-right">';
        _html += '<span class="label label-success" onclick="doBtn(' +task.id+ ');">DO IT</span> ';
        _html += '<span class="label label-info" onclick="backToAIViewBtn(' +task.id+ ');">BACK</span> ';
        _html += '<span class="label label-important" onclick="removeFromTodoBtn(' +task.id+ ');">REMOVE</span>';
        _html += '</span>';
        _html += '</td>';
        _html += '</tr>';

        $('#todoListViewTableBody').prepend(_html);
    };

    window.createAINode = function(task) {
        trace('createAINode', {'task-id': task.id});

        var _html = '';
        _html += '<tr id="'+VIEW_TASK_ID_PREFIX+task.id+ '">';
        _html += '<td>' +task.title+ '</td>';
        _html += '<td><span class="label ' +PRIORITY_2_STYLE[task.priority]+'">' +PRIORITY_2_TEXT[task.priority]+ '</span></td>';
        _html += '<td><a href="#" class="btn btn-danger" onclick="removeFromAIBtn(' +task.id+ ');"><i class="icon-remove-sign icon-white"></i> Remove</a> <a class="btn btn-info" href="#" onclick="addToTodoViewBtn(' +task.id+ ')">Add TODO <i class="icon-chevron-right icon-white"></i></a></td>';
        _html += '</tr>';

        $('#AIListViewTableBody').prepend(_html);
    };

    window.initAIView = function() {
        trace('initAIView');

        var _aiList = $.grep(g_task_storage, function(val, key) {
            return val.taskType == TASK_TYPE['AI'];
        });

        $.each(_aiList, function(key, val) {
            createAINode(val);
        });

    };

    window.initTodoView = function() {
        trace('initTodoView');

        var _todoList = $.grep(g_task_storage, function(val, key) {
            return val.taskType == TASK_TYPE['TODO'];
        });

        $.each(_todoList, function(key, val) {
            createTodoNode(val);
        });
    };

    window.addToAIView = function(id) {
        trace('addToAIView', {'task-id': id});

        var _task = getTask(id);
        if (_task.taskType == TASK_TYPE['AI']) {
            createAINode(_task);   
        }
    };

    window.removeFromAIView = function(id) {
        trace('removeFromAIView', {'task-id': id});

        var _task = getTask(id);
        if (_task.taskType == TASK_TYPE['AI']) {
            $('#'+VIEW_TASK_ID_PREFIX + id).remove();
        }
    };

    window.addToTodoView = function(id) {
        trace('addToTodoView', {'task-id': id});

        var _task = getTask(id);
        if (_task.taskType == TASK_TYPE['TODO']) {
            createTodoNode(_task);
        }
    };

    window.removeFromTodoView = function(id) {
        trace('removeFromTodoView', {'task-id': id});

        var _task = getTask(id);
        if (_task.taskType == TASK_TYPE['TODO']) {
            $('#'+VIEW_TASK_ID_PREFIX  + id).remove();
        }
    };

    window.createCurrentNode = function(task) {
        trace('createCurrentNode', {'task-id': task.id});

        var _task = cloneObj(task);
        $('#currentTaskTitle').text(_task.title);
        $('#currentTaskDesc').text(_task.desc);
        $('#currentTaskStartTime').text('');
        $('#cuttentTaskFinishTime').text('');

        // update global cuttent task var
        g_current_task = _task;
    };

    //
    // TIMER
    //

    var initTimer = function(name) {
        trace('initTimer', {'name': name});

		for (_i = 0, _len = timers.length; _i < _len; _i++) {
			timer = timers[_i];
			if (timer.name == name) {
				$('#currentTime').addClass(timer.name);
			} else {
				$('#currentTime').removeClass(timer.name);
			}
		}

		var timer = getTimer(name);
		timerStart = new Date();
		timerName = name;

		$('#currentTime').html(formatTimeSec(timer.time));

		finalTaskMillis = timerStart.getTime() + (timer.time * 1000)
		console.log("finalTaskMillis: " + finalTaskMillis + " => " + (new Date (finalTaskMillis)));

		timeout = setTimeout("onTick()", 1000);
	};

	window.onTimeout = function() {
		taskFinished();

		var permission;
		permission = window.webkitNotifications.checkPermission();
		console.log("Permission: " + permission);
		if (permission == 0) {
			displayNotification();
		} else {
			console.log("NO window.webkitNotifications permission!");
		}
	};

	window.onTick = function() {
		if ( finalTaskMillis == -1 ) {
			return;
		}
		var currentTime = new Date();
		var remTime = Math.round((finalTaskMillis - currentTime.getTime()) / 1000);
		if ( remTime < 0 ) {
			remTime = 0;
		}
		$('#currentTime').html(formatTimeSec(remTime));

		console.log("onTick: " + (new Date()) + " - remTime: " + remTime);

		if (remTime > 0) {
			timeout = setTimeout("onTick()", 1000);
		} else {
			setTimeout("onTimeout()", 0);
		}
	};

	var taskFinished = function() {
        console.log("taskFinished");

		finalTaskMillis = -1;

		timerFinish = new Date();
		if ( timerName == 'tomato' ) {
            initButtonGroup('breakButtonGroup');
		} else {
            initButtonGroup('startButtonGroup');
		}
	};

	var formatTimeDate = function(date) {
		console.log("formatTimeDate: " + date)

		var h=date.getHours();
		var m=date.getMinutes();
		var s=date.getSeconds();
		// add a zero in front of numbers<10
		m=checkTime(m);
		s=checkTime(s);
		return h+":"+m+":"+s;
	};

	var checkTime = function(i) {
		if (i<10) {
			i="0" + i;
		}
		return i;
	};

	var getTimer = function(name) {
		console.log("getTimer: " + name);
		var timer, _i, _len;
		for (_i = 0, _len = timers.length; _i < _len; _i++) {
			timer = timers[_i];
			if (timer.name == name) {
				console.log("=> getTimer: " + timer);
				return timer;
			}
		}
	};

	var formatTimeSec = function(secs) {
		var minutes, secs_remainder;
		minutes = Math.floor(secs / 60);
		secs_remainder = secs - (minutes * 60);
		if (secs_remainder < 10) secs_remainder = "0" + secs_remainder;
		return minutes + ":" + secs_remainder;
	};

	var displayNotification = function() {
		var permission;
		permission = window.webkitNotifications.checkPermission();
		console.log("Permission: " + permission);

		var popup_html ;
		if ( timerName == 'tomato' ) {
			popup_html = "/tomatotimer/chrome/popup-tomato"
		} else {
			popup_html = "/tomatotimer/chrome/popup-break"
		}

		window.popup = popup = window.webkitNotifications.createHTMLNotification(popup_html);
		popup.show();
	};

    //
    // AI VIEW GROUP
    //
    var chAIViewGroup = function(name) {
        console.log("chAIViewGroup: " + name);

		for (_i = 0, _len = AIViewGroups.length; _i < _len; _i++) {
			AIViewGroup = AIViewGroups[_i];
			if (AIViewGroup == name) {
				$('#' + AIViewGroup).slideDown("slow");
			} else {
				$('#' + AIViewGroup).slideUp("slow");
			}
		}
	};

    // BUTTON GROUP
    var initButtonGroup = function(name) {
        trace('initButtonGroup', {'name': name});

		if ( timeout != null ) {
			console.log("Interrupt timeout: " + timeout);
			clearTimeout(timeout);
		}

		finalTaskMillis = -1;

		for (_i = 0, _len = buttonGroups.length; _i < _len; _i++) {
			buttonGroup = buttonGroups[_i];
			if (buttonGroup == name) {
				$('#' + buttonGroup).slideDown("fast");
			} else {
				$('#' + buttonGroup).slideUp("fast");
			}
		}
	};

    //
    // EVENT HANDLER
    //

    ///////////////////////////////////
    // AI View
    $('#addTaskBtn').click(function(event) {
		event.preventDefault();
		console.log("Clicked #addTaskBtn");

        var _task = cloneObj(t_task);
        _task.title     = $('#iTaskTitle').val();
        _task.priority  = $('#iTaskPriority').val();
        _task.desc      = $('#iTaskDesc').val();
        ajaxTaskCreate(_task); // add to server

        addTask(_task);
        addToAI(_task.id); // change taskType
        addToAIView(_task.id); // show

        // change view
        chAIViewGroup('AIListView');

        // reset form
        $('#addTaskForm')[0].reset();
    });

    $('#cancelAddTaskBtn').click(function(event) {
		event.preventDefault();
		console.log("Clicked #cancelAddTaskBtn");

        // change view
        chAIViewGroup('AIListView');

        // reset form
        $('#addTaskForm')[0].reset();
    });

    $('#newTaskBtn').click(function(event) {
		event.preventDefault();
		console.log("Clicked #newTaskBtn");

        // change view
        chAIViewGroup('AIAddView');
    });

    window.removeFromAIBtn = function(id) {
        trace('removeFromAIBtn');

        removeFromAIView(id);
        removeTask(id);
    };

    window.addToTodoViewBtn = function(id) {
        trace('addToTodoViewBtn');

        removeFromAIView(id);
        removeFromAI(id);
        addToTodo(id);
        addToTodoView(id);
    };

    ///////////////////////////////////
    // TODO View
    window.backToAIViewBtn = function(id) {
        trace('backToAIViewBtn');

        removeFromTodoView(id);
        removeFromTodo(id);
        addToAI(id);
        addToAIView(id);
    };

    window.removeFromTodoBtn = function(id) {
        trace('removeFromTodoBtn');

        removeFromTodoView(id);
        removeTask(id);
    };

    window.doBtn = function(id) {
        trace('doBtn');

        var _task = getTask(id);

        removeFromTodoView(id);
        removeTask(id);

        createCurrentNode(_task);
    };

	//
	// START TASK
	//

	$('#taskStart').click(function(event){
		event.preventDefault();
		trace('taskStart');

		if (window.webkitNotifications) {
			permission = window.webkitNotifications.checkPermission();
			if (permission == 1) {
				requestPermission();
			}
		}

		initButtonGroup('interruptionButtonGroup');

		initTimer('tomato');

        // update current task start time
	});

	//
	// TIME INTERRUPTION
	//

	$('#taskInterruption').click(function(event){
		event.preventDefault();
		trace('timeInterrupt');

		now = new Date();
		console.log("now: " + now);
		if ( timerName == 'tomato' ) {
			console.log("timerStart : " + timerStart);

			duration = Math.round((now - timerStart)/1000);
			console.log("duration: " + duration);

		} else {
			console.log("timerFinish: " + timerFinish);
			console.log("timerStart : " + timerStart);

			duration = Math.round((now - timerStart)/1000);
			console.log("duration: " + duration);

		}

		initButtonGroup('startButtonGroup');
	});

	//
	// START BREAK
	//

	$('#taskShortBreak').click(function(event){
		event.preventDefault();
		trace('shortBreak');

		initButtonGroup('interruptionButtonGroup');

		initTimer('short_break');
	});

	$('#taskLongBreak').click(function(event){
		event.preventDefault();
		trace('longBreak');

		initButtonGroup('interruptionButtonGroup');

		initTimer('long_break');
	});

    window.init = function() {
        trace('init');

        $.getJSON('/tomatotimer/task/read/all/', function(data){

            $.each(data, function(k, v) {
                var _task = cloneObj(t_task);
                _task.id = v.pk;
                _task.title = v.fields.title;
                _task.desc = v.fields.desc;
                _task.priority = v.fields.priority;
                _task.taskType = v.fields.taskType;

                addTask(_task);
            });

            initAIView();
            initTodoView();
        });
    };
    // init application
    init();
});
