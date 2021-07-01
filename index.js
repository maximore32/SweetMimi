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
const MONGO_URL = process.env.SONIURL;

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
  const data = [];
  // Obtenemos la id de la URL y la convertimos a entero
  var id = parseInt(req.params.id);
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
          }) 
        })
     .then(()=>{
         // Buscamos en la base con un findeOne el plato
  dbo.collection("dulce").findOne({"id":id},function(err, dati) {   	
    if (dati){     
          res.status(200).render('producto.html',{data:data,id:dati.id,plato:dati.Nombre,img:dati.Imagen,descripcion:dati.Descripción,categoria:dati.Categoria,precio:dati.Precio}
          );	
      }else{
          res.status(404).send(`<p>ERROR</p>`)

      }    		
    });
     })
});	
});

app.get('/categoria/:cat', (req, res)=>{	  
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
      const dbo = db.db("testsoni");
      const data = [];  
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
          }) 
        })
    .then(()=>{
      // Buscamos en platos y filtramos por su categoría para mostrarlos
    dbo.collection("dulce").find({"Categoria":req.params.cat}).toArray()
    .then((dato) => {      
    res.render('categoria.html',{data:data,dato:dato,categoria:req.params.cat});
    
    })
    })
  })
  
});


app.listen(port);