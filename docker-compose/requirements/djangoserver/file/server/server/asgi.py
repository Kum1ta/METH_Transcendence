"""
ASGI config for server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from django.core.asgi import get_asgi_application
from channels.sessions import SessionMiddlewareStack 
from django.utils import timezone
from datetime import timedelta
from django.db import transaction
import threading
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

from .websocket import WebsocketHandler


def deleteLoop():
	while(True):
		from .models import User
		time.sleep(60 * 60)
		limit = timezone.now() - timedelta(days=2 * 365)
		with transaction.atomic():
			User.objects.using('second').filter(last_login__lt=limit).delete()

threading.Thread(target=deleteLoop, daemon=True).start()

django = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django,
	"websocket":SessionMiddlewareStack(URLRouter({path("ws",WebsocketHandler.as_asgi())}))
})
