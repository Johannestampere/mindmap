'use server'

export async function createMindmap({
  name,
  userId,
}: {
  name: string
  userId: string
}): Promise<string | null> {
  const res = await fetch('http://hfcs.csclub.uwaterloo.ca:8000/create_mindmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, id: userId }),
  })

  if (!res.ok) return null

  const json = await res.json()
  return json.mindmap_id
}
