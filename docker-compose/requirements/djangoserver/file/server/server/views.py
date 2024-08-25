from django.http import HttpResponse
from django.shortcuts import render
from .models import User 

def index(request):
	request.session.save()
	return render(request, "index.html", {})

def homePage(request):
	request.session.save()
	return render(request, "homePage.html", {})

def lobbyPage(request):
	request.session.save()
	return render(request, "lobbyPage.html", {})