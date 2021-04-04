import handler from "next-handler-api"

export default handler(async (req, res, { prisma }) => {
  if (req.method !== "PUT") {
    res.status(404)
    return {}
  }

  let todo = await prisma.todo.findFirst({ where: { id: req.body.id } })

  if (!todo) {
    res.status(404)
    return {}
  }

  const completed = !todo.completed
  const id = ~~req.query.id

  todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  })

  return todo
})
