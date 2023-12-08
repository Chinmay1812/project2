import userModel from "../models/userModel.js"
import asyncHandler from 'express-async-handler'
import { APIError, BadRequestError, NotFoundError } from "../utils/appError.js";
import mongoose from "mongoose";
import addToQuery from "../utils/addToQuery.js";
import taskModel from "../models/taskModel.js";

export const getUsers = asyncHandler(async (req,res) =>{
    let usersQuery = userModel.find({});
    const fields = ['sort','where','skip','limit'];
    if(req.query.count) usersQuery.count();
    else fields.push('select');

    usersQuery = addToQuery(usersQuery,req.query,fields);
    const users = await usersQuery.exec();
    const resObj = {
        message: "OK",
        data : users,
    };
    res.status(200).json(resObj)
})

export const createUser = asyncHandler(async (req,res) =>{
    const {name,email,pendingTasks} = req.body;
    if(!name || !email) throw new BadRequestError("Both name and Email is required");
    const existedUser = await userModel.findOne({name: name, email: email});
    if(existedUser) throw new APIError('User already exists',409,"User with the same name and email already exists");

    const newUser = new userModel({name: name, email: email,dateCreated: Date.now(),pendingTasks:pendingTasks});
    await newUser.save();
    let query = userModel.findById(newUser._id);
    query = addToQuery(query,req.query,['select'])
    const fetchedUser = await query.exec();
    res.status(200).json({
        message: "User created successfully",
        data : fetchedUser
    })

})

export const getUser = asyncHandler(async (req,res) =>{
    const id = req.params.id;

    let objectId;
    try{
        objectId = new mongoose.Types.ObjectId(id);
    }catch(err){
        throw new BadRequestError("Id is not valid",err)
    }
    let userQuery = userModel.findById(objectId);
    userQuery = addToQuery(userQuery,req.query,['select'])
    const user = await userQuery.exec();
    if(!user) throw new NotFoundError("User not found!");
    res.status(200).json({
        message: "OK",
        data: user
    })
});

export const replaceUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const {name,email,pendingTasks} = req.body;
    if(!name || !email) throw new BadRequestError("Both name and Email is required");
    let objectId;
    try{
        objectId = new mongoose.Types.ObjectId(id);
    }catch(err){
        throw new BadRequestError("Id is not valid",err)
    }

    const oldUser = await userModel.findById(objectId);
    if(!oldUser) throw new NotFoundError("User not found");

    // delete user from tasks
    oldUser.pendingTasks.forEach(async taskId => {
        const task = await taskModel.findById(taskId);
        task.assignedUser = "";
        task.assignedUserName = "unassigned";
        await task.save();
    })

    oldUser.name = name;
    oldUser.email = email;
    oldUser.pendingTasks = pendingTasks;

    await oldUser.save();
    res.status(200).json({
        message: "User replaced successfully",
        data: oldUser
    })

})
export const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    let objectId;
    try{
        objectId = new mongoose.Types.ObjectId(id);
    }catch(err){
        throw new BadRequestError("Id is not valid",err)
    }

    const user = await userModel.findById(id);
    if(!user) throw new NotFoundError("User with provided Id does not exist");
    
    // delete user from tasks
    user.pendingTasks.forEach(async taskId => {
        const task = await taskModel.findById(taskId);
        if(!task) return;
        task.assignedUser = "";
        task.assignedUserName = "unassigned";
        await task.save();
    })

    const response = await userModel.deleteOne({ _id:objectId });
    res.status(200).json({
        message: "User deleted successfully",
        data: user
    })

})