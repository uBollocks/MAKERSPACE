import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import eventRoutes from './routes/events.js';
import { create } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import fortune from './lib/fortune.js';
import fortune from "./lib/fortune.cjs";

// variables to create directory object
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
// set up handlebars view engine
const handlebars = create({ defaultLayout:'main' });


// Middleware; Set up public scripts and images to serve to clients in public
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/events', eventRoutes);
app.get('/', function(req, res) {
    res.render('home');  
});
app.get('/calendar', function(req, res) { 
    res.render('about', { fortune: fortune.getFortune() } );
});

app.get('/about', function(req, res) { 
    res.render('about', { fortune: fortune.getFortune() } );
});

// Check Request Headers (User's metadata)
app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

// Check Response Headers (Server's metadata)

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


const CONNECTION_URL = 'mongodb://localhost/subscribers';

const PORT = process.env.PORT || 27017;
 
mongoose.connect(CONNECTION_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => 
        console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));