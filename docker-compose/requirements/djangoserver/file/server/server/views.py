from django.http import HttpResponse


def index(request):
    return HttpResponse("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA<br>ca marche enfin")
