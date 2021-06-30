var express = require('express');
const nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
var	app = express();
app.use(express.static('public'));
const port = process.env.PORT || 8080;

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.SONIURL ||"mongodb+srv://maximusbrain:defensa143@cluster0.6di0t.mongodb.net/testsoni?retryWrites=true&w=majority";

app.get('/', (req, res)=>{	  
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
  const dbo = db.db("testsoni"); 
  const data = [];   
  // Consultamos los platos
  dbo.collection("dulce").find().toArray()
  .then((dataplatos) => { 
// en data[0] quedan los platos
    data.push(dataplatos)
  }) 
  .then(() => {
  //Consultamos en la base las categorías
    dbo.collection("categorias").find().toArray()
    .then((datacategorias) => { 
// en data[1] quedan los categorias
      data.push(datacategorias)      
      res.render('home.html',{data:data});      
    }) 
  })
});
});


// Ruta individual del plato
app.get('/plato/:id', (req, res)=>{	  
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
  const dbo = db.db("testsoni"); 
  // Obtenemos la id de la URL y la convertimos a entero
  var id = parseInt(req.params.id);     
  // Buscamos en la base con un findeOne el plato
  dbo.collection("dulce").findOne({"id":id},function(err, data) {   	
    if (data){     
          res.status(200).render('producto.html',{id:data.id,plato:data.Nombre,img:data.Imagen,descripcion:data.Descripción,categoria:data.Categoria,precio:data.Precio}
          );	
      }else{
          res.status(404).send(`<p>ERROR</p>`)

      }    		
    });
});	
});

app.get('/categoria/:cat', (req, res)=>{	  
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
      const dbo = db.db("testsoni");         
      // Buscamos en platos y filtramos por su categoría para mostrarlos
      dbo.collection("dulce").find({"Categoria":req.params.cat}).toArray()
          .then((data) => {      
          res.render('categoria.html',{data:data,categoria:req.params.cat});
          }) 
      })
      });


app.listen(port);