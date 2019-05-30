const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({ 
	cloud_name: 'hasashisama', 
	api_key: '677715892525891', 
	api_secret: 'y-GvcNlFAanyi6IyYCHl9asNPNA'
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

		cloudinary.uploader.upload(path, { public_id: `trilha/${uniqueFilename}`, tags: `trilhas` }, // directory and tags are optional
	      function(err, image) {
	        if (err) return res.send(err)
	        console.log('file uploaded to Cloudinary')
	        // remove file from server
	        const fs = require('fs')
	        fs.unlinkSync(path)

	        const capa = {image: image.url};
	        
	        res.json(capa);
	      });
  	});
}