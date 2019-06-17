const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

var trilhasController = require('./controllers/trilhas_controller');
var uploadController = require('./controllers/photos_controller');

/*
	Server Listener
*/

var server = app.listen(process.env.PORT || 5000, () => {
	console.log('Listening on port %d', server.address().port);
});

trilhasController.wire(app);
uploadController.wire(app);