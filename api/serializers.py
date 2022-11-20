from book.models import Book, Author
from rest_framework import serializers


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['name', 'age', 'gender', 'country']


class BookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['name', 'author_name', 'date_of_publishing', 'number_of_pages', 'average_critics_rating']


class BookCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['name', 'author', 'date_of_publishing', 'number_of_pages', 'average_critics_rating']