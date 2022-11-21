
<h1 align="center">
  <br>
  <a href="https://projectsarshad.pythonanywhere.com/"><img src="https://user-images.githubusercontent.com/75536974/203064989-8ad6a0e3-4ec5-449c-b549-2ed29f5a3b15.png" alt="COL" width="100"></a>
  <br>
  GeneBooks
  <br>
</h1>

<h4 align="center">A website to find all your favourite books and authors.</h4>

<br>
<p align="center">
  <a href="#usage">Usage</a> •
  <a href="#dependencies">Dependencies</a> •
  <a href="#apis">APIs</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>
<br>
<img width="1459" alt="Screenshot 2022-11-21 at 6 49 38 PM" src="https://user-images.githubusercontent.com/75536974/203065484-2767258f-2d4d-4e53-9c90-db02ab60edb7.png">



# Usage

* Clone this repository:

```bash
# Clone this repository
$ git clone https://github.com/arshadak1/GeneBooks.git

# Go into the repository
$ cd GeneBooks
```
* Create a virtual environment and activate it:
```
$ python -m venv <venv-name>
$ source <venv-name>/bin/activate
```
* Install all the dependencies:

```
$ pip install -r requirements.txt
```
* Start the server:
```bash
$ python manage.py runserevr
```
And navigate to `http://127.0.0.1:8000/`.

# Dependencies

This software uses the following open source packages and frameworks:
```
asgiref==3.5.2
certifi==2022.9.24
charset-normalizer==2.1.1
Django==4.1.3
django-cors-headers==3.13.0
djangorestframework==3.14.0
idna==3.4
pytz==2022.6
requests==2.28.1
sqlparse==0.4.3
urllib3==1.26.12
```

# APIs

* Get all the authors data from `http://127.0.0.1:8000/api/authors`.
* Get all the books data from `http://127.0.0.1:8000/api/books`.
* Get all the books of a specific author data from `http://127.0.0.1:8000/api/author-books` which takes `author-name` as a parameter.
* Get all books with a certain rating or more from `http://127.0.0.1:8000/api/books-with-rating` which takes `average_critics_rating` as a parameter.

## Related

[GeneBooks](https://projectsarshad.pythonanywhere.com/) - Web version of GeneBooks.


# License

MIT

---

> [arshadak.herokuapp.com](https://www.arshadak.herokuapp.com) &nbsp;&middot;&nbsp;
> GitHub [@arshadak1](https://github.com/arshadak1) &nbsp;&middot;&nbsp;
> Instagram [@ars_had_ak](https://instagram.com/ars_had_ak)
