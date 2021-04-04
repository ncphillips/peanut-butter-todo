import { signIn, signOut, useSession } from "next-auth/client"
import React from "react"
import Link from "next/link"
import handler from "next-handler-api"

export default function HomePage() {
  const [session, loading] = useSession()

  return (
    <>
      <h1>Welcome to Next.js</h1>
      {loading && <p>Loading...</p>}
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          {session.user.image && (
            <div>
              <img
                src={session.user.image}
                width="50px"
                style={{ borderRadius: "50%" }}
              />
            </div>
          )}
          <button onClick={() => signOut()}>Sign out</button>
          <Link href="/todos" passHref>
            <a>Todo List</a>
          </Link>
        </>
      )}
    </>
  )
}
