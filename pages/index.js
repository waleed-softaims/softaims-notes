import { withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify"
import { createNotes } from "../src/graphql/mutations"
import { listNotes } from "../src/graphql/queries"
import { useEffect, useState } from 'react'
import Lambda from 'aws-sdk/clients/lambda'; // npm install aws-sdk
import { listAllNotes } from '../src/graphql/queries'
import useSWR from 'swr';
import axios from "axios";

const fetcher = async (url) => await axios.get(url).then((res) => res.data );

function Home({signOut,user}){

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const addNotes = async() => {
    await API.graphql({
      query: createNotes,
      variables: {
        input: {
          title: title,
          Content: content
        }
      },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    }).then(result => {
      return "success (then):\n\n"+JSON.stringify(result, " ", 4)
    }).catch((error) => {
      return "error (catch):\n\n"+JSON.stringify(error, " ", 4)
    }).finally(() => {
    })
  }

  const { data, error } = useSWR('/api/hello', fetcher);
  if (error) return <h1>Something went wrong!</h1>
  if (!data) return <>

    <h1>Loading...</h1>
    <h1>hello {user.username}</h1>
    <button onClick={signOut}>Sign Out</button>
    <form onSubmit={addNotes} method="post">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" onChange={(event)=>setTitle(event.target.value)}/>
      <label for="content">Content</label>
      <input type="text" id="content" name="content" onChange={(event)=>setContent(event.target.value)} />
      <button type="submit">Submit</button>
    </form>
    
  </>
  const listItems = data.map(notes => {
    return (

      <div key={notes.id} class="card card-1">
        <div class="card__icon"><i class="fas fa-bolt"></i>{notes.title}</div>
        <p class="card__exit"><i class="fas fa-times"></i></p>
        <h2 class="card__title">{notes.Content}</h2>
      </div>
      )
    })

  return (
        <>
          <h1>hello {user.username}</h1>
          <button onClick={signOut}>Sign Out</button>
          <form onSubmit={addNotes} method="post">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" onChange={(event)=>setTitle(event.target.value)}/>
            <label for="content">Content</label>
            <input type="text" id="content" name="content" onChange={(event)=>setContent(event.target.value)} />
            <button type="submit">Submit</button>
          </form>
          <div class="main-container">
            <div class="cards">

              {listItems}
            </div>
          </div>

        </>
      )
}
export default withAuthenticator(Home)
