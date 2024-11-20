from django.db import models

class User(models.Model):
	id = models.AutoField(primary_key=True)
	username = models.CharField(max_length=20, unique=True)
	mail = models.EmailField(unique=True, null=True, blank=True)
	password = models.CharField(max_length=100, null=True, blank=True)
	id42 = models.DecimalField(max_digits=15, decimal_places=0, null=True, unique=True)
	pfp = models.CharField(max_length=1024, default="/static/img/default_pfp.jpg")
	banner = models.CharField(max_length=1024, default="/static/img/default_banner.jpg")
	mail_verified = models.BooleanField(default=False)
	github_link = models.CharField(max_length=1024, null=True, blank=True, default=None)
	discord_username = models.CharField(max_length=1024, null=True, blank=True, default=None)
	last_login = models.DateTimeField()
	elo = models.DecimalField(max_digits=15, decimal_places=0, default=150)

class Message(models.Model):
	id = models.AutoField(primary_key=True)
	date = models.DateTimeField(auto_now_add=True)
	sender = models.ForeignKey("User",on_delete=models.SET_NULL, null=True, related_name="sender")
	to = models.ForeignKey("User", on_delete=models.CASCADE, related_name="to")
	read = models.BooleanField(default=False)
	content = models.TextField() 

class GameResults(models.Model):
	id = models.AutoField(primary_key=True)
	end_date = models.DateTimeField(auto_now_add=True)
	player1 = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="p1")
	player2 = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="p2")
	p1Score = models.DecimalField(max_digits=3, decimal_places=0)
	p2Score = models.DecimalField(max_digits=3, decimal_places=0)
	winner = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, related_name="winner")
	forfeit = models.BooleanField(default=False)

class MailVerify(models.Model):
	token = models.CharField(primary_key=True, max_length=200, unique=True)
	uid = models.ForeignKey("User", on_delete=models.CASCADE, null=False)
