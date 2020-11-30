import axios from 'axios'
import { panel } from './search'

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
