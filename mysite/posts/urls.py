from django.contrib import admin
from django.urls import path, include
from . import views
urlpatterns = [
    path('', views.index, name='index'),
    path('<post_id>/', views.post, name='detail'),
    path('get/posts/<post_id>', views.fetchPost, name='fetch'),
    path('get/posts', views.fetchPosts, name='fetch'),
    path('voteup', views.voteup),

    path('votedown', views.votedown)

]
