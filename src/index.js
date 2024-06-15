const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs');


const app = express();

const port = 3333;

const dirPath = path.resolve(__dirname, 'db');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const dbPath = path.join(dirPath, 'database.sqlite');
const db = new sqlite3.Database(dbPath);


db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS usuarios ( id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT null, email TEXT NOT NULL)');
});

// Funcao para validacao de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

app.use(express.json());

// Rota para inserir usuários
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: "Os campos são obrigatórios" });
    }

    if(!isValidEmail(email)) {
        return res.status(400).json({ message: "O email não é válido!" })
    }

    const query = "INSERT INTO usuarios (nome, email) VALUES (?, ?)";

    db.run(query, [nome, email], function(err) {
        if (err) {
            console.error('Erro ao inserir usuarios', err);
            return res.status(500).json({ message: "Erro ao inserir usuario"});
        }
        res.status(201).json({ id: this.lastID, nome, email });
    });
})

// Rota para obter ususarios.
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar usuarios', err);
            return res.status(500).json({ message: "Erro ao buscar usuarios" });
        }

        return res.status(200).json(rows);
    })
})

// Rota para deletar usuário
app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "O ID fornecido não é válido!" });
    }

    const query = "DELETE FROM usuarios WHERE id = ?";

    db.run(query, [id], function(err) {
        if (err){
            console.error('Erro ao deletar usuarios', err);
            return res.status(500).json({ message: "Erro ao deletar usuário"});
        }

        if(this.changes === 0) {
            return res.status(404).json({ mesage: "Usuário não encontrado" })
        }

        res.status(200).json({ message: "Usuario deletado com sucesso"})
    })
})

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})
