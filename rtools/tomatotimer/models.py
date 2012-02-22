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
        (u'TASK-TYPE-UNDEFINED', u'TASK-TYPE-UNDEFINED'),
        (u'TASK-TYPE-AI',        u'TASK-TYPE-AI'),
        (u'TASK-TYPE-TODO',      u'TASK-TYPE-TODO'),
    )

    title = models.CharField(max_length=32)
    desc =  models.CharField(max_length=128)
    priority =  models.CharField(max_length=32, choices=PRIORITY_CHOICES)
    taskType =  models.CharField(max_length=32, choices=TASK_TYPE_CHOICES)

    def __unicode__(self):
        return self.title

    def save(self, *args, **kwargs):
        super(Task, self).save(*args, **kwargs)
        # return saved task
        return self

    def delete(self, *args, **kwargs):
        super(Task, self).delete(*args, **kwargs)
        # return saved task
        return self
