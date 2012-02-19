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
    pass

def task_modify(request):
    pass

def task_delete(request):
    pass

def task_get(request):
    pass

def task_get_all(request):
    data = serializers.serialize(FORMAT['json'], Task.objects.all())
    return HttpResponse(data, MIME['json'])
