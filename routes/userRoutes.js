import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, replaceUser } from "../controllers/userController.js";

const router = new Router();

router.get('/users',getUsers);
router.post('/users',createUser);
router.get('/users/:id',getUser);
router.put('/users/:id',replaceUser);
router.delete('/users/:id',deleteUser);

export default router;