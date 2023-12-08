import { Schema, Types, model } from "mongoose";

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  pendingTasks: [{
    type: Types.ObjectId,
    ref: 'task'
  }],
  dateCreated: {
    type: Date,
    required: true,
  }
});

export default model("user", userSchema);