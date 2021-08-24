fetch('https://github.com/maximore32/SweetMimi')
  .then(response => response.json())
  .then(json => {
      // traemos los primeros 10 comentarios      
      for(i=0;i<=6;i++){
        document.getElementById('producto').render('home.html', 
         
        
        );
    }
  })