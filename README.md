# Learning Expressjs
> Express is a javascript framework for building server-side apps

## Installation
**Install expressjs**
`npm install express`

**Install nodemon**
`npm install --save-dev nodemon`

## Basic setup
```js
//import express library
const express = require('express');
//setup server
const app = express();

//make server listen on port 3000 for requests
app.listen(3000);
```

## Creating Routes
Routes are how you handle what happens when user tries to connect to the server using any of the http methods
```js
//this format applies to the other http methods like post, put, delete. First a route, and then a callback to handle stuff
app.get('/', (req, res, next) => {
    res.send('hi');
})
//req is used to access the request sent 
//res is used to issue back response to the client. You have to give a response back
//next is a function we can call. But most times we don't care about that when creating routes like this
```
Some useful methods of `res` include 
```js
res.send(); //sends anything you type in to client. can be text or html code to render to user
res.json({name: "vict", age: 3}); //sends json data back to client. Pass in a javascript object. USEFUL FOR BUILDING AN API
res.sendStatus(500); //sends back status code of 500 back to client
res.status(500).json({message: "contact site admin"}); //set status code and send back json data
res.download('./somebook.txt'); // send back data for client to download, specifying the path to the resource. USEFUL FOR DOWNLOADING 
res.render('index'); //used to render a page. USEFUL FOR SENDING SERVER RENDERED PAGES FOR DYNAMIC WEBSITE
```

## Specifying a view render engine
A Render Engine allows you to use js code directly in your HTML page and have them rendered before being passed to the client. Just like when you use php tags to write php code in HTML file.
A popular render engine is  `ejs`
- ### Install
`npm install ejs`   
- ### Specify render engine in the server code
```js
const app = express();
app.set('view engine', 'ejs');
```
- ### Change HTML files to .ejs file extension
- ### install ejs language support vscode extension
- ### Restart server
> Dynamic webpages (i.e those webpages that will contain javascript code that is rendered by ejs) will be in the  `views` folder as convention

## Using ejs in a .ejs file
```js
<%# This is some ejs comment %>
<%= "use the = to print something"%>
 <% let condition  = true; if (condition) { %>
     <div>making if statement with ejs</div>
 <% } %>
```

## Passing value to ejs file from code
```js
res.render('index', {name: 'victor' ,  career: 'computer programmer'});
// pass in a object that contains everything you want to use in the ejs view file
```
In the .ejs file, use `locals` binding to access everything in that object
```ejs
<%= locals.name %>  
```
You can access `names` without using `locals` but it's best to use `locals` to prevent error message saying that a variable is undefined


## Using Router class to group routes
Routes should live in a `routes` folder. A Router is like a express App instance and has all the http methods. The major difference is that you can have multiple Routers each handling a separate aspect of the website and all these Routers can be implemented separately but used within the main server file

### Creating a Router
In routes/user.js
```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    res.send('List of  all Users');
});

router.get('/new', (req, res) =>  {
    res.send('Fill out form to register as user')
})

module.exports = router;
```

### Using the router from the server.js file
This specifies that the `userRouter` routes start with `/user` so it is used to handle endpoints that start with `/user` like  `/users/new`, etc.
```js
const userRouter = require('./routes/user');
app.use('/user', userRouter); 
```

## Setting up dynamic parameters in urls
**Note: Static routes should be declared above dynamic routes so that they are appropriately used.
**
```js
app.get('/user/:id', (req, res) => {
    res.send(req.params.id);
});
```
`:id` is a placeholder for anything that follows that matching route, allowing this route we setup to handle requests like `/user/2`, `/user/8` but it also makes this route handle endpoints like `/user/new`. Hence, routes static routes like `/user/new` should be placed above dynamic onces 

`req.params.id` is used to access that dynamic data passed in at the url. `id` just matches `:id` 

## Chaining routes for the same endpoint
Reduce this: 
```js
router.get('/:id', (req, res) => {

})

router.post('/:id', (req, res) => {
    
})

router.delete('/:id', (req, res) => {
    
})
```

To this:
```js
router
.route('/:id')
.get((req, res) => {

})
.post((req, res) => {

})
.delete((req, res) =>  {

})
```

## Middlewares
> A middle ware is a piece of code (e.g a function ) that runs between when the server gets a http request and when it responds to that request

### Using a built-in middleware 
The `param` middle ware runs before any route that has a parameter of `id`. It can be used to retrieve a user object using the `id` passed and make that accessible before the response method handles the request

```js
//setting up dummy data
const users = [
        {name: 'victor'},
        {name: 'michael'},
        {name: 'anna'}
    ]

app.get('/:id/posts', (req, res) => {
    res.send(`Retrieving Posts by  ${req.user}`);
});

app.param('id', (req, res, next) => {
    //setting up a custom property
    req.user = users[id];
    next(); //moves to the next middle ware or the response method like app.get
});
```

### Creating custom middleware
```js
function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}
```
#### Using the middleware 
##### Let all routes in the js file use it
```js
app.use(logger); //declared at the top before defining routes
```
##### Let one route use it
```js
app.get('/', logger, anothermiddleware, (req, res) => {

})
```

### serving static files 
> Static files are just files that their content doesn't ever change. eg. a static html file, etc.

```js
app.use(express.static('public')); //serves all the files found in the 'public' folder
```
We can then access the files by using an <a></a> tag somewhere in a webpage or sth else

### Accessing form data

```html
<!-- Sample form -->
<form method="post">
    <input type="text" name="firstName" placeholder="Enter your name" value="<% locals.name %>">
    <button type="submit">Add user</button>
</form>
```

```js
app.use(express.urlencoded( { extended: true } ));

app.get('/', (req, res) => {
    console.log(req.body.firstName);
    res.redirect('/users'); //redirect to another url
})
```

### Accessing query parameters from url
e.g `/user?id=3&age=49`
```js
router.get('/user', (req, res) => {
    console.log(req.query.id);
    console.log(req.query.age);
    res.redirect('/');
})
```


## Connecting to a MySQL database
### install the package
`npm install --save-dev mysql`

### import the package
```js
const mysqlCon = require('mysql');
```

### create connection using the `createConnection()` method
```js
const connection = mysqlCon.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '13l1n2',
        database: 'notetakingapp'
    }
);
```

### Connect to database to make a query
```js
connection.connect();
```

### make a query
```js
connection.query("SELECT * FROM books", (error, result) => {
    console.log(result)
})
```

### end connection to database
```js
connection.end();
```
