from django.db import models

class User(models.Model):
	id = models.AutoField(primary_key=True)
	nickname = models.CharField(max_length=20)
	mail = models.EmailField()
	password = models.CharField(max_length=100)

class Message(models.Model):
	id = models.AutoField(primary_key=True)
	date = models.DateTimeField(auto_now_add=True)
	sender = models.ForeignKey("User",on_delete=models.SET_NULL, null=True, related_name="sender")
	to = models.ForeignKey("User", on_delete=models.CASCADE, related_name="to")

class Game(models.Model):
	id = models.AutoField(primary_key=True)
	player1 = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="p1")
	player2 = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="p2")
