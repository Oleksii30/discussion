const Comment = require ('../models/comment-model')

async function getComments(comments){
    for (let comment of comments){
        if (comment.subcomentsId.length > 0){

         for (let subcoment of comment.subcomentsId){
             subcoment = await Comment.findById(subcoment._id)
             comment.subcoments.push(subcoment)
         }
         
         await getComments(comment.subcoments)
     }
    }
    
    return comments
}

async function deleteSubcoments(subcoments){
    for (let subcomentId of subcoments){
        let subcoment = await Comment.findById(subcomentId._id)
            
            if (subcoment.subcomentsId.length > 0){
               await deleteSubcoments(subcoment.subcomentsId)
                await Comment.deleteOne(subcoment)
            }else{
                await Comment.deleteOne(subcoment)
            }       
    }
}


module.exports = {getComments, deleteSubcoments}