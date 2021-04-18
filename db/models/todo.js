const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    taskText: { type: String, required: true },
    isDone: {type: Boolean}
},
{toJSON: {virtuals: true}}
);

TodoSchema.virtual("id").get(function () {
    return this._id;
});

//Export model
module.exports = mongoose.model("Todo", TodoSchema);
