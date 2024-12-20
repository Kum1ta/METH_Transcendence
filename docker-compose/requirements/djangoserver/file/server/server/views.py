from django.http import HttpResponse, FileResponse
from django.shortcuts import render, redirect
from .models import User, MailVerify
from .data import UID42, SECRET42, SERVER_URL
import requests
import json
import os
from django.utils import timezone


def index(request):
	try:
		request.session.save()
	except Exception:
		request.session.flush()
		request.session.save()
	return render(request, "index.html", {})

def homePage(request):
	request.session.save()
	if(request.method != "POST"):
		return index(request)
	link42 = f"https://api.intra.42.fr/oauth/authorize?client_id={UID42}&redirect_uri={SERVER_URL}/login42&response_type=code&scope=public"
	return render(request, "homePage.html", {"link42" : link42})

def lobbyPage(request):
	request.session.save()
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "lobbyPage.html", {})

def multiLocalGamePage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "multiLocalGamePage.html", {})

def multiOnlineGamePage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "multiOnlineGamePage.html", {})

def waitingGamePage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "waitingGamePage.html", {})

def game(request):
	# return lobbyPage(request)
	return redirect('/lobby')

def wait_game(request):
	# return lobbyPage(request)
	return redirect('/lobby')

def profilPage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "profilPage.html", {})

def verify(request):
	req_token = request.GET.get('token', None)
	if(req_token == None):
		return(render(request, "invalidTokenPage.html", {}))
	user_code = MailVerify.objects.filter(token=req_token)
	if(not user_code.exists()):
		return(render(request, "invalidTokenPage.html", {}))
	user_code = user_code[0]
	if(user_code.uid.mail_verified):
		return(HttpResponse("your mail is already verified, you can now login"))
	user_code.uid.mail_verified = True
	user_code.uid.save()
	user_code.delete()
	return(render(request, "mailVerifiedPage.html", {}))

def login42(request):
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
		'redirect_uri': SERVER_URL+"/login42"
	}
	response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
	if (response.status_code != 200):
		return HttpResponse("couln't get authorization token, likely invalid code or secret expired")
	response = response.json()
	headers = {
		'Authorization': f'Bearer {response["access_token"]}',
	}
	response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
	if (response.status_code != 200):
		return HttpResponse("couln't get user info... what, why ? Probably rate limited, try at the next hour")
	response = response.json()
	id42 = response['id']
	login42 = response['login']
	db_user = User.objects.filter(id42=id42)
	if(not db_user.exists()):
		while(User.objects.filter(username=login42).exists()):
			login42 += "_"
		db_user = [User.objects.create(username=login42, id42=id42, last_login=timezone.now())]
		db_user[0].save()
	else:
		User.objects.filter(id=db_user[0].id).update(last_login=timezone.now())
	request.session["logged_in"] = True
	request.session["username"] = db_user[0].username
	request.session["id"] = int(db_user[0].id)
	request.session["pfp"] = db_user[0].pfp
	request.session["elo"] = int(db_user[0].elo)
	request.session.save()
	return redirect("/")

def logout(request):
	request.session.delete()
	return redirect("/") 

def handler404(request, exception):
	return(index(request))

def err404(request):
	return(render(request, "err404.html"))

def	getStorage(request, str):
	ret = None
	try:
		image_path = os.path.join('/var/www/djangoserver/storage/', str)
		ret = FileResponse(open(image_path, 'rb'), content_type='image/png')
	except Exception:
		ret = FileResponse("banner not found", status=404)
	return ret

def	settingsPage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "settingsPage.html", {})

def	tournamentPage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "tournamentPage.html", {})

def tournament(request):
	return redirect("/lobby")
