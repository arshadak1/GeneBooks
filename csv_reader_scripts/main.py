import requests
import csv
import os

def uploadCSV(endpoint, data, csv_path):
    if DATA == '1':
        endpoint += 'book/'
    elif DATA == '2':
        endpoint += 'author/'
    else:
        return ('Select correct data choice!!')
        
    response = None
    try:
        with open(csv_path, 'r') as file:
            reader = list(csv.reader(file))
            for row in range(1, len(reader)):

                data = {}
                for idx, item in enumerate(reader[row]):
                    data[f'{reader[0][idx]}'] = item

                try:
                    response = requests.post(endpoint, json=data)
                except:
                    return 'Something went wrong!!'
        
        return f'{response.status_code} Success!'
    except Exception as e:
        return e
        

if __name__ == '__main__':
    IP_ADDRESS = input("Enter your domain(leave blank for '127.0.0.1'): ").strip() or '127.0.0.1'
    PORT = (input("Please enter your port number(leave blank for '8000'): ")) or '8000'
    DATA = input("""Select the data you want to process(enter the choice number): 
    1. Book
    2. Author: \n""").strip()
    CSV_PATH = input("Specify your csv file path: ") or None
    endpoint = f'http://{IP_ADDRESS}:{PORT}/api/create/'
    
    response = uploadCSV(endpoint, DATA, CSV_PATH)
    print(response)

