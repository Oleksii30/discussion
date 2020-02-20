const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    main: {
        type: Boolean,
        required:true
     },
   text: {
        type: String,
        required: true,
        },
    state:{
        type: String,
        required: true,
    },
    subcomentsId:[{
        _id: {
            type: mongoose.Schema.Types.ObjectId
            }
    }],
    subcoments:[]
}, 
{
    timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment