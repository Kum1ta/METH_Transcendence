from django.db import models

class User(models.Model):
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=20, unique=True)
	mail = models.EmailField(unique=True)
	password = models.CharField(max_length=100)
	id42 = models.DecimalField(max_digits=15, decimal_places=0, default=0)

class Message(models.Model):
	id = models.AutoField(primary_key=True)
	date = models.DateTimeField(auto_now_add=True)
	sender = models.ForeignKey("User",on_delete=models.SET_NULL, null=True, related_name="sender")
	to = models.ForeignKey("User", on_delete=models.CASCADE, related_name="to")

class Game(models.Model):
	id = models.AutoField(primary_key=True)
	player1 = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="p1")
	player2 = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="p2")
