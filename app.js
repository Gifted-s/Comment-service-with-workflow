// A simple comment app
//this is from the devlopement
const express = require('express')
const app = express()
const cors = require('cors')
let commentDB = []
const uuid = require('uuid').v1
app.use(express.json())
app.use(cors())
let rootEndpoint = '/comment-api'
app.post(rootEndpoint + '/add-comment', (req, res, next) => {

    let comment = req.body
    if (!comment.postId) {
        return res.status(400).send({ error: 'Comment must have a post id' })
    }
    if (!comment.author) {
        return res.status(400).send({ error: 'Comment must have an author' })
    }
    if (!comment.text) {
        return res.status(400).send({ error: 'Comment must have a text' })
    }
    else {
        comment.id = uuid()
        comment.dateAdded = Date.now()
        comment.dateModified = Date.now()
    }
    commentDB.push(comment)
    return res.status(201).send({ status: 'success', posted: comment })
})

app.patch(rootEndpoint + '/edit-comment/:id', (req, res) => {
    let { id } = req.params
    let commentBody = req.body
    if (!id) {
        return res.status(400).send({ error: 'id is required' })
    }
    else {
        let comment = commentDB.find((comment) => comment.id === id)
        if (!comment) {
            return res.status(400).send({ error: 'no comment with this id' })
        }
        comment = { ...comment, ...commentBody }
        comment.dateModified = Date.now()
        return res.status(201).send({ message: 'comment edited', comment })
    }
})

app.delete(rootEndpoint + '/delete-comment/:id', (req, res) => {
    let { id } = req.params
    if (!id) {
       return res.status(400).send({ error: 'id is required' })
    }
    let comment = commentDB.find((comment) => comment.id === id)
    if (!comment) {
        return res.status(400).send({ error: 'no comment with this id' })
    }
    else {
        let newComments = commentDB.filter((comment) => comment.id !== id)
        commentDB = newComments
       return res.status(201).send({ message: 'comment deleted', commentDB })
    }
})

app.get(rootEndpoint + '/get-comment/:id', (req, res) => {
    let { id } = req.params
    if (!id) {
      return  res.status(400).send({ error: 'id is required' })
    }
    else {
        let comment = commentDB.find((comment) => comment.id === id)
        if (!comment) {
         return   res.status(400).send({ error: 'no comment with this id' })
        }
        else {
         return    res.status(201).send({ comment })
        }

    }
})

app.get(rootEndpoint + '/get-comments', (req, res) => {
    res.status(201).send({comments: commentDB })
})

let server = app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})

function clearDB(){
    commentDB=[]
}
function closeServer(){
    server.close()
}
module.exports = {clearDB, closeServer}
