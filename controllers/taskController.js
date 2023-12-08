import taskModel from "../models/taskModel.js";
import asyncHandler from "express-async-handler";
import { BadRequestError, NotFoundError } from "../utils/appError.js";
import mongoose from "mongoose";
import addToQuery from "../utils/addToQuery.js";
import userModel from "../models/userModel.js";

export const getTasks = asyncHandler(async (req, res) => {
  let tasksQuery = taskModel.find({});
  const fields = [
    "sort",
    "where",
    "skip",
    "limit",
  ]
  if(req.query.count) tasksQuery.count();
  else fields.push('select')
  tasksQuery = addToQuery(tasksQuery, req.query, fields);
  const tasks = await tasksQuery.exec();
  const resObj = {
    message: "OK",
    data: tasks,
  };
  res.status(200).json(resObj);
});

export const createTask = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    deadline,
    assignedUser,
    assignedUserName,
    completed,
  } = req.body;
  if (!name || !description || !deadline)
    throw new BadRequestError(
      "One of name , description , deadline is missing"
    );

  const newTask = new taskModel({
    name,
    description,
    deadline,
    assignedUser,
    assignedUserName,
    completed,
    dateCreated: Date.now(),
  });

  if (newTask.assignedUser !== "") {
    const user = await userModel.findById(newTask.assignedUser);
    if (!user) throw new BadRequestError("AssignedUser Not Found");
    user.pendingTasks.push(newTask._id);
    await user.save();
  }

  await newTask.save();

  let query = taskModel.findById(newTask._id);
  query = addToQuery(query, req.query, ["select"]);
  const fetchedTask = await query.exec();
  res.status(200).json({
    message: "New task created successfully",
    data: fetchedTask,
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const id = req.params.id;

  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(id);
  } catch (err) {
    throw new BadRequestError("Id is not valid", err);
  }
  let taskQuery = taskModel.findById(objectId);
  taskQuery = addToQuery(taskQuery, req.query, ["select"]);
  const task = await taskQuery.exec();
  if (!task) throw new NotFoundError("Task not found!");
  res.status(200).json({
    message: "OK",
    data: task,
  });
});

export const replaceTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    name,
    description,
    deadline,
    assignedUser,
    assignedUserName,
    completed,
  } = req.body;
  if (!name || !description || !deadline)
    throw new BadRequestError(
      "One of name , description , deadline is missing"
    );

  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(id);
  } catch (err) {
    throw new BadRequestError("Id is not valid", err);
  }

  const oldtask = await taskModel.findById(objectId);
  if(!oldtask) throw new NotFoundError("Task not found");
  const oldUserId = oldtask.assignedUser;

  // Checking if new user id provided exists
  if(assignedUser !== ""){
    const newUser = await userModel.findById(assignedUser);
    if(!newUser) throw new NotFoundError("Assigned User not found");
    newUser.pendingTasks.push(oldtask._id);
    await newUser.save();
  }

  if(oldUserId !== "") {
    const oldUser = await userModel.findById(oldUserId);
    oldUser.pendingTasks = oldUser.pendingTasks.filter(taskid => (taskid !== id));
    await oldUser.save();
  } 

  oldtask.name = name;
  oldtask.description = description;
  oldtask.deadline = deadline;
  oldtask.assignedUser = assignedUser;
  oldtask.assignedUserName = assignedUserName;
  oldtask.completed = completed;

  await oldtask.save();
  
  res.status(200).json({
    message: "Task replaced successfully",
    data: oldtask,
  });
});


export const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(id);
  } catch (err) {
    throw new BadRequestError("Id is not valid", err);
  }

  const task = await taskModel.findById(objectId);
  if (!task) throw new NotFoundError("Task with provided Id does not exist");
  
  if(task.assignedUser !== ""){
    const oldUser = await userModel.findById(task.assignedUser);
    if(oldUser) {
        oldUser.pendingTasks = oldUser.pendingTasks.filter(taskid => (taskid !== id));
        await oldUser.save();
    }
  }

  const response = await taskModel.deleteOne({ _id: objectId });
  res.status(200).json({
    message: "Task deleted successfully",
    data: task,
  });
});
