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

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

from .websocket import WebsocketHandler

django = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django,
	"websocket":SessionMiddlewareStack(URLRouter({path("ws",WebsocketHandler.as_asgi())}))
})
