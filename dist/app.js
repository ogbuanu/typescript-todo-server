"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const todo_schema_1 = __importDefault(require("./todo.schema"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
mongoose_1.default.connect("mongodb://localhost/todo", () => {
    console.log("done");
});
const app = (0, express_1.default)();
const TodoType = new graphql_1.GraphQLObjectType({
    name: "todo",
    description: "This has a specific todo",
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
    })
});
const RootQueryType = new graphql_1.GraphQLObjectType({
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
            type: new graphql_1.GraphQLList(TodoType),
            description: "Get all todos",
            resolve: () => todo_schema_1.default.find({})
        }
    })
});
const RootMutationType = new graphql_1.GraphQLObjectType({
    name: "mutation",
    description: "Root Mutation",
    fields: () => ({
        addTodo: {
            type: TodoType,
            description: "Add todo",
            args: {
                text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: (parent, args) => {
                const newTodo = new todo_schema_1.default({ text: args.text });
                return newTodo.save();
                // return todoSchema.find({})
            }
        },
        deleteTodo: {
            type: TodoType,
            description: "Delete todo",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: (parent, args) => {
                return todo_schema_1.default.findByIdAndDelete(args.id);
            }
        },
        editTodo: {
            type: TodoType,
            description: "Edit todo",
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            resolve: (parent, args) => {
                let result = todo_schema_1.default.findByIdAndUpdate({ _id: args.id, }, { text: args.text }, { new: true });
                return result;
            }
        },
    })
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use("/todo", body_parser_1.default.json(), (0, express_graphql_1.graphqlHTTP)({
    graphiql: true,
    schema: schema,
}));
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.listen(5000);
// 62b095500fdec9775378f669
// 62b0974971cdc10e38c6a637
