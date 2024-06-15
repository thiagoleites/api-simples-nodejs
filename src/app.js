import  express  from 'express';
import  { dirname } from 'path';
import  bodyParser  from 'body-parser';
import  usuariosRouter  from './routes/usuarios.js';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = 3333;

app.use(bodyParser.json());

app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
    console.log('Servidor rodando na porta ${port}');
});