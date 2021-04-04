import { NextApiHandler } from "next"
import handler from "next-handler-api"
import { NotImplemented, UnauthorizedError } from "next-handler-errors"

const todosHandler: NextApiHandler = handler(
  async (req, _res, { prisma, userId }) => {
    if (!userId) throw new UnauthorizedError()
    if (req.method !== "POST") throw new NotImplemented()

    const todo = await prisma.todo.create({
      data: {
        userId: userId,
        title: req.body.title,
      },
    })

    return todo
  }
)

export default todosHandler
