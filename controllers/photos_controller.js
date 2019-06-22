const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();
const multer = require('multer');

cloudinary.config({ 
	cloud_name: process.env.CLOUD_NAME, 
	api_key: process.env.API_KEY, 
	api_secret: process.env.API_SECRET
});

module.exports.wire = function (app) {
	const storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, 'uploads/')
		},
		filename: function(req, file, cb) {
			console.log(file)
			cb(null, file.originalname)
		}
	});

	const upload = multer({ storage : storage });

	app.post('/upload', upload.single('imagem'), function(req, res, next) {
		const path = req.file.path;
		const uniqueFilename = new Date().toISOString();

		cloudinary.uploader.upload(path, { public_id: `trilha/${uniqueFilename}`, tags: `trilhas` },
	      function(err, image) {
	        if (err) return res.send(err)
	        console.log('file uploaded to Cloudinary')

	        const fs = require('fs')
	        fs.unlinkSync(path)

	        const capa = {image: image.url};
	        
	        res.json(capa);
	      });
  	});
}
