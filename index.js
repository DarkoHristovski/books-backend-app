const express = require('express');
const app = express();
require('dotenv/config');
//const cors = require('cors');
const PORT = process.env.PORT || 8000;
const {Pool} = require('pg');

const pool = new Pool({connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING})
app.use(express.json());
//app.use(cors());

app.get('/api/countries',(req,res)=>{
    res.send('Books Section')
})




app.get('/api/books',(req,res)=>{
    pool
    .query('SELECT * FROM books')
    .then(data=>{
        res.json(data.rows)
    })
    .catch(e=>res.status(500).json({message:e.message}))
})

app.get('/api/books/:id',(req,res)=>{
    const {id} = req.params;
    pool
    .query('SELECT * FROM books WHERE id=$1', [id])
    .then(data=>{
        if(data.rowCount===0){
            res.status(404).json({message:`Book with ${id} id not found!`})
        }else{
            res.json(data.rows[0])
        }
    })
    .catch(e=> res.status(500).json({message:e.message}))
})

app.post('/api/books',(req,res)=>{
    const {title,author,year}= req.body;
    pool
    .query('INSERT INTO books (title,author,year) VALUES ($1,$2,$3) RETURNING *;', [title,author,year])
    .then(data=>{
        res.json(data.rows[0])
    })
    .catch(e=>res.status(500).json({message:e.message}))
})

app.put('/api/books/:id', (req,res)=>{
    const {id} = req.params;
    const{title,
        author,
        year,}= req.body;
    pool
    .query('UPDATE books SET title=$1, author=$2, year=$3  WHERE id = $4 RETURNING*;',[
        title,
        author,
        year,
        id])
    .then(data=>{
        res.json(data.rows[0])
    })
    .catch(e=>res.status(500).json({message:e.message}))
})

app.delete('/api/books/:id',(req,res)=>{
    const {id}= req.params;
    pool
    .query('DELETE FROM books WHERE id = $1 RETURNING *',[id])
    .then(data=>{
        res.json(data.rows[0])
    })
    .catch(e=>res.status(500).json({message:e.message}))
})




app.listen(PORT, ()=>{
    console.log(`Server is starting at Port ${PORT}`)
})