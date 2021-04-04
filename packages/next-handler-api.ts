import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
import { serializeDates } from "next-serialize-dates"

export type ApiContext = {
  prisma: PrismaClient
}

export type Callback = (
  req: NextApiRequest,
  res: NextApiResponse,
  context: ApiContext
) => Promise<any>

export function handler(cb: Callback): NextApiHandler {
  return async (req, res) => {
    const prisma = new PrismaClient()
    const context = { prisma }
    try {
      req.body = JSON.parse(req.body)

      const response = await cb(req, res, context)

      res.json(serializeDates(response))
    } catch {
      res.status(500).json({})
    } finally {
      prisma.$disconnect()
    }
  }
}

export default handler
