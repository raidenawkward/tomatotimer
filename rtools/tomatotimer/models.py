from django.db import models

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=32)
    desc =  models.CharField(max_length=128)
    priority =  models.CharField(max_length=16)
    taskType =  models.CharField(max_length=16)
