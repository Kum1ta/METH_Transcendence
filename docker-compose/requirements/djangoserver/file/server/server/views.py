from django.http import HttpResponse
from .models import TaMereLaPute

def index(request):
	try:
		a = TaMereLaPute.objects.get(id=1)
		return HttpResponse(a.test)
	except TaMereLaPute.DoesNotExist:
		return HttpResponse("does not exist")

def set(request):
	a = TaMereLaPute(test="coucou les musulmans moi je mange la glace")
	a.save()
	return HttpResponse("done")
	
