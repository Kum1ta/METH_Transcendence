from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import User, MailVerify
from .data import UID42, SECRET42, SERVER_URL
import requests
import json
import os


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

def waitingGamePage(request):
	if(request.method != "POST"):
		return index(request)
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return render(request, "waitingGamePage.html", {})

def game(request):
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return redirect("/lobby")

def wait_game(request):
	if(not request.session.get("logged_in", False)):
		return(HttpResponse("you are not logged in",status=403))
	return redirect("/lobby")

def verify(request):
	req_token = request.GET.get('token', None)
	if(req_token == None):
		return(HttpResponse("token param missing"))
	user_code = MailVerify.objects.filter(token=req_token)
	if(not user_code.exists()):
		return(HttpResponse("token not found (PS : il faudrais peut-être faire une page avec un petit peu css pour ça mais moi ça me va là) ( PSS: il faudrait peut-être faire une page aussi pour quand il manque le parametre token, flemme de mettre ce message dans sa réponse c'est genre 3 lignes au dessus, c'est trop loin) (PSSS: peut-être une page d'erreur générique qu'on peut remplir avec des variables pour les messages d'erreur"))
	user_code = user_code[0]
	if(user_code.uid.mail_verified):
		return(HttpResponse("your mail is already verified, you can now login (PS: voir erreur token not found)"))
	user_code.uid.mail_verified = True
	user_code.uid.save()
	user_code.delete()
	return(HttpResponse("your mail has been verified ! (et pourquoi pas une page pour dire que l'email a été verifié, sinon je peut juste redirect vers la page principale)"))

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
	print("\033[31m",data)
	response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
	if (response.status_code != 200):
		print(response.json())
		return HttpResponse("couln't get authorization token, likely invalid code")
	response = response.json()
	headers = {
		'Authorization': f'Bearer {response["access_token"]}',
	}
	response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
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

def handler404(request, exception):
	return(index(request));

def err404(request):
	return(render(request, "err404.html"))
