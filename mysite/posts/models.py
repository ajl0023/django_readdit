from typing import AbstractSet
from django.contrib.auth import get_user_model
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser, UserManager, AbstractBaseUser, BaseUserManager
from django.db.models.signals import pre_save
from django.dispatch.dispatcher import receiver


def assignId():
    id = uuid.uuid4()

    return id.hex


@receiver(pre_save)
def defineUid(**kwargs):
    
    if kwargs.get('sender') == Votes:
        instance = kwargs.get('instance')
        print(instance.commentid.id,4554545)
       
        if instance.uid is None or False or " ":

            if instance.commentid:

                instance.uid = instance.authorid.id + instance.commentid.id
            else:
                instance.uid = instance.authorid.id + instance.postid.id


class User(AbstractUser):

    id = models.CharField(primary_key=True, max_length=255, default=assignId)
    password = models.CharField(max_length=255, blank=True)
    username = models.CharField(blank=True, max_length=255, unique=True)
    # # Field name made lowercase.
    # createdat = models.CharField(
    #     db_column='createdAt', max_length=255, blank=True, null=True)

    class Meta:

        db_table = 'django_users'


class Comments(models.Model):
    author = models.ForeignKey(
        'User', models.DO_NOTHING, db_column='author', blank=True, null=True)
    # Field name made lowercase.
    createdat = models.CharField(
        db_column='createdAt', max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    id = models.CharField(primary_key=True, max_length=255, default=assignId)
    postid = models.ForeignKey(
        'Posts', models.DO_NOTHING, db_column='postid', blank=True, null=True, related_name='comments', )
    parentid = models.ForeignKey(
        'self', models.DO_NOTHING, db_column='parentid', blank=True, null=True)
    main_id = models.IntegerField()

    depth = models.IntegerField(blank=True, null=True)
    master_comment = models.ForeignKey(
        'self', models.DO_NOTHING, db_column='master_comment', blank=True, null=True, related_name='test')

    class Meta:
        managed = False
        db_table = 'comments'


class Posts(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    author = models.ForeignKey(
        'User', models.DO_NOTHING, db_column='author', blank=True, null=True, related_name="User")
    id = models.CharField(primary_key=True, max_length=36)

    createdat = models.CharField(
        db_column='createdAt', max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    main_id = models.IntegerField()

    hotscore = models.DecimalField(
        max_digits=20, decimal_places=8, blank=True, null=True)
    image = models.CharField(max_length=400, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'posts'


class Votes(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=assignId)
    authorid = models.ForeignKey(
        User, models.DO_NOTHING, db_column='authorid')
    score = models.IntegerField(blank=True, null=True)
    postid = models.ForeignKey(
        Posts, models.DO_NOTHING, db_column='postid', blank=True, null=True)
    commentid = models.ForeignKey(
        Comments, models.DO_NOTHING, db_column='commentid', blank=True, null=True)
    uid = models.CharField(unique=True, max_length=255,
                           blank=True, null=False)

    class Meta:
        managed = False
        db_table = 'votes'
