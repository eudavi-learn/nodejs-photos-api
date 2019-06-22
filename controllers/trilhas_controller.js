const dotenv = require('dotenv').config();
const monk = require('monk');

const db = monk(process.env.MONGO_URL);

const trilhas = db.get('trilhas');
const request = require('request');

var capasController = require('./photos_controller');

/*
	Método auxiliar no qual verifica se uma trilha é válida.

	Parâmetros: trilha:json
*/

function trilhaValida(trilha) {
	return trilha.titulo != "" && trilha.nome_filme != "" && trilha.imagem != "";
}

function index(req,res) {
	res.json({
		trilhas: 'Obtem todas as Trilhas: GET /trilhas',
		trilha_by_id: 'Obtem trilha por id: GET /trilha/:id',
		criar_trilha: 'Cria uma trilha: POST /trilhas',
		deletar_trilha: 'Deleta uma trilha por id: DELETE /trilha/:id',
		atualizar_trilha: 'Atualiza uma trilha por id: PUT /trilha/:id',
		upload_imagem: 'Path de upload de imagem auxiliar: POST /upload (Precisa de uma foto), retorna a url da imagem no cloudinary',
		attributes: 'id:integer, titulo:string, nome_filme:string, imagem:string, genero:string, trilha:string, created:date'
	});
}

/*
	Método GET

	Busca todas as trilhas criadas.
*/

function all_trilhas(req,res) {
	trilhas.find().then(trilhas => res.json(trilhas));
}

/*
	Método GET

	Busca uma trilha.

	Parâmetro: id_param:int
*/

function show_trilha(req,res) {
	id_param = parseInt(req.params.id);

	trilhas.findOne({id: id_param}, function(err, result) {
		if (err) {}
			if (result) {
				res.status(200);
				res.json(result);
			} else {
				res.status(404);
				res.json({mensagem: "Trilha não encontrada com esse id."});
			}
	});
}

/*
	Método POST

	Cria uma trilha.

	Parâmetros: id:integer, titulo:string, nome_filme:string, imagem:string, 
	genero:string, trilha:string, created:date
*/

function create_trilha(req,res) {
	if(trilhaValida(req.body)) {
		var trilha = {
			id: parseInt(req.body.id),
			imagem: req.body.imagem.toString(),
			titulo: req.body.titulo.toString(),
			nome_filme: req.body.nome_filme.toString(),
			genero: req.body.genero.toString(),
			trilha: req.body.trilha.toString(),
			created: new Date()
		}

		trilhas.insert(trilha).then(createdTrilha => {
			res.json(createdTrilha);
		});
	} else {
		res.status(422);
		res.json({
			message: "Hey !! Titulo, nome do filme e imagem não podem ser vazios !!"
		});
	}
}

/*
	Método PUT

	Atualiza uma Trilha.

	Parâmetros: id:integer, titulo:string, nome_filme:string, imagem:string, 
	genero:string, trilha:string, created:date
*/

function update_trilha(req,res) {
	id_param = parseInt(req.params.id);
	if(trilhaValida(req.body)) {
		const trilha = {
			id: parseInt(req.body.id),
			titulo: req.body.titulo.toString(),
			nome_filme: req.body.nome_filme.toString(),
			genero: req.body.genero.toString(),
			trilha: req.body.trilha.toString(),
			created: new Date()
		}

		trilhas.update({id: id_param}, trilha, function(err, result) {
			if (err) {console.log(err);}
			if (result) {
				res.status(201);
				res.json({mensagem: "Trilha atualizada com sucesso."});	
			}
		});
	} else {
		res.status(422);
		res.json({
			message: "Hey !! Titulo, nome do filme e imagem não podem ser vazios !!"
		});
	}
}

/*
	Método DELETE

	Deleta uma trilha.
	
	Parâmetro: id:integer
*/

function remove_trilha(req,res) {
	id_param = parseInt(req.params.id);

	trilhas.remove({id: id_param}, function(err, result) {
		if (err) {cosole.log(err);}
		if (result) {
			res.status(200);
			res.json({mensagem: "Trilha deletada com sucesso."});	
		} else {
			res.status(404);
			res.json({mensagem: "Trilha não encontrada com esse id."});	
		}
	});
}

module.exports.wire = function(app) {
	app.get('/', index);
	app.get('/trilhas', all_trilhas);
	app.get('/trilha/:id', show_trilha);
	app.put('/trilha/:id', update_trilha);
	app.post('/trilhas', create_trilha);
	app.delete('/trilha/:id', remove_trilha);
}
