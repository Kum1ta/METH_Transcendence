from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import User 
import requests
import json
import os

UID42 = None
SECRET42 = None
with open("/var/www/djangoserver/42_credentials", 'r') as f:
	creds = f.read().split(':')
	UID42=creds[0]
	SECRET42=creds[1]
TOKENURL = 'https://api.intra.42.fr/oauth/token'
INFOURL = 'https://api.intra.42.fr/v2/me'
REDIRECT = 'https://localhost:8000/login42'

def index(request):
	try:
		request.session.save()
	except Exception:
		request.session.flush()
		request.session.save()
	return render(request, "index.html", {})

def homePage(request):
	request.session.save()
	return render(request, "homePage.html", {})

def lobbyPage(request):
	request.session.save()
	return render(request, "lobbyPage.html", {})

def login42(request):
	#url = https://api.intra.42.fr/oauth/authorize?client_id=<CLIENT_ID>&redirect_uri=https://localhost:8000/login42&response_type=code&scope=public'
	if(request.session.get("logged_in", False)):
		return HttpResponse("you're already logged in")
	code = request.GET.get('code', None)
	if(code == None):
		return(HttpResponse("code param not found"))

	data = {
		'grant_type': 'authorization_code',
		'client_id': UID42,
		'client_secret': SECRET42,
		'code': code,
		'redirect_uri': REDIRECT
	}
	print("\033[31m",data)
	response = requests.post(TOKENURL, data=data)
	if (response.status_code != 200):
		print(response.json())
		return HttpResponse("couln't get authorization token, likely invalid code")
	response = response.json()
	headers = {
		'Authorization': f'Bearer {response["access_token"]}',
	}
	response = requests.get(INFOURL, headers=headers)
	if (response.status_code != 200):
		return HttpResponse("couln't get user info... what, why ?")
	response = response.json()
	id42 = response['id']
	login42 = response['login']
	db_user = User.objects.filter(id42=id42)
	if(not db_user.exists()):
		while(User.objects.filter(username=login42).exists()):
			login42 += "_"
		db_user = [User.objects.create(username=login42, id42=id42)]
		db_user[0].save()
	request.session["logged_in"] = True
	request.session["username"] = db_user[0].username
	request.session["id"] = db_user[0].id
	return redirect("/")

def logout(request):
	request.session.delete()
	return redirect("/") 
