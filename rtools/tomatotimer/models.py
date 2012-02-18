from django.db import models

# Create your models here.
class Task(models.Model):
    PRIORITY_CHOICES = (
        (u'ITP-CRITICAL',   u'ITP-CRITICAL'),
        (u'ITP-RUSH',       u'ITP-RUSH'),
        (u'ITP-NORMAL',     u'ITP-NORMAL'),
        (u'ITP-LOW',        u'ITP-LOW'),
    )
    TASK_TYPE_CHOICES = (
        ('TASK-TYPE-UNDEFINED', 'TASK-TYPE-UNDEFINED'),
        ('TASK-TYPE-AI',        'TASK-TYPE-AI'),
        ('TASK-TYPE-TODO',      'TASK-TYPE-TODO'),
    )

    title = models.CharField(max_length=32)
    desc =  models.CharField(max_length=128)
    priority =  models.CharField(max_length=16, choices=PRIORITY_CHOICES)
    taskType =  models.CharField(max_length=16, choices=TASK_TYPE_CHOICES)
