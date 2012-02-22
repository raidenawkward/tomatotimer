from django.shortcuts import render_to_response
from django.core import serializers
from tomatotimer.models import Task

# Create your views here.

# Uitls
FORMAT = {
        'xml':    'xml',
        'json':   'json',
};

MIME = {
        'xml':    'application/xml',
        'json':   'application/javascript',
};
# Show main page.
def index(request):
    return render_to_response('tomatotimer/index.html')

# Task or Break finished popup window.
def chrome_popup_tomato(request):
    return render_to_response('tomatotimer/chrome/popup-tomato.html')

def chrome_popup_break(request):
    return render_to_response('tomatotimer/chrome/popup-break.html')

# Task Operation
def task_create(request):
    _task = Task(
            title = request.GET['title'],
            desc = request.GET['desc'],
            priority = request.GET['priority'],
            taskType = request.GET['taskType'],
    )

    return render_to_response('tomatotimer/json.html', {
        'data': _task.save()},
        mimetype=MIME['json'])

def task_update(request, task_id):
    _task = Task(
            title = request.GET['title'],
            desc = request.GET['desc'],
            priority = request.GET['priority'],
            taskType = request.GET['taskType'],
    )
    _task.id = task_id

    return render_to_response('tomatotimer/json.html', {
        'data': _task.save()},
        mimetype=MIME['json'])

def task_delete(request, task_id):
    _task = Task()
    _task.id = task_id

    return render_to_response('tomatotimer/json.html', {
        'data': _task.delete()},
        mimetype=MIME['json'])

def task_read(request, task_id):
    return render_to_response('tomatotimer/json.html', {
        'data': serializers.serialize(
            FORMAT['json'],
            Task.objects.filter(pk=task_id))},
        mimetype=MIME['json'])

def task_read_all(request):
    return render_to_response('tomatotimer/json.html', {
        'data': serializers.serialize(
            FORMAT['json'],
            Task.objects.all())},
        mimetype=MIME['json'])
