import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { serializeDates } from "next-serialize-dates"
import { getSession } from "next-auth/client"

export type ApiContext = {
  prisma: PrismaClient
  userId?: number
}

export type Callback = (
  req: NextApiRequest,
  res: NextApiResponse,
  context: ApiContext
) => Promise<any>

export function handler(cb: Callback): NextApiHandler {
  return async (req, res) => {
    const prisma = new PrismaClient()
    const context: ApiContext = { prisma }
    try {
      context.userId = await getUserId(req, prisma)
      req.body = JSON.parse(req.body || "{}")

      const response = await cb(req, res, context)

      res.json(serializeDates(response))
    } catch (e) {
      console.error(e)
      res.status(500).json({ ...e })
    } finally {
      prisma.$disconnect()
    }
  }
}

async function getUserId(req: NextApiRequest, prisma: PrismaClient) {
  const session = await getSession({ req })

  if (!session) return

  const prismaSession = await prisma.session.findFirst({
    where: { accessToken: session.accessToken },
  })

  if (!prismaSession) return

  return prismaSession.userId
}

export default handler
