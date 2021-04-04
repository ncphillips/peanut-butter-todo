import { PrismaClient } from "@prisma/client"
import { ParsedUrlQuery } from "node:querystring"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import serializeDates from "next-serialize-dates"

export type ServerSideHandlerContext = GetServerSidePropsContext & {
  prisma: PrismaClient
}

export type ServerSideHandlerCallback<P> = (
  context: ServerSideHandlerContext
) => Promise<GetServerSidePropsResult<P>>

export function serverSideHandler<P = any, Q extends ParsedUrlQuery = any>(
  callback: ServerSideHandlerCallback<P>
): GetServerSideProps<P, Q> {
  return async (context) => {
    const prisma = new PrismaClient()

    let result = {}

    try {
      result = await callback({ ...context, prisma })
    } catch (e) {
      console.error(e)
    } finally {
      prisma.$disconnect()
    }

    return serializeDates(result)
  }
}

export default serverSideHandler
