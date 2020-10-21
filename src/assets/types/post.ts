export interface Post {
  date: string
  stems: { origin: string; body: string }[]
  leaves: string[]
}
