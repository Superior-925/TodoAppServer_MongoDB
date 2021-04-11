const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser"); //to get req.body json data
const app = express();
//===============================

const db = require("./db");
const Todo = require("./db/models/todo");

//===============================

app.use(cors());

app.get("/todos", async (req, res, next) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (e) {
        res.status(500).send({ message: "Todo list cannot be read!" });
    }
});

app.post("/todos", bodyParser.json(), async (req, res, next) => {
    const todo = new Todo({
        taskText: req.body.taskText,
        isDone: false
    });

    try {
        await todo.save();
        res.send(todo);
    } catch (e) {
        res.status(500).send({ message: "Todo cannot be created!" });
    }
});

app.delete("/todos/ids", bodyParser.json(), async (req, res) => {

    try {
        for (i = 0; i < req.body.length; i++) {
            await Todo.deleteOne({ _id: req.body[i] });
        }
        res.status(204).send();
    } catch (e) {
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

app.delete('/todos', async function(req, res) {

    try {
        const collection = db.collection("todos");
        await collection.drop(function(err, result)
        {
            if(err){
                return console.log(err);
            }
        });
    } catch (e) {
        res.status(404).send({ message: "Collection doesn't exist!" });
    }
});

app.patch("/todos/:id", bodyParser.json(), async (req, res) => {

    try {
        const todo = await Todo.findOne({ _id: req.params.id });

            todo.isDone = !req.body.isDone;
            await todo.save();

        res.send(todo);
    } catch (e) {
        console.log(e);
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

//================================

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function (req, res) {
    res.status(404).send({ message: "PAGE NOT FOUND!" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

//===============================

app.listen(5555, () => {
    console.log("Node server started, PORT: 5555");
});
