from comments.forms import CommentForm
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import connection
from functools import update_wrapper
from django.db.models.expressions import Case, F, OuterRef, Subquery, Value, When, Window
from django.db.models.fields import CharField
from django.db.models.query_utils import Q
from django.http import response
from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.contrib.messages import get_messages
from .models import Posts, User, Votes, Comments
from django.contrib.staticfiles.finders import find
from django import template
from django.db.models import Sum
from django.db.models.functions import Coalesce, DenseRank
from django.views.generic import ListView
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie
import json
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.utils.encoding import smart_text
from django.contrib.auth.models import User
from django.db import IntegrityError
settings.DEBUG = True
register = template.Library()
uparrow = open(find('posts/up-arrow.svg')).read()
downarrow = open(find('posts/down-arrow.svg')).read()


@register.simple_tag
@ensure_csrf_cookie
def index(request):

    voteTotal = Votes.objects.filter(postid=OuterRef('pk')).values('score').annotate(voteTotal=Sum('score')).values(
        'voteTotal'
    )

    voteState = Votes.objects.filter(postid=OuterRef(
        'pk'), authorid=request.user.id).values('score')

    posts = Posts.objects.annotate(voteTotal=Coalesce(voteTotal, 0), voteState=Coalesce(
        voteState, 0), className=Case(When(voteState__gt=0, then=Value('vote-state-active')), default=Value("")))

    # print(posts[0].author)

    context = {
        'uparrow': uparrow,
        'posts': posts.all(),
        'downarrow': downarrow,
        'postsLoaded': True
    }

    return render(request, 'posts/index.html', context)


def fetchPosts(request):
    print(234234)
    voteTotal = Votes.objects.filter(postid=OuterRef('pk')).values('score').annotate(voteTotal=Sum('score')).values(
        'voteTotal'
    )

    voteState = Votes.objects.filter(postid=OuterRef(
        'pk'), authorid=request.user.id).values('score') if request.user.id else 0

    posts = Posts.objects.annotate(voteTotal=Coalesce(voteTotal, 0), voteState=Coalesce(
        voteState, 0), className=Case(When(voteState__gt=0, then=Value('vote-state-active')), default=Value("")))

    context = {
        'uparrow': uparrow,
        'posts': posts.all(),
        'downarrow': downarrow,
        'postsLoaded': True
    }

    return render(request, 'posts/postContainer.html', context)


def fetchPost(request, post_id):

    voteTotal = Votes.objects.filter(postid=OuterRef('pk')).values('score').annotate(voteTotal=Sum('score')).values(
        'voteTotal'
    )

    voteState = Votes.objects.filter(postid=OuterRef(
        'pk'), authorid=request.user.id).values('score') if request.user.id else 0

    post = Posts.objects.annotate(voteTotal=Coalesce(voteTotal, 0), voteState=Coalesce(
        voteState, 0), className=Case(When(voteState__gt=0, then=Value('vote-state-active')), default=Value(""))).get(id=post_id)

    comments = post.comments.annotate(bucket=Window(expression=DenseRank(),
                                                    order_by=F('depth').asc()), voteTotal=Coalesce(Votes.objects.filter(commentid=OuterRef('pk')).values('score').annotate(voteTotal=Sum('score')).values(
                                                        'voteTotal'
                                                    ), 0), voteState=Coalesce(Votes.objects.filter(commentid=OuterRef(
                                                        'pk'), authorid=request.user.id).values('score'), 0))

    print(uparrow)
    commentForm = CommentForm()
    print(commentForm)
    return render(request, 'posts/postModal.html', {
        "post": post,
        "comments": comments,
        "modal": True,
        'uparrow': uparrow,
        'form': commentForm,
        'downarrow': downarrow,
        'postsLoaded': False
    })


def post(request, post_id):
    voteTotal = Votes.objects.filter(postid=OuterRef('pk')).values('score').annotate(voteTotal=Sum('score')).values(
        'voteTotal'
    )

    voteState = Votes.objects.filter(postid=OuterRef(
        'pk'), authorid=request.user.id).values('score') if request.user.id else 0

    post = Posts.objects.annotate(voteTotal=Coalesce(voteTotal, 0), voteState=Coalesce(
        voteState, 0), className=Case(When(voteState__gt=0, then=Value('vote-state-active')), default=Value(""))).get(id=post_id)

    comments = post.comments.annotate(bucket=Window(expression=DenseRank(),
                                                    order_by=F('depth').asc()), voteTotal=Coalesce(Votes.objects.filter(commentid=OuterRef('pk')).values('score').annotate(voteTotal=Sum('score')).values(
                                                        'voteTotal'
                                                    ), 0), voteState=Coalesce(Votes.objects.filter(commentid=OuterRef(
                                                        'pk'), authorid=request.user.id).values('score'), 0))

    print(uparrow)
    commentForm = CommentForm()
    return render(request, 'posts/index.html', {
        "post": post,
        "comments": comments,
        "modal": True,
        'uparrow': uparrow,
        "form": commentForm,
        'downarrow': downarrow,
        'postsLoaded': False
    })


def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)


User = get_user_model()


def loginUser(request):
    storage = get_messages(request)
    print(storage)
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse('success')

    else:
        response = HttpResponse()
        response.status_code = 500
        return response('incorrect username or password')


def signup(request):

    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    print(username, password, 323)
    try:
        user = User.objects.create_user(username=username, password=password)
        return HttpResponse(user)
    except IntegrityError as e:

        err = {"message": e.args[1]}
        return JsonResponse(err)


def voteup(request):
    data = json.loads(request.body)
    voteType = data.get('type')
    model = Posts.objects.get(id=data.get(
        "postid")) if voteType == 'post' else Comments.objects.get(id=data.get("commentid"))
    user = request.user
    try:
        obj = Votes.objects.get(postid=model, authorid=user) if voteType == 'post' else Votes.objects.get(
            commentid=model, authorid=user)

        obj.score = Case(When(score=-1, then=Value(1)), When(score=1, then=Value(0)),
                         When(score=0, then=Value(1)), default=0)

        obj.save()
        obj.refresh_from_db()
        print(obj.score)
        voteTotal = Votes.objects.filter(postid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal') if voteType == 'post' else Votes.objects.filter(commentid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal')

        responseObj = {
            "voteTotal": voteTotal[0].get("voteTotal"),
            "voteState": obj.score
        }

        return JsonResponse(responseObj)
    except Votes.DoesNotExist:
        obj = Votes(postid=model, authorid=user,
                    score=1) if voteType == 'post' else Votes(commentid=model, authorid=user,
                                                              score=1)

        obj.save()
        voteTotal = Votes.objects.filter(postid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal') if voteType == 'post' else Votes.objects.filter(commentid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal')

        return JsonResponse({"voteState": 1, "voteTotal": voteTotal[0].get("voteTotal"), })


@csrf_exempt
def votedown(request):

    data = json.loads(request.body)
    voteType = data.get('type')
    model = Posts.objects.get(id=data.get(
        "postid")) if voteType == 'post' else Comments.objects.get(id=data.get("commentid"))
    user = User.objects.get(id=request.user.id)
    try:
        obj = Votes.objects.get(postid=model, authorid=user) if voteType == 'post' else Votes.objects.get(
            commentid=model, authorid=user)

        obj.score = Case(When(score=-1, then=Value(0)), When(score=1, then=Value(-1)),
                         When(score=0, then=Value(-1)), default=0)

        obj.save()
        obj.refresh_from_db()
        print(obj.score)
        voteTotal = Votes.objects.filter(postid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal') if voteType == 'post' else Votes.objects.filter(commentid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal')

        responseObj = {
            "voteTotal": voteTotal[0].get("voteTotal"),
            "voteState": obj.score
        }

        return JsonResponse(responseObj)
    except Votes.DoesNotExist:
        obj = Votes(postid=model, authorid=user,
                    score=-1) if voteType == 'post' else Votes(commentid=model, authorid=user,
                                                               score=-1)

        obj.save()
        voteTotal = Votes.objects.filter(postid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal') if voteType == 'post' else Votes.objects.filter(commentid=model).annotate(
            voteTotal=Sum('score')).values('voteTotal')

        return JsonResponse({"voteState": -1, "voteTotal": voteTotal[0].get("voteTotal"), })
