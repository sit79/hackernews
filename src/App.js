import React, { Component } from "react"
import "./App.css"

/* eslint react/prop-types: 0 */

const DEFAULT_QUERY = "redux"
const DEFAULT_HPP = "100"

const PATH_BASE = "https://hn.algolia.com/api/v1"
const PATH_SEARCH = "/search"
const PARAM_SEARCH = "query="
const PARAM_PAGE = "page="
const PARAM_HPP = "hitsPerPage="

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
)

const Table = ({ list, onDismiss }) => {
  const column = {
    large: { width: "40%" },
    middle: { width: "30%" },
    small: { width: "10%" }
  }
  return (
    <div className="table">
      {list.map(item => (
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

  getResults = async searchTerm => {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`
    let res = await fetch(url)
    let result = await res.json()
    this.setSearchTopStories(result)
  }

  onDismiss = id => {
    const isNotId = item => item.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({
      result: Object.assign({}, this.state.result, { hits: updatedHits })
    })
  }

  fetchSearchTopStories = async (searchTerm, page = 0) => {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    try {
      let res = await fetch(url)
      let result = await res.json()
      this.setSearchTopStories(result)
    } catch (error) {
      console.error(error)
    }
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value })
  }

  setSearchTopStories = result => {
    const { hits, page } = result

    const oldHits = page !== 0 ? this.state.result.hits : []
    const updatedHits = [...oldHits, ...hits]

    this.setState({ result: { hits: updatedHits, page } })
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault()
  }

  componentDidMount() {
    const { searchTerm } = this.state
    try {
      this.fetchSearchTopStories(searchTerm)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { searchTerm, result } = this.state
    const page = (result && result.page) || 0

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {result && <Table list={result.hits} onDismiss={this.onDismiss} />}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    )
  }
}

export default App
