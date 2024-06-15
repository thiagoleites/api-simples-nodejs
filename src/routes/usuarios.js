import  express  from 'express';
import { insertUsuario, listUsuario, deleteUsuario } from '../controllers/usuariosController.js';


const router = express.Router();


router.post('/', insertUsuario);

router.get('/', listUsuario);

router.delete('/:id', deleteUsuario);


export default router;