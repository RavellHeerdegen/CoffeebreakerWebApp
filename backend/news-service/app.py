from flask import Flask
from flask import request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

apiKey='apiKey=531ea725d3444e1985741fc034c72b5f'
url = ('https://newsapi.org/v2/everything?')

#build the url string to call external news service
def buildurl():

#check if 'tags' is defined else create default 'tags'array
    tags = []
    try:
      for x in request.json:
        tags.append(x['name'])
    except TypeError:
      tags = ['cat']
      print(request.json)

#check if there are tags
    tagslength = len(tags)

    if tagslength > 0:
        urlparameter = 'q=' + ' OR '.join(tags) + ''
    #default
    else:
        urlparameter = 'q=cat'
#limit the amount of data objects to five and append the api key to the url string
    urlparameter += '&pageSize=5'
    urlparameter += '&'+apiKey
    return urlparameter

#main route for receiving news data
@app.route('/v1/news', methods=['GET', 'POST'])
def news():
    getnewsurl = url + buildurl()
    print(getnewsurl)

    response = requests.get(getnewsurl)
    return response.json()

if __name__ == '__main__':
    app.run(port=4206)





