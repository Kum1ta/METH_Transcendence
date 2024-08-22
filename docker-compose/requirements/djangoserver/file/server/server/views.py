from django.http import HttpResponse
from .models import User 

def index(request):
	if(request.session.get("visited", False)):
		print("already visited")
	request.session["visited"] = True

	return HttpResponse("AAAAAAAAAAAAAAAAAAAAAAA")
