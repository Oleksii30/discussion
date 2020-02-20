const express = require('express')
require('./db/mongoose')
const path = require ('path')
const cors = require ('cors')
const Comment = require ('./models/comment-model')
const utils = require('./utils/utils')


const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, './public')
app.use(express.static(publicDirectoryPath))

app.use(express.json())
app.use(cors())

app.post('/add-comment', async (req,res,next)=>{
    
    const comment = new Comment({
        author:req.body.comment.author,
        main:req.body.comment.main,
        text:req.body.comment.text,
        state:req.body.comment.state,
        subcoments:req.body.comment.subcoments
    })
    
    try{
        
            let newComment = await comment.save()
                  
            if (req.body.commentId){
            let mainComment = await Comment.findById(req.body.commentId)
            mainComment.subcomentsId.push(newComment._id)
            await mainComment.save()
            }
            res.status(201).send(newComment)
    }catch(err){
        res.status(401).send()
    }
    
})


app.get('/comments', async (req,res,next)=>{
    try{
    let comments = await Comment.find({main:true})
    let countPro = await Comment.count({main:true, state:'PRO'})
    let countCon = await Comment.count({main:true, state:'CONTRA'})

    newComments = await utils.getComments(comments)       
       res.status(200).send({newComments, countPro, countCon})
    }catch(err){
        res.status(404).send()
    }
})

app.post('/delete-comment/:id', async (req,res,next)=>{
    try {
        let comment = await Comment.findById(req.params.id)

        if (!comment) {
            res.status(404).send()
        }

        if (comment.subcomentsId.length > 0){
            await utils.deleteSubcoments(comment.subcomentsId)
        }

        if (req.body.mainId){
            let mainComment = await Comment.findById(req.body.mainId)
            mainComment.subcomentsId = mainComment.subcomentsId.filter(subcoment=>{
               return subcoment._id != req.params.id
            })
            await mainComment.save()
                       
        }

        await Comment.deleteOne(comment)
         
      
        res.status(204).send()
    } catch (err) {
        res.status(500).send()
    }
})

app.get('/get-comment/:id', async (req, res, next)=>{
    let comment = await Comment.findById(req.params.id)
    if (comment){
        res.status(200).send(comment)
    }else{
        res.status(404).send()
    }
})

app.patch('/update-comment/:id', async (req, res, next)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['author', 'state', 'text']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const comment = await Comment.findById(req.params.id)

        updates.forEach((update) => comment[update] = req.body[update])
        await comment.save()

        if (!comment) {
            return res.status(404).send()
        }

        res.send(comment)
    } catch (e) {
        res.status(400).send(e)
    }
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
