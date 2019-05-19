import React, { Component } from "react"
import "./App.css"

/* eslint react/prop-types: 0 */

const DEFAULT_QUERY = "redux"

const PATH_BASE = "https://hn.algolia.com/api/v1"
const PATH_SEARCH = "/search"
const PARAM_SEARCH = "query="

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase())

const Search = ({ value, onChange, children }) => (
  <form>
    {children}
    <input type="text" value={value} onChange={onChange} />
  </form>
)

const Table = ({ list, pattern, onDismiss }) => {
  const column = {
    large: { width: "40%" },
    middle: { width: "30%" },
    small: { width: "10%" }
  }
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item => (
        <div key={item.objectID} className="table-row">
          <span style={column.large}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={column.middle}> by {item.author}, </span>
          <span style={column.small}>{item.num_comments} comments, </span>
          <span style={column.small}>{item.points} points </span>
          <span style={column.small}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      ))}
    </div>
  )
}

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    }
  }

  onDismiss = id => {
    const isNotId = item => item.objectID !== id
    const updatedList = this.state.list.filter(isNotId)
    this.setState({ list: updatedList })
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value })
  }

  setSearchTopStories = result => {
    this.setState({ result })
  }

  componentDidMount() {
    const { searchTerm } = this.state

    async function getResults() {
      const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`
      let res = await fetch(url)
      let result = await res.json()
      return result
    }

    getResults()
      .then(res => this.setSearchTopStories(res))
      .catch(err => err)
  }

  render() {
    const { searchTerm, result } = this.state
    if (!result) {
      return null
    }
    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search
          </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    )
  }
}

export default App
