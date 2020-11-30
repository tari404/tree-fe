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
