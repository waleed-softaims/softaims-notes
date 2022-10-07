import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify"
import { createNotes } from "../src/graphql/mutations"
import { listNotes } from "../src/graphql/queries"
import { useEffect, useState } from 'react'
import Lambda from 'aws-sdk/clients/lambda'; // npm install aws-sdk
import { listAllNotes } from '../src/graphql/queries'
import useSWR from 'swr';
import axios from "axios";

const fetcher = async (url) => await axios.get(url).then((res) => res.data);

function Home({signOut,user}){

  const [list, setList] = useState([])
  const [addedNotes, setAddedNotes] = useState({})
  const { data, error } = useSWR('/api/hello', fetcher);
  if (error) return <h1>Something went wrong!</h1>
  if (!data || (data && data.size == 0)) return <h1>Loading...</h1>

  const listNotes = async() => {
    await API.graphql({
      query: listAllNotes,
      authMode: "API_KEY"
    }).then(result => {
      setList(JSON.parse(JSON.parse(result.data.listAllNotes).body).data.listNotes.items)
      return "success (then):\n\n"+JSON.stringify(result, " ", 4)
    }).catch((error) => {
      return "error (catch):\n\n"+JSON.stringify(error, " ", 4)
    }).finally(() => {
    })
  }
  const addNotes = async() => {
    await API.graphql({
      query: createNotes,
      variables: {
        input: {
          title: "Title",
          Content: "Content"
        }
      },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    }).then(result => {
      setAddedNotes(result)
      return "success (then):\n\n"+JSON.stringify(result, " ", 4)
    }).catch((error) => {
      return "error (catch):\n\n"+JSON.stringify(error, " ", 4)
    }).finally(() => {
    })
  }
  const models = async() => {
  await API.graphql({
    query: listNotes,
    authMode: "AMAZON_COGNITO_USER_POOLS"
    }).then(result => {
      setList(result.data.listNotes.items)
      console.log( "success (then):\n\n"+JSON.stringify(result, " ", 4))
    }).catch((error) => {

      console.log( "error (catch):\n\n"+JSON.stringify(error, " ", 4))
    }).finally(() => {
    })
  }
    return (
        <>
          <h1>hello {user.username}</h1>
          <button onClick={addNotes}> Add Notes</button>
          <button onClick={signOut}>Sign Out</button>
          {data ? <table className="table">
            <caption>List of Notes</caption>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">Last Updated</th>
              </tr>
            </thead>
            <tbody>

              {data.forEach((notes) => {
                <tr>
                  <td>{notes.title}</td>
                  <td>{notes.Content}</td>
                  <td>{notes.updatedAt}</td>
                </tr>
              })}
            </tbody>
          </table> : "No List Available"}

        </>
      )
}
export default withAuthenticator(Home)
