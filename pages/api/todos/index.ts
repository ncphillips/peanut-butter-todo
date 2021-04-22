import { NextApiHandler } from "next"
import { UnauthorizedError, api } from "next-handler"

const todosHandler: NextApiHandler = api({
  post: async ({ req, prisma, userId }) => {
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
