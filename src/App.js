import React, { Component } from "react"
import axios from "axios"
import "./App.css"

/* eslint react/prop-types: 0 */

const DEFAULT_QUERY = "redux"
const DEFAULT_HPP = "25"

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
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    }
  }

  getResults = async searchTerm => {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`
    let res = await fetch(url)
    let result = await res.json()
    this.setSearchTopStories(result)
  }

  onDismiss = id => {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]

    const isNotId = item => item.objectID !== id
    const updatedHits = hits.filter(isNotId)

    this.setState({
      results: Object.assign({}, this.state.results, {
        [searchKey]: { hits: updatedHits, page }
      })
    })
  }

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm]
  }

  fetchSearchTopStories = async (searchTerm, page = 0) => {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    try {
      let result = await axios.get(url)
      this.setSearchTopStories(result.data)
    } catch (error) {
      this.setState({ error })
    }
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value })
  }

  setSearchTopStories = result => {
    const { hits, page } = result
    const { searchKey, results } = this.state

    const oldHits = results && results[searchKey] ? results[searchKey].hits : []
    const updatedHits = [...oldHits, ...hits]

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    })
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }

    event.preventDefault()
  }

  componentDidMount() {
    const { searchTerm } = this.state
    try {
      this.setState({ searchKey: searchTerm })
      this.fetchSearchTopStories(searchTerm)
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list =
      (results && results[searchKey] && results[searchKey].hits) || []

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
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    )
  }
}

export default App

export { Button, Search, Table }
