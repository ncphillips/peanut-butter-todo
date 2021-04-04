import handler from "next-handler-api"
import { NotFoundError } from "next-handler-errors"

export default handler({
  put: async (req, res, { prisma, userId }) => {
    let todo = await prisma.todo.findFirst({
      where: { id: req.body.id, userId },
    })

    if (!todo) throw new NotFoundError()

    const completed = !todo.completed
    const id = ~~req.query.id

    todo = await prisma.todo.update({
      where: { id },
      data: { completed },
    })

    return todo
  },
})
