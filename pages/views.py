from django.shortcuts import render

def home(request):
    return render(request, "/Users/connorwatson/custom_chrome_extensions/startpage/skynet/pages/newtab.html",{})
