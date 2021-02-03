//Team 8

//Libraries
var express = require('express');
var path = require('path');
var fs = require('fs');
const { json } = require('express');
var app = express(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));


//DB creation
// var obj = {
//   table: []
// };
//obj.table.push({username: ".", password:"."});
//var data = JSON.stringify(obj);
//fs.writeFileSync('users.json', data);

//Global Variables
var sess;

var books = [{
  "key": "flies",
  "Fullname": "Lord of the Flies"
},
{
  "key": "grapes",
  "Fullname": "The Grapes of Wrath"
},
{
  "key": "mockingbird",
  "Fullname": "To Kill A Mockingbird"
},
{
  "key": "dune",
  "Fullname": "Dune"
},
{
  "key": "leaves",
  "Fullname": "Leaves of Grass"
},
{
  "key": "sun",
  "Fullname": "The Sun and Her Flowers"
}];

var flag = 0;

//Login
app.get('/', function(req,res){
  sess = req.session;
  sess.username = "";
  res.render( 'login' ,{Error: " "});

});

app.post('/',function(req,res){
  var x = req.body.username;
  var y = req.body.password;
  sess = req.session;
  sess.username = req.body.username;
  
  if (checkDB(x,y)){
    res.redirect('/home');
    res.end('done');
  }
  else{
    sess.username="";
    res.render( 'login' ,{Error: "Username or Password don't match our records!"})
  };
})


//GET home
app.get('/home', function(req,res){
  sess = req.session;
  if(sess.username) {
    nm = sess.username.charAt(0).toUpperCase() + sess.username.slice(1)
    res.render('home',{N: nm});
}
else {

  res.write('<h1 style="   margin: 40; ">Please login First.</h1>');
  res.end('<a style="    margin: 50; " href='+'/'+'> Login </a>');
}
 
}); 

//REGISTRATION
app.get('/registration', function(req,res){
  res.render( 'registration' ,{Error: " "});
});

app.post('/registration',function(req,res){
  var x = req.body.username;
  var y = req.body.password;

  if(x.indexOf(' ') >= 0){
    res.render( 'registration' ,{Error: "Please enter a valid username"})
    console.log("Contains spaces");
} else 
  if (!checkUsername(x)){
    
    reg(x,y);
    res.redirect('/');
  }
  else {
    res.render( 'registration' ,{Error: "This Username is already taken!"})
  }
});


//GET

app.get('/novel', function(req,res){
  sess = req.session;
  console.log(sess.username);
  if(sess.username) {
    res.render('novel')

}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.get('/poetry', function(req,res){
  sess = req.session;
  if(sess.username) {
    
  res.render('poetry')
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.get('/fiction', function(req,res){
  sess = req.session;
  if(sess.username) {
    
  res.render('fiction')
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.get('/sun', function(req,res){
  
  sess = req.session;
  if(sess.username) {
    
  res.render('sun', {Error: " "})
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}

});


app.get('/dune', function(req,res){
  sess = req.session;
  if(sess.username) {
    
  res.render('dune', {Error: " "})
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});


app.get('/grapes', function(req,res){
  sess = req.session;
  if(sess.username) {
    
  res.render('grapes', {Error: " "})
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.get('/flies', function(req,res){
  sess = req.session;
  if(sess.username) {
    
    res.render('flies', {Error: " "});
  
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.get('/leaves', function(req,res){
  sess = req.session;
  if(sess.username) {
    
  res.render('leaves' , {Error: " "})
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.get('/mockingbird', function(req,res){
  sess = req.session;
  if(sess.username) {
    
  res.render('mockingbird', {Error: " "})
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

//POST
app.post('/dune', function(req,res){
  sess = req.session;
  addtoreadlist('dune','Dune',sess.username);

  if (flag == 1 ){
    res.render('dune', {Error: "Already in your want-to-read list"})
  }
  else {
    res.render('dune', {Error: "Added to your want-to-read list!"})
  }
  
});
app.post('/flies', function(req,res){
  sess = req.session;

  addtoreadlist('flies', 'Lord of the Flies',sess.username);

  if (flag == 1 ){
    res.render('flies', {Error: "Already in your want-to-read list"})
  }
  else {
    res.render('flies',  {Error: "Added to your want-to-read list!"})
  }
});

app.post('/grapes', function(req,res){
  sess = req.session;

  addtoreadlist('grapes','The Grapes of Wrath', sess.username);

  if (flag == 1 ){
    res.render('grapes', {Error: "Already in your want-to-read list"})
  }
  else {
    res.render('grapes', {Error: "Added to your want-to-read list!"})
  }

});

app.post('/leaves', function(req,res){
  sess = req.session;

  addtoreadlist('leaves', 'Leaves of Grass',sess.username);
  
  if (flag == 1 ){
    res.render('leaves', {Error: "Already in your want-to-read list"})
  }
  else {
    res.render('leaves', {Error: "Added to your want-to-read list!"})
  }

});
app.post('/mockingbird', function(req,res){
  sess = req.session;

  addtoreadlist('mockingbird', 'To Kill A Mockingbird',sess.username);

  if (flag == 1 ){
    res.render('mockingbird', {Error: "Already in your want-to-read list"})
  }
  else {
    res.render('mockingbird', {Error: "Added to your want-to-read list!"})
  }

});
app.post('/sun', function(req,res){
  sess = req.session;


  addtoreadlist('sun', 'The Sun and Her Flowers',sess.username);

  if (flag == 1 ){
    res.render('sun', {Error: "Already in your want-to-read list"})
  }
  else {
    res.render('sun', {Error: "Added to your want-to-read list!"})
  }
});

//READ LIST
app.get('/readlist', function(req,res){
  
  var data = fs.readFileSync('./users.json');
  obj = JSON.parse(data);
  length = obj.table.length;
  var i;
  sess = req.session;
  if(sess.username){
  for (i=0; i<length; i++){    
    if (obj.table[i].username == sess.username){
     list = obj.table[i].readlist;
  
      if (!(list.length == 0)){
        res.render('readlist',{books: list, Empty: "" });}
      else {
      res.render('readlist',{books: list, Empty: "Your Want-To-Read List Is Empty "});}
    }
 }
}
else {
  res.write('<h1>Please login first.</h1>');
  res.end('<a href='+'/'+'>login</a>');
}
});

app.post('/readlist', function(req,res){
  res.render('readlist')
});

//SEARCH
app.post('/search', function(req,res){
  var word = req.body.Search;
  var results = [];

  for (var i = 0; i<books.length;i++){
    if (books[i].Fullname.toLowerCase().includes(word.toLowerCase())){
      results.push(books[i]);
    }
  }
  if (!(results.length == 0)){
    res.render('searchresults',{Results: results, Error: "" });
  }
  else {
  
    res.render('searchresults',{Results: results,Error: "Book not Found"});}

});



//HELPER FUNCTIONS

function reg(x,y){ //Adds new entry to usersDB
  var data = fs.readFileSync('./users.json');
  obj = JSON.parse(data); //now it's a JSON object
  obj.table.push({ username: x.toLowerCase(), password: y, readlist: []}); //add some data
  j = JSON.stringify(obj,null,2); //convert it back to json
  fs.writeFileSync('./users.json', j ); // write it back 
  console.log(x + " registered successfully!");
}

function checkDB(x,y){ //Checks if username and password already exist in DB
  var data = fs.readFileSync('./users.json');
  obj = JSON.parse(data);
  length = obj.table.length;
  var i;
  for (i=0; i<length; i++){    
    if (obj.table[i].username == x.toLowerCase() && obj.table[i].password == y){
      return true;
    }
  }
  return false ;
}

function checkUsername(x){ //Checks if username already exists in DB
  var data = fs.readFileSync('./users.json');
  obj = JSON.parse(data);
  length = obj.table.length;
  var i;
  for (i=0; i<length; i++){    
    if (obj.table[i].username == x.toLowerCase()){
      return true;
    }
  }
  return false ;
}
function addtoreadlist(book,fullname,loggedin){ //adds to readlist of a certain Loggedin User
  flag = 0;
  var data = fs.readFileSync('./users.json');
  obj = JSON.parse(data);
  length = obj.table.length;
  var i;

  for (i=0; i<length; i++){  
    if (obj.table[i].username == loggedin.toLowerCase()){
      
      for (var j = 0; j<obj.table[i].readlist.length; j++){
        if (obj.table[i].readlist[j].key == book) flag = 1;
        
      }
        if (flag == 0){
        obj.table[i].readlist.push({key: book ,Fullname: fullname });
        j = JSON.stringify(obj,null,2); //convert it back to json
        fs.writeFileSync('./users.json', j ); 
    }
    else { break;}
  }
  }
}



if(process.env.PORT){

  app.listen(process.env.PORT,function(){console.log('Server started')});

} else {

  app.listen(3000,function(){console.log('Server started on port 3000')});  
}
