var express = require('express');
const nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
var	app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'xxxx';

app.get('/', (req, res)=>{	  
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {    
  const dbo = db.db("testsoni");  
  dbo.collection("dulce").find().toArray(function(err, dulces) {	      
      res.render('home.html',{data:dulces});
	}); 
});	
});


app.listen(8080);