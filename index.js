/*globals require, console, process */

var express = require('express');
var bodyParser = require('body-parser');

// instantiate express
const app = express();


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;


// get an instance of the express Router
var router = express.Router();

var astronauti = [];

var nextAID = 1;

function creaAstronauta(name, last, space, id) {
    return {
        firstName: name,
        lastName: last,
        isInSpace: space,
        id: id
    }
}


// test route to make sure everything is working
router.get('/', function(req, res) {
    //res.json({ message: 'welcome to our api!' });

    var risposta = {
        mess: "Ciao"
    }

    res.json(risposta);

});


router.route('/astronaut')
    .get(
        function(req, res) {
            console.log("GET ALL");
            res.json(astronauti);
        })
    .post(
        function(req, res) {
            console.log("POST " + nextAID)
            var ident = nextAID;
            
            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var isInSpace = req.body.isInSpace;

            console.log(firstName);
            console.log(lastName);
            console.log(isInSpace);


            if (firstName && lastName && isInSpace) {
                nextAID++;
                astronauti.push(creaAstronauta(firstName, lastName, isInSpace, ident));
                res.json({
                    successo: "Astronauta creato correttamente. Annota il tuo id per successive modifiche.",
                    ID: ident
                })
            } else {
                res.json({
                    errore: "Astronauta non inserito."
                })
            }



        })

// middleware route to support CORS and preflighted requests
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /api
app.use('/api/v1', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);