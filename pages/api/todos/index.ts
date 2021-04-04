import { NextApiHandler } from "next"
import handler from "next-handler-api"
import { UnauthorizedError } from "next-handler-errors"

const todosHandler: NextApiHandler = handler({
  post: async (req, _res, { prisma, userId }) => {
    if (!userId) throw new UnauthorizedError()

    const todo = await prisma.todo.create({
      data: {
        userId: userId,
        title: req.body.title,
      },
    })

    return todo
  },
})

export default todosHandler
