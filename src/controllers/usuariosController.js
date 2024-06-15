import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { isValidEmail } from '../functions/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);


export function insertUsuario(req, res) {
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
}

export function listUsuario(req, res) {
    const query = 'SELECT * FROM usuarios';

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar usuarios', err);
            return res.status(500).json({ message: "Erro ao buscar usuarios" });
        }

        return res.status(200).json(rows);
    })
}

export function deleteUsuario(req, res) {
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
}