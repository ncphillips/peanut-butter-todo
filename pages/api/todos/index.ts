import { NextApiHandler } from "next"
import handler from "next-handler-api"

const todosHandler: NextApiHandler = handler(
  async (req, _res, { prisma, userId }) => {
    if (!userId) throw new Error("Not authorized")
    if (req.method) {
      const todo = await prisma.todo.create({
        data: {
          userId: userId,
          title: req.body.title,
        },
      })

      return todo
    }
  }
)

export default todosHandler
