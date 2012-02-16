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

    //
    // TEMPLATE VAR
    //
    window.t_task = {
        id:         '', 
        title:      '',
        desc:       '',
        priority:   '',
        startTime:  '',
        finishTime: '',
        taskType:   TASK_TYPE['UNDEFINED']
    };

    //
    // GLOBAL VARS
    //
    window.g_task_storage = new Array();

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
    // TASK STORAGE
    //
    window.getTask = function(id) {
        trace('getTask', {'task-id': id});

        return cloneObj(jQuery.grep(g_task_storage, function(key, val, id) {
                return (val.id == id); 
        })[0]);
    };

    window.getTaskIndex = function(id) {
        trace('getTaskIndex', {'task-id': id});

        for (var _i=0; _i < g_task_storage.length; _i++) {
            if (g_task_storage[_i].id == id) {
                return _i;
                break;
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
    };

    window.addToTodo = function(id) {
        trace('addToTodo', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['TODO'];
    };

    window.removeFromTodo = function(id) {
        trace('removeFromTodo', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['UNDEFINED'];
    };

    window.addToAI = function(id) {
        trace('addToAI', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['AI'];
    };

    window.removeFromAI = function(id) {
        trace('removeFromAI', {'task-id': id});

        g_task_storage[getTaskIndex(id)].taskType = TASK_TYPE['UNDEFINED'];
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
        _html += '<span class="label label-success" onclick="doTask(' +task.id+ ');">DO IT!!!</span> ';
        _html += '<span class="label label-info" onclick="backToActivityInventoryListView(' +task.id+ ');">BACK</span> ';
        _html += '<span class="label label-important" onclick="removeTaskFromTodoListView(' +task.id+ ');">REMOVE</span>';
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
        _html += '<td><a href="#" class="btn btn-danger" onclick="removeTaskFromActivityInventoryListView(' +task.id+ ');"><i class="icon-remove-sign icon-white"></i> Remove</a> <a class="btn btn-info" href="#" onclick="appendToTodoListView(' +task.id+ ')">Add TODO <i class="icon-chevron-right icon-white"></i></a></td>';
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

    //
    // EVENT HANDLER
    //
    $('#addTaskBtn').click(function(event) {
		event.preventDefault();
		console.log("Clicked #addTaskBtn");

        var _task = cloneObj(t_task);
        _task.id        = INIT_TASK_ID; INIT_TASK_ID++;
        _task.title     = $('#iTaskTitle').val();
        _task.priority  = $('#iTaskPriority').val();
        _task.desc      = $('#iTaskDesc').val();

        addTask(_task);
    });
});

/*
    //
    // VAR INIT
    //

	var POPUP_CANCEL_TIMEOUT = -1;
	var DEFAULT_TASK_DESC = '[nameless tomatotimer task]';
    var LAST_TASK_DESC = "timout:last_task_desc";
    var LAST_TASK_START_TIME = "timout:last_task_start_time";

//	var currentTaskTitle = 'Task';
	var timerStart = null;
	var timerFinish = null;
	var timerName = 'unknown';

	var popup = null;
	var currentTaskDesc = DEFAULT_TASK_DESC;
	var finalTaskMillis = -1;
	var timeout = null;
    var last_task_id = INIT_TASK_ID;

    window.aiTaskList = new Array();
    window.todoTaskList = new Array();
    window.last_task = null;


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

	var buttonGroups = [
		"startButtonGroup", "interruptionButtonGroup", "breakButtonGroup"
	];

	var AIGroups = [
		"activityInventoryListView", "activityInventoryAppendView"
	];

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
    // INIT EXECUTE
    //
    initActivityInventoryListView();
    initTooltips();

	//
	// FUNCTIONS
	//

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

	function displayNotification() {
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

		if ( POPUP_CANCEL_TIMEOUT != -1 ) {
			setTimeout("popup.cancel()", POPUP_CANCEL_TIMEOUT);
		}
	}

	function taskFinished() {
        console.log("taskFinished");
		//#$('#lastDescription').html(currentTaskDesc);

		finalTaskMillis = -1;

		timerFinish = new Date();
		if ( timerName == 'tomato' ) {
			//$('#currentTaskFinish').html(formatTimeDate(timerFinish));
            initButtonGroup('breakButtonGroup');
		} else {
			//$('#lastBreakFinish').html(formatTimeDate(timerFinish));
            initButtonGroup('startButtonGroup');
		}
	}

	function formatTimeDate(date) {
		console.log("formatTimeDate: " + date)

		var h=date.getHours();
		var m=date.getMinutes();
		var s=date.getSeconds();
		// add a zero in front of numbers<10
		m=checkTime(m);
		s=checkTime(s);
		return h+":"+m+":"+s;
	};

	function checkTime(i) {
		if (i<10) {
			i="0" + i;
		}
		return i;
	}

	function getTimer(name) {
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

	function formatTimeSec(secs) {
		var minutes, secs_remainder;
//		secs = millis / 1000;
		minutes = Math.floor(secs / 60);
//		if (minutes < 10) minutes = "0" + minutes;
		secs_remainder = secs - (minutes * 60);
		if (secs_remainder < 10) secs_remainder = "0" + secs_remainder;
		return minutes + ":" + secs_remainder;
	};

    function initTooltips() {
        $('#activityInventoryTitle').popover({
            title: 'Activity Inventory',
            content: 'You can add one task by clicking "New Task" Button. And then pick any task to Today\'s TODO List.',
        });

        $('#aiPriority').popover({
            placement: 'top',
            title: 'Task Priority',
            content: 'Task priorities sorted by urgency level are "Critical", "Rush", "Normal", "Low".',
        });
    }

    // INIT BUTTONGROUP
    function initButtonGroup(name) {
        console.log("initButtonGroup: " + name);

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
		if ( popup != null ) {
			popup.cancel();
			popup = null;
		}
	}

    // INIT ACTIVITYINVENTORYGROUP
    function initAIGroup(name) {
        console.log("initAIGroup: " + name);

		for (_i = 0, _len = AIGroups.length; _i < _len; _i++) {
			AIGroup = AIGroups[_i];
			if (AIGroup == name) {
				$('#' + AIGroup).slideDown("slow");
			} else {
				$('#' + AIGroup).slideUp("slow");
			}
		}
        /*
		if ( popup != null ) {
			popup.cancel();
			popup = null;
		}
        *//*
	}

    // INIT TIMER
    function initTimer(name) {
        console.log("initTimer: " + name);

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
//		$('#currentTitle').html(timer.title);
//		$('#currentTaskStart').html(formatTimeDate(timerStart));

		finalTaskMillis = timerStart.getTime() + (timer.time * 1000)
		console.log("finalTaskMillis: " + finalTaskMillis + " => " + (new Date (finalTaskMillis)));

		timeout = setTimeout("onTick()", 1000);
	};

	//
	// START TASK
	//

	$('#taskStart').click(function(event){
		event.preventDefault();
		console.log("Clicked #taskStart");

		if (window.webkitNotifications) {
			permission = window.webkitNotifications.checkPermission();
			if (permission == 1) {
				requestPermission();
			}
		}

        // set current task description
/*		currentTaskDesc = $('#taskDescription').val();
		if ( currentTaskDesc == '' ) {
			currentTaskDesc = DEFAULT_TASK_DESC;
		}

		$('#currentTaskDesc').html(currentTaskDesc);
*//*

		initButtonGroup('interruptionButtonGroup');

		initTimer('tomato');

		localStorage[LAST_TASK_DESC] = currentTaskDesc;
		localStorage[LAST_TASK_START_TIME] = (new Date()).getTime();
	});

	//
	// TIME INTERRUPTION
	//

	$('#taskInterruption').click(function(event){
		event.preventDefault();
		console.log("Clicked #timeInterrupt");

		now = new Date();
		console.log("now: " + now);
		if ( timerName == 'tomato' ) {
			console.log("timerStart : " + timerStart);

			//$('#lastTaskStart').html(formatTimeDate(timerStart));
			duration = Math.round((now - timerStart)/1000);
			console.log("duration: " + duration);
			//$('#lastTaskDuration').html(formatTimeSec(duration));

			//initInputMessages('interruptedTaskMessage');
		} else {
			console.log("timerFinish: " + timerFinish);
			console.log("timerStart : " + timerStart);

			//$('#lastTaskFinish2').html(formatTimeDate(timerFinish));
			duration = Math.round((now - timerStart)/1000);
			console.log("duration: " + duration);
			//$('#lastBreakDuration').html(formatTimeSec(duration));

			//initInputMessages('interruptedBreakMessage');
		}

		initButtonGroup('startButtonGroup');
	});

	//
	// START BREAK
	//

	$('#taskShortBreak').click(function(event){
		event.preventDefault();
		console.log("Clicked #shortBreak");

		//$('#lastDescription').html(currentTaskDesc);

		initButtonGroup('interruptionButtonGroup');

		initTimer('short_break');
	});

	$('#taskLongBreak').click(function(event){
		event.preventDefault();
		console.log("Clicked #longBreak");

		//$('#lastDescription').html(currentTaskDesc);

		initButtonGroup('interruptionButtonGroup');

		initTimer('long_break');
	});

    //
    // Activity Inventory Group View
    //
	$('#cancelAppendTask').click(function(event){
		event.preventDefault();
		console.log("Clicked #cancelAppendTask");

        initAIGroup('activityInventoryListView');

        // reset form
        $('#appendTaskForm')[0].reset();
    });
    
	$('#appendTask').click(function(event){
		event.preventDefault();
		console.log("Clicked #appendTask");

        // append task
        var _task = $(o_task);
        _task.id = last_task_id; last_task_id += 1;
        _task.title = $('#itaskTitle').val();
        _task.desc = $('#itaskDesc').val();
        _task.priority = $('#itaskPriority').val();

        aiTaskList[aiTaskList.length] = _task;

        appendToActivityInventoryListView(_task);

        initAIGroup('activityInventoryListView');

        // reset form
        $('#appendTaskForm')[0].reset();
    });
    
	$('#appendTaskIcon').click(function(event){
		event.preventDefault();
		console.log("Clicked #appendTaskIcon");

        initAIGroup('activityInventoryAppendView');
    });
/*
//	var POPUP_CANCEL_TIMEOUT = 66666;
//	var POPUP_CANCEL_TIMEOUT = 10600;
//	var POPUP_CANCEL_TIMEOUT = 1000;


	var inputMessages = [
		"interruptedTaskMessage", "skippedBreakMessage", "lastTaskMessage", "interruptedBreakMessage"
	];


	function initInputMessages(name) {
		for (_i = 0, _len = inputMessages.length; _i < _len; _i++) {
			inputMessage = inputMessages[_i];
			if (inputMessage == name) {
				$('#' + inputMessage).show();
			} else {
				$('#' + inputMessage).hide();
			}
		}
	}

	//
	// PERMISSION
	//

	$('#setPermission').click(function(event){
		event.preventDefault();
		console.log("Clicked #setPermission");

		$('#missing_permission').modal('hide');

		requestPermission();
	});

	$('#setPermissionClose').click(function(event){
		event.preventDefault();
		console.log("Clicked #setPermissionClose");

		// set NEVER_ASK_AGAIN
	});
	//
	// INIT VALUES
	//

	$('#taskDescription').html(localStorage[LAST_TASK_DESC]);
	$('#taskDescription').val(localStorage[LAST_TASK_DESC]);
	if ( localStorage[LAST_TASK_START_TIME] ) {
		pomodoroStart = new Date();
		pomodoroStart.setTime(localStorage[LAST_TASK_START_TIME]);
		console.log("pomodoroStart: " + pomodoroStart);
		$('#pomodoroStart').html(formatTimeDate(pomodoroStart));
	}

*//*
});

//
// Activity Inventory Operation
//
function initActivityInventoryListView() {
    console.log("initActivityInventoryListView");

    for (_i = aiTaskList.length - 1; _i >= 0; _i--) {
        _task = aiTaskList[_i];
        appendToActivityInventoryListView(_task);
    }
}
    
function appendToActivityInventoryListView(task) {
	console.log("appendToActivityInventoryListView: " + task);

    if (typeof(task) == "number") {
        var id = task;
        for (_i = todoTaskList.length; _i >= 0; _i--) {
            if (todoTaskList[_i].id == id) {
                task = todoTaskList[_i];
            }
        }
    }

    var _html = '';
    _html += '<tr id="task-' +task.id+ '">';
    _html += '<td>' +task.title+ '</td>';
    _html += '<td><span class="label ' +PRIORITY2STYLE[task.priority]+'">' +PRIORITY2TEXT[task.priority]+ '</span></td>';
    _html += '<td><a href="#" class="btn btn-danger" onclick="removeTaskFromActivityInventoryListView(' +task.id+ ');"><i class="icon-remove-sign icon-white"></i> Remove</a> <a class="btn btn-info" href="#" onclick="appendToTodoListView(' +task.id+ ')">Add TODO <i class="icon-chevron-right icon-white"></i></a></td>';
    _html += '</tr>';
    $('#aiList').prepend(_html);
}

function appendToActivityInventoryListView(task) {
	console.log("appendToActivityInventoryListView: " + task);

    var _html = '';
    _html += '<tr id="task-' +task.id+ '">';
    _html += '<td>' +task.title+ '</td>';
    _html += '<td><span class="label ' +PRIORITY2STYLE[task.priority]+'">' +PRIORITY2TEXT[task.priority]+ '</span></td>';
    _html += '<td><a href="#" class="btn btn-danger" onclick="removeTaskFromActivityInventoryListView(' +task.id+ ');"><i class="icon-remove-sign icon-white"></i> Remove</a> <a class="btn btn-info" href="#" onclick="appendToTodoListView(' +task.id+ ')">Add TODO <i class="icon-chevron-right icon-white"></i></a></td>';
    _html += '</tr>';
    $('#aiList').prepend(_html);
}

function removeTaskFromActivityInventoryListView(id) {
    console.log("removeTaskFromActivityInventoryListView");

    for (_i = aiTaskList.length-1; _i >= 0; _i--) {
        if (aiTaskList[_i].id == id) {
            aiTaskList.splice(_i, 1);
            $('#task-' + id).remove();
            break;
        }
    }
}

//
// Today's TODO List Operation
//
function initTodoListView() {
    console.log("initTodoListView");

/*
    for (_i = todoTaskList.length - 1; _i >= 0; _i--) {
        var _task = todoTaskList[_i];
        appendToTodoListView(_task.id);
    }
*//*
}
    
function appendToTodoListView(id) {
	console.log("appendToTodoListView: " + id);

    for (_i = aiTaskList.length-1; _i >= 0; _i--) {
        if (aiTaskList[_i].id == id) {
            var _task = aiTaskList[_i];
            
            todoTaskList[todoTaskList.length] = _task;

            removeTaskFromActivityInventoryListView(id);

            var _html = '';
            _html += '<tr id="task-' +_task.id+ '">';
            _html += '<td>';
            _html += '<i class="icon-chevron-right"></i> <span class="label ' +PRIORITY2STYLE[_task.priority]+ '">' +PRIORITY2STEXT[_task.priority]+ '</span> ';
            _html += '<span>' +_task.title+ '</span> ';
            _html += '<span class="pull-right">';
            _html += '<span class="label label-success" onclick="doTask(' +_task.id+ ');">DO IT!!!</span> ';
            _html += '<span class="label label-info" onclick="backToActivityInventoryListView(' +_task.id+ ');">BACK</span> ';
            _html += '<span class="label label-important" onclick="removeTaskFromTodoListView(' +_task.id+ ');">REMOVE</span>';
            _html += '</span>';
            _html += '</td>';
            _html += '</tr>';
            $('#todoList').prepend(_html);

            break;
        }
    }
}

function removeTaskFromTodoListView(id) {
    console.log("removeTaskFromTodoListView");

    for (_i = todoTaskList.length-1; _i >= 0; _i--) {
        if (todoTaskList[_i].id == id) {
            todoTaskList.splice(_i, 1);
            $('#task-' + id).remove();
            break;
        }
    }
}

function backToActivityInventoryListView(id) {
    console.log("backToActivityInventoryListView: " + id);

    for (_i = todoTaskList.length-1; _i >= 0; _i--) {
        if (todoTaskList[_i].id == id) {
            var _task = todoTaskList[_i];

            todoTaskList.splice(_i, 1);
            $('#task-' + id).remove();

            appendToActivityInventoryListView(_task);
            aiTaskList[aiTaskList.length] = _task;

            break;
        }
    }
}

function doTask(id) {
    console.log("doTask: " + id);

    for (_i = todoTaskList.length-1; _i >= 0; _i--) {
        if (todoTaskList[_i].id == id) {
            var _task = todoTaskList[_i];

            todoTaskList.splice(_i, 1);
            $('#task-' + id).remove();
            
            break;
        }
    }

    // Show task detials
    $('#taskTitle').text(_task.title);
    $('#taskDesc').text(_task.desc);

    last_task = _task;
}
*/
