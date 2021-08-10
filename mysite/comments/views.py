import json
from posts.models import Votes

from django.http.response import HttpResponse
from comments.forms import CommentForm
from django.shortcuts import render


def newComment(request):

    form = CommentForm(request.POST)
    print(form.is_valid())
    if form.is_valid():
        form.save(commit=False)
        form.user = request.user
        comment = form.save()
        print(comment.id, '34234234234')
        comment.voteState = 1
        comment.voteTotal = 1
        vote = Votes(authorid=request.user, commentid=comment, score=1)
        vote.save()
        return render(request, 'posts/postModal.html', {
            "comment": comment
        })

        # return HttpResponseRedirect('/thanks/')
    else:
        return
        # form = NameForm()
    # return render(request, 'name.html', {'form': form})
