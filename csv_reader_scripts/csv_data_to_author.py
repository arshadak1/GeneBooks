import requests
import csv
import os

endpoint = "http://localhost:8000/api/create/author/"

path = os.path.join(os.curdir, 'authors.csv')
with open(path, 'r') as file:
    reader = list(csv.reader(file))
    for row in range(1, len(reader)):
        # name,author,date_of_publishing,number_of_pages,average_critics_rating
        data = {}
        for idx, item in enumerate(reader[row]):
            print(idx, item)
            data[f'{reader[0][idx]}'] = item


        response = requests.post(endpoint, json=data)

# print(response.json())