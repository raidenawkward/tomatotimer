from django.shortcuts import render_to_response
from django.http import HttpResponse
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
def task_add(request):
    if request.method == 'POST':
        _task = Task(
                title = request.POST['title'],
                desc = request.POST['desc'],
                priority = request.POST['priority'],
                taskType = request.POST['taskType'],
        )
        _task.save();

    return HttpResponse(data);

def task_modify(request, task_id):
    pass

def task_delete(request, task_id):
    pass

def task_get(request, task_id):
    return HttpResponse(
        serializers.serialize(
            FORMAT['json'],
            Task.objects.filter(pk=task_id)),
    MIME['json'])

def task_get_all(request):
    return HttpResponse(
        serializers.serialize(
            FORMAT['json'],
            Task.objects.all()),
    MIME['json'])
