from django.urls import path, include
from .views import home, author, book, convertBooksToCSV, convertAuthorsToCSV, downloadAuthorsCSV, downloadBooksCSV

urlpatterns = [
    path('', home, name="home"),
    path('authors', author, name='authors-home'),
    path('books', book, name='books-home'),
    path('books-csv/', convertBooksToCSV, name='books-csv'),
    path('authors-csv/', convertAuthorsToCSV, name='authors-csv'),
    path('books-csv-download', downloadBooksCSV, name='books-csv-download'),
    path('authors-csv-download', downloadAuthorsCSV, name='authors-csv-download'),

]   
