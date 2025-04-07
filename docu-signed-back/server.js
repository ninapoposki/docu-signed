const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
//na Heroku npr kad se uradi deploy aplikacije-automatski se postavi PORT
//lokalno moze 5000
const db=require('./db');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Docu Signed back is working');
});

//pokrece server
app.listen(PORT, () => {
    console.log(`Port for server: http://localhost:${PORT}`);
});

//ispise trenutno vreme ako baza radi
app.get('/test-db',async(req,res)=>{
    try{
        const result=await db.query('SELECT NOW()');
        res.json(result.rows[0]);
    }catch(error){
        console.error('Database connection error:',error);
        res.status(500).send('DB connection failed');
    }
});

