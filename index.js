var express = require('express');
const nunjucks = require('nunjucks');
var bodyParser = require('body-parser')
var	app = express();
app.use(express.static('public'));
const port = process.env.PORT || 8080;

const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use("/public/img", express.static('img'));

var fs = require('fs');
const dir = __dirname +'/public/img/'; //en lugar de user sería el nombre de usuario si estuviera logueado

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.SONIURL|| "mongodb+srv://maximusbrain:defensa143@cluster0.6di0t.mongodb.net/testsoni?retryWrites=true&w=majority";

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

//----------------------------------Secret-Login-------------------------------------------------------------------------------------//

session = require('express-session');
app.use(session({
    secret: 'string-supersecreto320',
    name: 'sessionId',
    proxy: true,
    resave: true,
    saveUninitialized: true ,
    cookie: { maxAge:  60 * 60 * 1000 }  
}));

var auth = function(req, res, next) {
    if (req.session.login)
      return next();
    else
      return res.render("noacces.html");
  };

  //Index para el login
app.get("/admin", (req, res) => {
    res.render("index2.html");
});

// Login endpoint
app.all('/login', function (req, res) {
    if (!req.body.user || !req.body.pass) {
      res.render('noacces.html');    
    } else {
  
      MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
          const dbo = db.db("testsoni");  
          dbo.collection("login").findOne({$and:[{"user":req.body.user},{"pass":req.body.pass}]},function(err, data) {             
              //console.log(data); 
              if(data){
                  req.session.login = true;  
                  req.session.nombre = data.user;               
                  res.render("bienlogeado.html");  
              }
              else{
                res.render('noacces.html');
              } 
            })
          });
        }
      });

      // Logout endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("Sesión cerrada!");
  });
   
  // Get content endpoint
  app.get('/content', auth, function (req, res) {    
      res.render('formudulces.html');        
  });

  app.get('/categorias', auth, function (req, res) {    
    res.render('agregarcategoria.html');     
});
    
  
  // Recibimos la información del formulario de alta de platos e insertamos en la base de datos
  app.post('/altadulce', (req, res)=>{
      MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
      const dbo = db.db("testsoni")
      // key de la base datos : req.body.name_campo_formulario
      dbo.collection("dulce").insertOne(
          {   
              id:parseInt(req.body.id),
              Nombre: req.body.nombre,            
              Descripción:req.body.descripcion,
              Precio: req.body.precio,
              Categoria:req.body.categoria,
              Imagen:req.files.foto.name
  
              
          },
          function (err, res) {
              if (err) {
              db.close();
              return console.log(err);
              }
              db.close()
          })
          if (!req.files)
          return res.status(400).send('No files were uploaded.');
       
        
        let foto = req.files.foto;
        console.log(foto)
       
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        //foto.mv(__dirname + '/img/'+ req.files.foto.name, function(err) {
        foto.mv(__dirname + '/public/img/'+ req.files.foto.name.jpg, function(err) {
          if (err)
            return res.status(500).send(err); 
            res.send('<p>Agregado exitosamente</p><p><a href="/content">Agregar Dulce</a></p><p><a href="/logout">Cerrar Sesión</a></p>'+ req.files.foto.name);
        });
          
      })
  })

  // Recibimos la información del formulario de alta de categorias e insertamos en la base de datos
app.post('/altacategoria', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
  const dbo = db.db("testsoni")
  // key de la base datos : req.body.name_campo_formulario
  dbo.collection("categorias").insertOne(
      {   
          categoria : req.body.categoria,
          id: req.body.id
      },
      function (err, res) {
          if (err) {
          db.close();
          return console.log(err);
          }
          db.close()
      })
      res.send('<p>Categoria agregada exitosamente</p><p><a href="/categorias">Agregas otra categoria</a></p><p><a href="/content">Agregar Dulce</a></p><p><a href="/logout">Cerrar Sesión</a></p>')
  })
})

app.listen(port);