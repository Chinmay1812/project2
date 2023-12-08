import { Router } from "express";
import { createTask, deleteTask, getTask, getTasks, replaceTask } from "../controllers/taskController.js";

const router = new Router();

router.post('/tasks',createTask);
router.get('/tasks',getTasks);
router.get('/tasks/:id',getTask);
router.put('/tasks/:id',replaceTask);
router.delete('/tasks/:id',deleteTask);
export default router;