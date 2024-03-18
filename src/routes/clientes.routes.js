import { Router } from "express";
import pool from './../database/databse.js';

const router = Router();

router.get('/add', (req, res) => {
    res.render('clientes/add');
});

router.post('/add', async(req, res) => {
    try {
        const {nomcli, apecli, nrodnicli, telcli} = req.body;
        const newCliente = {
            nomcli, apecli, nrodnicli, telcli
        }
        await pool.query('INSERT INTO cliente SET ?', [newCliente]);
        res.redirect('/list');
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/list', async(req, res) => {
    try{
        const [result] = await pool.query('SELECT * FROM cliente');
        res.render('clientes/list', {clientes: result});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/edit/:idcli', async(req, res) => {
    try {
        const { idcli } = req.params;
        console.log("idcli:", idcli);
        const [cliente] = await pool.query('SELECT * FROM cliente WHERE idcli = ?', [idcli]);
        console.log("query:", cliente);
        if (!cliente || cliente.length === 0) {
            // Manejar el caso donde no se encuentra ningún cliente con el idcli proporcionado
            // Por ejemplo, redirigir a una página de error o mostrar un mensaje adecuado
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        const clienteEdit = cliente[0];
        res.render('clientes/edit', { cliente: clienteEdit });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/edit/:idcli', async(req, res) => {
    try {
        const {nomcli, apecli, nrodnicli, telcli} = req.body;
        const {idcli} = req.params;
        const editCliente = {nomcli, apecli, nrodnicli, telcli};
        await pool.query('UPDATE cliente SET ? WHERE idcli = ?', [editCliente, idcli]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/delete/:idcli', async(req, res) => {
    try {
        const {idcli} = req.params;
        await pool.query('DELETE FROM cliente WHERE idcli = ?', [idcli]);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default router;