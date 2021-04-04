import { NextApiHandler } from "next"
import handler from "next-handler-api"

const todosHandler: NextApiHandler = handler(async (req, _res, { prisma }) => {
  if (req.method) {
    const todo = await prisma.todo.create({
      data: {
        title: req.body.title,
      },
    })

    return todo
  }
})

export default todosHandler
