from django.urls import path, include
from .views import AuthorCreateAPIView, AuthorListAPIView, BookCreateAPIView, BookListAPIView
urlpatterns = [
    path('create/author/', AuthorCreateAPIView.as_view(),name='author-create'),
    path('create/book/', BookCreateAPIView.as_view(),name='book-create'),
    path('authors/', AuthorListAPIView.as_view(),name='authors'),
    path('books/', BookListAPIView.as_view(),name='books'),

]   
