from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

GENDER_CHOICES = [
    ("Male", "Male"),
    ("Female", "Female"),
    ("Others", "Others"),
]

MODEL_CHOICES = [
    ('Book', 'Book'),
    ('Author', 'Author')
]


class Author(models.Model):
    name = models.CharField(blank=False, null=False, max_length=50)
    age = models.PositiveSmallIntegerField(blank=False)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='Male')
    country = models.CharField(max_length=50, blank=True, null=True)


    def __str__(self):
        return self.name


    

class Book(models.Model):
    name = models.CharField(blank=False, null=False, max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    date_of_publishing = models.DateField()
    number_of_pages = models.PositiveIntegerField(blank=False, null=False)
    average_critics_rating = models.PositiveSmallIntegerField(validators=[
            MaxValueValidator(10),
            MinValueValidator(1)
        ], default=1)

    def __str__(self):
        return self.name

    @property
    def author_name(self):
        return self.author.name


class CSVFiles(models.Model):
    file = models.FileField()
    model_name = models.CharField(max_length=30, choices=MODEL_CHOICES, blank=False, null=False)

    def __str__(self):
        return self.model_name