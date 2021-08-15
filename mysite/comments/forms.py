from django.forms import widgets
from posts.models import Comments
from django import forms
from django.forms.models import ModelForm


class CommentForm(ModelForm):
    # content = forms.CharField(label="",
    #                           max_length=100, widget=forms.Textarea(attrs={'class': 'new-comment'}))
    # postid = forms.CharField(widget=forms.HiddenInput())
    class Meta:
        model = Comments

        fields = ['content', 'postid']
        widgets = {
            'postid': widgets.HiddenInput(),
            'content': widgets.Textarea(attrs={'v-model': "text"})
        }
        labels = {
            'content': "",
        }
