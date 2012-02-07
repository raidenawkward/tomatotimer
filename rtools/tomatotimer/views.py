from django.shortcuts import render_to_response

# Create your views here.
def index(request):
    return render_to_response('tomatotimer/index.html')

def chrome_popup_tomato(request):
    return render_to_response('tomatotimer/chrome/popup-tomato.html')

def chrome_popup_break(request):
    return render_to_response('tomatotimer/chrome/popup-break.html')
