from django import forms

from django.forms import ModelForm

from .models import Author, Book

class AuthorForm(ModelForm):
    class Meta:
        model = Author
        fields = ['name', 'age', 'gender', 'country']


class BookForm(ModelForm):
    class Meta:
        model = Book
        fields = ['name', 'author', 'date_of_publishing', 'number_of_pages', 'average_critics_rating']
