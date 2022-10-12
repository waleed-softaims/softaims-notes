// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API, Auth } from "aws-amplify"
import { listAllNotes } from '../../src/graphql/queries'

let data = null
export default function handler(req, res) {
  listNotes()
  res.status(200).json(data)
}
async function listNotes() {
  await API.graphql({
    query: listAllNotes,
    authMode: "API_KEY"
  }).then(result => {
    console.log(result)
    data = (JSON.parse(JSON.parse(result.data.listAllNotes).body).data.listNotes.items)
    return data
  }).catch((error) => {
    return error
  }).finally(() => {
  })
}
