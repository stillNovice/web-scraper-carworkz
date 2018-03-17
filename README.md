# WEB SCRAPER: CARWORKZ
This is just an assignment.

# Installation
### Windows
```sh
$ git clone https://github.com/stillNovice/web-scraper-carworkz.git
$ cd web-scraper-carworkz
$ npm install
$ cd config/config.js and enter the mongo db url and database name in respective fields.
$ npm start


```

### Linux
```sh
$ git clone https://github.com/stillNovice/oh-my-logs-2.git
$ cd oh-my-logs-2
$ npm install
$ sudo npm install -g babel-cli
$ cd config/config.js and enter the mongo db url and database name in respective fields.
$ node app.js

```

# Usage
1. Open Chrome
2. Go to localhost:3000
3. Wait till you see the message that says scraping is done
4. After that you can now search using search API's
5. Format of search url is given below:
6. localhost:3000?name={name of the garage}&&ratings={user rating given to the garage (1 star to 5 stars)}&&location={the place the garage is located in}
6. The 'name' and 'location' parameters are searched with operator 'contains'
7. The 'ratings' is searched with operator 'greater than or equals'