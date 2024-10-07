"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
	path("",views.index, name='index'),
	path("homePage",views.homePage, name='homePage'),
	path("lobbyPage", views.lobbyPage, name='lobbyPage'),
	path("multiLocalGamePage", views.multiLocalGamePage, name='multiLocalGamePage'),
	path("multiOnlineGamePage", views.multiOnlineGamePage, name='multiOnlineGamePage'),
	path("waitingGamePage", views.waitingGamePage, name='waitingGamePage'),
	path("profilPage", views.profilPage, name='profilPage'),
	# path("game", views.game, name='game'),
	path("wait_game", views.game, name='wait_game'),
	#path("tournament", views.tournament, name='tournament'),
    path("login42", views.login42, name='login42'),
    path("logout", views.logout, name='logout'),
	path("verify", views.verify, name='verify'),
	path("404", views.err404, name='err404'),
	path("pfp/<str>", views.pfp, name='pfp'),
	path("banner/<str>", views.banner, name='banner'),
	path("settingsPage", views.settingsPage, name='settingsPage'),
	path("tournamentPage", views.tournamentPage, name='tournamentPage'),
]

handler404 = "server.views.handler404"
