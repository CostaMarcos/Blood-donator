const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

// configuração pra usar arquivos estáticos css, js
server.use(express.static('public'))

//habilitar body
server.use(express.urlencoded({ extended:true }))

//Conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '000',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

// nunjucks template engine
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
});

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // botar dados no banco
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    db.query(query, [name, email, blood], function(err){
        if(err) return res.send("Erro no banco de dados")

        return res.redirect("/")
    })
    
})

server.listen(3000);