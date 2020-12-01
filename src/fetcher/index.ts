import axios from 'axios'
import { createStem, createStemInput, panel, stemOfID } from './search'

const isServer = typeof window === 'undefined'
const isDev = process.env.NODE_ENV === 'development'

const client = axios.create({
  baseURL: isServer && isDev ? 'http://localhost:4000/' : '/api',
})

export async function hello(): Promise<string> {
  return client
    .get('/')
    .then((res) => res.data)
    .catch(() => '')
}

export async function getPanel() {
  return client
    .post('/graphql', {
      query: panel,
    })
    .then((res) => res.data.data.panel)
    .catch((err) => {
      console.log(err.message)
      return null
    })
}

export async function getStem(id: string) {
  return client
    .post('/graphql', {
      query: stemOfID(id),
    })
    .then((res) => res.data.data.node)
    .catch((err) => {
      console.log(err.message)
      return null
    })
}

export async function publish(input: createStemInput, password: string) {
  return client
    .post(
      '/graphql',
      {
        query: createStem(input),
      },
      {
        headers: {
          password,
        },
      }
    )
    .then((res) => {
      return res.data.data.createStem
    })
    .catch((err) => {
      console.log(err.message)
      return null
    })
}
