export const panel = `query {
  panel {
    leaves {
      totalCount
    }
    stems {
      totalCount
    }
    flowers {
      totalCount
    }
    seeds {
      totalCount
    }
    fruits {
      totalCount
    }
    posts {
      id
      day
      stems {
        nodes {
          id
          title
          body
        }
      }
      leaves {
        nodes {
          id
          title
        }
      }
    }
  }
}`

export const stemOfID = (id: string) => `query {
  node(id: ${id}) {
    ... on Stem {
      id
      title
      body
    }
  }
}`

export interface createStemInput {
  specifiedDay?: number
  parentID?: string
  title?: string
  flowering?: boolean
  tags: string[]
  body: string
}
export const createStem = (input: createStemInput) => `mutation {
  createStem(input: ${JSON.stringify(input).replace(/"([^"]+)":/g, '$1:')}) {
    id
  }
}
`
