import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(express.json())

const prisma = new PrismaClient()

app.post("/user/sample", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: "Job",
      email: "lipatjobj@gmail.com",
    }
  })
  res.json(user)
})

// Posts
app.get('/posts', async (req, res) => {
  const { sortBy } = req.query
  const sortOption = ({
    "new": { orderBy: { dateCreated: "desc" } },
    "best": { orderBy: { dateCreated: "desc" } },
    "controversial": { orderBy: { dateCreated: "desc" } },
  })[sortBy] || ({})

  const posts = await prisma.post.findMany({ sortOption })
  res.json(posts)
})

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.findFirst({ where: { id: parseInt(id) } })
  res.json(post)
})

app.post('/posts', async (req, res) => {
  const { title, content } = req.body
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: 0,
      dateCreated: new Date()
    }
  })
  res.json(post)
})

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({ where: { id } })
  res.json(post)
})

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: parseInt(id) },
    data: {
      title,
      content,
      dateCreated: new Date()
    }
  })
  res.json(post)
})

// Comments
app.get('/posts/:id/comment', async (req, res) => {
  const { id: postId } = req.params
  const comments = await prisma.comment.findMany({ where: { postId: parseInt(postId) } })
  res.json(comments)
})

app.post('/posts/:id/comment', async (req, res) => {
  const { id: postId } = req.params
  const { content } = req.body
  const post = await prisma.comment.create({
    data: {
      content,
      postId: parseInt(postId),
      authorId: 0,
      dateCreated: new Date()
    }
  })
  res.json(post)
})

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  prisma.user.create({})
})