from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status
from book.models import Book, Author
from .serializers import AuthorSerializer, BookCreateSerializer, BookListSerializer, AuthorBooksSerializer
import json
from datetime import datetime
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

YEAR = datetime.now().year
# Create your views here.


# class CSRFExemptSessionAuthentication(SessionAuthentication):

#     def enforce_csrf(self, request):
#         return  # To not perform the csrf check previously happening


class AuthorListAPIView(generics.ListAPIView):
    
    serializer_class = AuthorSerializer

    def get_queryset(self):

        queryset = Author.objects.all()
        params = (self.request.query_params.get('params'))
        if params:
            params = json.loads(params)
            author = params.get('author')
            max_age = params.get('max_age')
            min_age = params.get('min_age')
            gender = params.get('gender')

            if author is not None and author != '':
                queryset = queryset.filter(name__icontains=author)

            if max_age is not None and max_age != '':
                queryset = queryset.filter(age__lte=int(max_age))

            if min_age is not None and min_age != '':
                queryset = queryset.filter(age__gte=int(min_age))

            # gender filtering
            if gender.get('male') and gender.get('female') and gender.get('others'):
                pass

            elif gender.get('male') and gender.get('female'):
                queryset = queryset.exclude(gender__iexact="Others")

            elif gender.get('female') and gender.get('others'):
                queryset = queryset.exclude(gender__iexact="Male")

            elif gender.get('others') and gender.get('male'):
                queryset = queryset.exclude(gender__iexact="Female")

            elif gender.get('male'):
                queryset = queryset.filter(gender__iexact="Male")

            elif gender.get('female'):
                queryset = queryset.filter(gender__iexact="Female")

            elif gender.get('others'):
                queryset = queryset.filter(gender__iexact="Others")

        return queryset


class AuthorCreateAPIView(generics.CreateAPIView):
    serializer_class = AuthorSerializer
    # authentication_classes = (CSRFExemptSessionAuthentication, BasicAuthentication)


class BookListAPIView(generics.ListAPIView):

    serializer_class = BookListSerializer

    def _valid_year(self, year):
        try:
            year = int(year)
            if year < 1000 or year > YEAR + 10:
                return False
            return True
        except:
            return False

    def _valid_page(self, page):
        try:
            page = int(page)
            if page <= 0:
                return False
            return True
        except:
            return False

    def _valid_rating(self, rating):
        try:
            rating = int(rating)
            if not (0 <= rating <= 10):
                return False
            return True
        except:
            return False

    def get_queryset(self):

        queryset = Book.objects.all()
        params = (self.request.query_params.get('params'))
        print(params)
        if params:
            """

            """
            params = json.loads(params)
            book_name = params.get('book_name')
            from_year = params.get('from_year')
            upto_year = params.get('upto_year')
            min_page = params.get('min_page')
            max_page = params.get('max_page')
            rating = params.get('rating')

            if book_name is not None and book_name != '':
                queryset = queryset.filter(name__icontains=book_name)

            if from_year is not None and from_year != '' and self._valid_year(from_year):
                queryset = queryset.filter(
                    date_of_publishing__year__gte=int(from_year))

            if upto_year is not None and upto_year != '' and self._valid_year(upto_year):
                queryset = queryset.filter(
                    date_of_publishing__year__lte=int(upto_year))

            if min_page is not None and min_page != '' and self._valid_page(min_page):
                queryset = queryset.filter(number_of_pages__gte=int(min_page))

            if max_page is not None and max_page != '' and self._valid_page(max_page):
                queryset = queryset.filter(number_of_pages__lte=int(max_page))

            if rating is not None and rating != '' and self._valid_rating(rating):
                queryset = queryset.filter(
                    average_critics_rating__gte=int(rating))

        return queryset


class BookCreateAPIView(generics.CreateAPIView):
    serializer_class = BookCreateSerializer


    def create(self, request, *args, **kwargs):
        if not request.data.get('author').isnumeric():
            try:
                request.data['author'] = Author.objects.get(name=request.data.get('author')).id
            except:
                pass
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AuthorBooksListAPIView(generics.ListAPIView):
    serializer_class = AuthorBooksSerializer

    def get_queryset(self):

        author = (self.request.query_params.get('author-name'))
        if author:
            author_data = Author.objects.filter(name__iexact=author)
            print(author, author_data)
            if author_data:
                books = Book.objects.filter(author=author_data[0].id)
                return books

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if not response.data:
            response.data = [{'response': "Author doesn't exists!"}]
        return response


class RatingBooksListAPIView(generics.ListAPIView):
    serializer_class = AuthorBooksSerializer

    def _valid_rating(self, rating):
        try:
            rating = int(rating)
            print(rating)
            if not (0 <= rating <= 10):
                print('hell')
                return False
            return True
        except:
            return False

    def get_queryset(self):

        rating = (self.request.query_params.get('average_critics_rating'))
        print(self._valid_rating(rating))
        if self._valid_rating(rating):

            queryset = Book.objects.filter(
                average_critics_rating__gte=int(rating))

            return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        if not response.data:
            response.data = [{'response': "No books found!"}]
        return response
