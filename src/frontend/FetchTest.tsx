import { useState, useEffect } from 'react'

export default function App() {
  const [toPost, setToPost] = useState(
    JSON.stringify(
      { title: 'test insert', completed: false, shouldBeString: 89 },
      null,
      4
    )
  )

  const [currentDB, setCurrentDB] = useState('')
  const getCurrentDB = async () => {
    setCurrentDB(
      JSON.stringify(await (await fetch('/api/tasks')).json(), null, 4)
    )
  }
  useEffect(() => {
    getCurrentDB()
  }, [])

  const [currentError, setCurrentError] = useState('')
  const postToDB = async () => {
    try {
      const res = await fetch('/api/tasks', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.parse(JSON.stringify(toPost)) // ensure valid json
      })
      if (!res.ok) {
        throw JSON.stringify(await res.json())
      }
      setCurrentError('')
      await getCurrentDB()
    } catch (e: any) {
      setCurrentError(e.toString())
    }
  }

  return (
    <>
      <h3>Enter a Task in JSON form:</h3>
      <textarea
        style={{ display: 'block', width: 500, minHeight: 200 }}
        value={toPost}
        onChange={(e) => setToPost(e.target.value)}
      />
      <button onClick={postToDB}>
        Post task to <pre style={{ display: 'inline' }}>/api/tasks</pre>
      </button>
      {currentError && (
        <>
          <h4>Error:</h4>
          <pre>{currentError}</pre>
        </>
      )}
      <h2>Current DB entries:</h2>
      <pre>{currentDB}</pre>
    </>
  )
}
