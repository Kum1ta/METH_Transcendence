from django.http import HttpResponse
from django.shortcuts import render
from .models import User 

def index(request):
	return render(request, "index.html", {})

def homePage(request):
	return render(request, "homePage.html", {})
