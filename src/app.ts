import express from "express"
import mongoose from "mongoose"
import todoSchema from "./todo.schema"
import { graphqlHTTP } from "express-graphql"
import {GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString,  GraphQLNonNull} from "graphql"
import bodyParser from "body-parser"
import cors from "cors"
mongoose.connect("mongodb://localhost/todo", () => {
    console.log("done");
    
})


const app = express()
const TodoType = new GraphQLObjectType({
    name: "todo",
    description: "This has a specific todo",
    fields: () => ({
        id: { type:  GraphQLNonNull(GraphQLString) },
        text: { type: GraphQLNonNull(GraphQLString)}
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Todo application server",
    fields: () => ({
        // todo: {
        //     type: TodoType,
        //     description: "A single todo",
        //     args: {
        //         id: { type: GraphQLString}
        //     },
        //     resolve: (parent, args) => {
        //         return todoSchema.find({id: args.id})
        //     }
        // },
        todos: {
            type: new GraphQLList(TodoType),
            description: "Get all todos",
            resolve: ()=> todoSchema.find({})
       }

    })
})

const RootMutationType = new GraphQLObjectType({
    name: "mutation",
    description: "Root Mutation",
    fields: () => ({
        addTodo: {
            type: TodoType,
            description: "Add todo",
            args: {
                text: { type:  GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const newTodo = new todoSchema({ text: args.text })
                
               return  newTodo.save()
                // return todoSchema.find({})
            }
        },
        deleteTodo : {
            type: TodoType,
            description: "Delete todo",
            args: {
                id: { type:  GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
               
               return  todoSchema.findByIdAndDelete(args.id)
                 
            }
        },
        editTodo: {
            type: TodoType,
            description: "Edit todo",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                text:  { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
               
               let result =  todoSchema.findByIdAndUpdate({ _id: args.id, }, { text: args.text }, {new: true})
               return result
                 
            }
        },
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use(bodyParser.json())
app.use(cors())
app.use("/todo",bodyParser.json(), graphqlHTTP({
    graphiql: true,
    schema:  schema,

}))
app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(5000)

// 62b095500fdec9775378f669
// 62b0974971cdc10e38c6a637