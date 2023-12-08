import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  assignedUser: {
    type: String,
    default: ""
  },
  assignedUserName: {
    type: String,
    default: 'unassigned'
  },
  dateCreated: {
    type: Date,
    required: true,
  }
});
export default  model('task',taskSchema);