import  express  from 'express';
import  { dirname } from 'path';
import  bodyParser  from 'body-parser';
import  usuariosRouter  from './routes/usuarios.js';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Bem vindo a API com Nodejs');
})

app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
    console.log('Servidor rodando na porta ${port}');
});