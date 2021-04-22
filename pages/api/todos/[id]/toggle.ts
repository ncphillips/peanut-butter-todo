import { NotFoundError, api } from "next-handler"

export default api({
  put: async ({ req, prisma, userId }) => {
    const id = ~~req.query.id

    let todo = await prisma.todo.findFirst({
      where: { id, userId },
    })

    if (!todo) throw new NotFoundError()

    const completed = !todo.completed

    todo = await prisma.todo.update({
      where: { id },
      data: { completed },
    })

    return todo
  },
})
