
class GraphQLApi {
  constructor ({ store }) {
    this.dgraph = store.$dgraph
    this.baseNodeHash = process.env.DGRAPH_BASE_NODE_HASH
    // console.log(process.env.DGRAPH_BASE_NODE_HASH)
  }

  async getNodes () {
    const query = `
    {
      nodes(func: has(hash))
      @filter(eq(hash, ${this.baseNodeHash}))
      {
        uid
        content_groups {
          contents{
            expand(_all_)
          }
        }
        ledger {
          content_groups {
            contents {
              expand(_all_)
            }
          }
        }
      }
    }
    `
    return this.dgraph.newTxn().query(query)
  }
}

export default GraphQLApi
