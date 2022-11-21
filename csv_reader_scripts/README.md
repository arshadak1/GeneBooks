# Scripts that let you create datas for your local branch database

These scripts will read data from a csv file and stores in Author, Book databases in your local branch.

## Description

Instead of adding single datas to the database, you can run these scripts and populate the database with ease.

## Getting Started

### Dependencies

* To run the script you should have `requests` installed. To install execute the following command,
```
pip install requests
```


### Executing program

* First clone the main repo `$ git clone https://github.com/arshadak1/GeneBooks.git`
* Then enter into the project folder `cd GeneBooks`
* Next install all dependencies rquired for the project by executing the following commands
```
pip install -r requirements.txt
```
* Start your local server by executing `python manage.py runserver`
* Then cd into `csv_reader_scripts`
* Next execute this command
```
python main.py
```
* It asks you for some info like host, port number, which data you want to add(Book or Author) and path to the csv file.
* And that's it.

