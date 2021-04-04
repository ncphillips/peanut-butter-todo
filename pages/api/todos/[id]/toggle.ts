import handler from "next-handler-api"
import { NotFoundError, NotImplemented } from "next-handler-errors"

export default handler(async (req, res, { prisma, userId }) => {
  if (req.method !== "PUT") throw new NotImplemented()

  let todo = await prisma.todo.findFirst({ where: { id: req.body.id, userId } })

  if (!todo) throw new NotFoundError()

  const completed = !todo.completed
  const id = ~~req.query.id

  todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  })

  return todo
})
