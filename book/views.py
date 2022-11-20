from django.shortcuts import render
from django.http import HttpResponse
import csv
import json
from .models import Author, Book, CSVFiles
from .forms import AuthorForm, BookForm
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView


def home(request):
    return render(request, 'book/index.html')

def author(request):
    authors = Author.objects.all()
    return render(request, 'book/author.html', {'authors': authors})


def book(request):
    authors = Author.objects.all()
    books = Book.objects.all()
    return render(request, 'book/book.html', {'authors': authors, 'books': books})


def convertBooksToCSV(request):
    return _convert2CSV(Book)


def convertAuthorsToCSV(request):
    return _convert2CSV(Author)


def downloadBooksCSV(request):
    _author_file = CSVFiles.objects.get_or_create(
            file='books.csv', model_name='Book')[0]
    return _downloadModelCSV(_author_file, 'books.csv')



def downloadAuthorsCSV(request):
    _author_file = CSVFiles.objects.get_or_create(
            file='authors.csv', model_name='Author')[0]
    return _downloadModelCSV(_author_file, 'authors.csv')

# helper functions

def _downloadModelCSV(file, prefered_file_name):
    try:
        with open(file.file.path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="text/csv")
            response['Content-Deposition'] = f'attachment; filename={prefered_file_name}'
        return response

    except:
        pass

def _write_csv(queryset, path):

    meta_options = queryset.model._meta

    try:

        with open(path, 'w') as file:
            # the csv writer
            writer = csv.writer(file)
            field_names = [
                field.name for field in meta_options.fields if field.name != 'id']
            # Write a first row with header information
            writer.writerow(field_names)
            # Write data rows
            for obj in queryset:
                writer.writerow([getattr(obj, field) for field in field_names])
        return True
    except:
        return False


def _convert2CSV(model):
    if model == Book:
        _file = CSVFiles.objects.get_or_create(
            file='books.csv', model_name='Book')
    else:
        _file = CSVFiles.objects.get_or_create(
            file='authors.csv', model_name='Author')

    written = _write_csv(model.objects.all(), _file[0].file.path)

    if written:
        return HttpResponse(json.dumps({'converted': True}),
                            content_type="application/json")
    else:
        return HttpResponse(json.dumps({'converted': False}),
                            content_type="application/json")


def create_book_from_csv(csv_file_path):
    with open(csv_file_path, 'r') as file:
        read = csv.reader(file)
        for i in read:
            print(i)

# create_book_from_csv('media/csv/Book.csv')
# _write_csv(Book.objects.all())
