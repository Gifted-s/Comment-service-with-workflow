const axios = require('axios')
let {clearDB, closeServer} = require('../app')
const uuid = require('uuid').v1

beforeAll(() => {

    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.validateStatus = function (status) {
        // Throw only if the status code is greater than or equal to 500
        return status < 500
    }
    
})

beforeEach(()=>{
    clearDB()
})
afterAll(()=>{
    closeServer()
})
let root = 'http://localhost:3000/comment-api'
describe('adding comments', () => {
    it('adds a comment to the database', async () => {

        const response = await axios.post(
            root + '/add-comment',
            {
                postId: uuid(),
                author: 'Adewumi Sunkanmi',
                text: 'I love this post'
            }
        )
        expect(response.status).toBe(201)
        const { posted } = response.data
        const comment = await axios.get(root + '/get-comment/'+posted.id)
        expect(comment.data.comment).toEqual(posted)
        // let newDB = commentDB.filter(comment => comment.id !== posted.id)
        // commentDB = newDB
    })
    it('requires comment to contain a postId', async () => {
        const response = await axios.post(
            root + '/add-comment',
            { postId: undefined }
        )
        expect(response.status).toBe(400)
        expect(response.data.error).toBe('Comment must have a post id')

    })
    it('requires comment to contain an author', async () => {
        const response = await axios.post(
            root + '/add-comment',
            { postId: uuid(), author: undefined }
        )
        expect(response.status).toBe(400)
        expect(response.data.error).toBe('Comment must have an author')

    })
    it('requires comment to contain a text', async () => {
        const response = await axios.post(
            root + '/add-comment',
            { postId: uuid(), author: 'Adewumi Sunkanmi', text: undefined }
        )
        expect(response.status).toBe(400)
        expect(response.data.error).toBe('Comment must have a text')

    })
})


describe('editing comments', () => {
    it('edit a comment in the database', async () => {
        let commentBody = {
            postId: uuid(),
            author: 'Adewumi Sunkanmi',
            text: 'I love this post'
        }
        const response = await axios.post(root + '/add-comment', commentBody)
        const editedComment = {
            author: 'Adewumi Demola'
        }
        const editedResponse = await axios.patch(root + '/edit-comment/' + response.data.posted.id, editedComment)
        expect(editedResponse.status).toBe(201)
        expect({ ...response.data.posted, ...editedComment, dateModified:null }).toMatchObject({...editedResponse.data.comment, dateModified: null})
    })
    it('must contain an id to edit a comment', async () => {
    
        const editedResponse = await axios.patch(root + '/edit-comment/')

        expect(editedResponse.status).toBe(404)
       
    })

    it('must return error if comment was not found', async () => {
    
        let commentBody = {
            postId: uuid(),
            author: 'Adewumi Sunkanmi',
            text: 'I love this post'
        }
        const response = await axios.post(root + '/add-comment', commentBody)
        const editedComment = {
            author: 'Adewumi Demola'
        }
       
        const editedResponse = await axios.patch(root + '/edit-comment/' + '123-456-78-sjdjsd-237283', editedComment)
        expect(editedResponse.status).toBe(400)
        expect(editedResponse.data.error).toBe('no comment with this id')
       
    })
})

describe('deleting a comment', () => {
    it('delete a comment in the database', async () => {
        let commentBody = {
            postId: uuid(),
            author: 'Adewumi Sunkanmi',
            text: 'I love this post'
        }
        const response = await axios.post(root + '/add-comment', commentBody)
      
        const deletedResponse = await axios.delete(root + '/delete-comment/' + response.data.posted.id)
        expect(deletedResponse.status).toBe(201)
        const nofound = await axios.get(root + '/get-comment/'+response.data.posted.id)
        expect(nofound.data.comment).toBe(undefined)
    })
    it('must contain an id to delete a comment', async () => {
    
        const editedResponse = await axios.delete(root + '/edit-comment/')

        expect(editedResponse.status).toBe(404)
       
    })

    it('must return error if comment was not found', async () => {
    
        const editedResponse = await axios.delete(root + '/delete-comment/' + '123-456-78-sjdjsd-237283')
        expect(editedResponse.status).toBe(400)
        expect(editedResponse.data.error).toBe('no comment with this id')
       
    })
})



describe('getting a comment', () => {
    it('get a comment from the database', async () => {
        let commentBody = {
            postId: uuid(),
            author: 'Adewumi Sunkanmi',
            text: 'I love this post'
        }
        const response = await axios.post(root + '/add-comment', commentBody)
        const comment = await axios.get(root + '/get-comment/'+response.data.posted.id)
        expect(comment.data.comment).toBeDefined()
    })
    it('must contain an id to get a comment', async () => {
    
        const editedResponse = await axios.patch(root + '/edit-comment/')

        expect(editedResponse.status).toBe(404)
       
    })

    it('must return error if comment was not found', async () => {
    
        const editedResponse = await axios.get(root + '/get-comment/' + '123-456-78-sjdjsd-237283')
        expect(editedResponse.status).toBe(400)
        expect(editedResponse.data.error).toBe('no comment with this id')
       
    })
})

describe('getting all comments', () => {
    it('get a comment from the database', async () => {
        let commentBody = {
            postId: uuid(),
            author: 'Adewumi Sunkanmi',
            text: 'I love this post'
        }
         await axios.post(root + '/add-comment', commentBody)
         await axios.post(root + '/add-comment', commentBody)
         await axios.post(root + '/add-comment', commentBody)
         await axios.post(root + '/add-comment', commentBody)
         await axios.post(root + '/add-comment', commentBody)
         await axios.post(root + '/add-comment', commentBody)
        let comments= await axios.get(root + '/get-comments/')
        expect(comments.data.comments.length).toBe(6)
    })
    
})
