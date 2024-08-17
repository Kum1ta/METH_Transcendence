from django.db import models

class TaMereLaPute(models.Model):
	id = models.AutoField(primary_key=True)
	test = models.CharField(max_length=200)
