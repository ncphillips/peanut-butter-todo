import { PrismaClient } from "@prisma/client"
import { ParsedUrlQuery } from "node:querystring"
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next"
import serializeDates from "next-serialize-dates"
import { getSession } from "next-auth/client"
import { Session } from "next-auth"

export type SsrContext = GetServerSidePropsContext & {
  prisma: PrismaClient
  userId?: number
}

export type SsrCallback<P> = (
  context: SsrContext
) => Promise<GetServerSidePropsResult<P>>

export function ssr<P = any, Q extends ParsedUrlQuery = any>(
  callback: SsrCallback<P>
): GetServerSideProps<P, Q> {
  return async (context) => {
    const prisma = new PrismaClient()

    let result: any = { props: {} }
    let session: Session | null = null

    try {
      session = await getSession(context)
      const userId = await getUserId(prisma, session)

      result = await callback({ ...context, prisma, userId })
    } catch (e) {
      console.error(e)
    } finally {
      prisma.$disconnect()
    }

    return serializeDates({ ...result, props: { ...result.props, session } })
  }
}

async function getUserId(prisma: PrismaClient, session: Session | null) {
  if (!session) return

  const prismaSession = await prisma.session.findFirst({
    where: { accessToken: session.accessToken },
  })

  if (!prismaSession) return

  return prismaSession.userId
}

export default ssr
