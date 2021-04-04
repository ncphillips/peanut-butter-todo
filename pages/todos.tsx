import { Todo } from "@prisma/client"
import { getSession } from "next-auth/client"
import serverSideHandler from "next-handler-server-side"
import { useRef, useState } from "react"

type TodosProps = {
  todos: Todo[]
}

export default function Todos(props: TodosProps) {
  const [todos, setTodos] = useState(props.todos)
  const titleRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <h1>Todos</h1>
      <input name="title" ref={titleRef} />
      <button
        onClick={() => {
          if (!titleRef.current?.value) return

          fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify({ title: titleRef.current?.value }),
          })
            .then((response) => response.json())
            .then((todo) => {
              setTodos([...todos, todo])
            })
        }}
      >
        Create Todo
      </button>
      <ul>
        {!todos.length && <div>There's nothing here.</div>}
        {todos.map((todo, index) => (
          <li key={index}>
            {todo.title} – {todo.completed && "DONE"}
            <button
              onClick={() => {
                fetch(`/api/todos/${todo.id}/toggle`, { method: "PUT" })
                  .then((response) => response.json())
                  .then((todo) => {
                    let newTodos = [...todos]
                    newTodos[index] = todo
                    setTodos(newTodos)
                  })
              }}
            >
              {todo.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const getServerSideProps = serverSideHandler(
  async ({ userId, prisma }) => {
    if (!userId) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    const todos = await prisma.todo.findMany({ where: { userId } })

    return { props: { todos } }
  }
)
