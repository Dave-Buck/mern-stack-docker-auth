import * as React from 'react';
import logo from './logo.svg';
import './App.css';
import { IAppState } from './IAppState';

export default class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      items: [],
      username: undefined
    };
  }

  public render() {

    return (
      <div className="App">
        <div>
          {!this.state.username &&
            <a href='http://localhost:5000/auth/google'>Login with Google</a>
          }
          {this.state.username &&
            <a href='http://localhost:5000/auth/logout'>Logout</a>
          }
        </div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <form onSubmit={(e) => { this.handleSubmit(e) }}>
            <header>List:</header>
            {this.state.username &&
              <span>
                <input type="text" name="item" />
                <input type="submit" value="Add" />
              </span>
            }
          </form>
          {this.state.items.map((item, idx) => {
            return (<div key={item._id}>
              {item.name}
              {this.state.username &&
                <span>
                  <span onClick={() => this.deleteItem(item._id)} style={{ color: 'red' }}>    &#10005;</span>
                  <span onClick={() => this.editItem(item._id)}>     &#9998;</span>
                </span>
              }
            </div>)
          })}
        </header>
      </div>
    )
  }

  public async componentDidMount() {
    this.getItems();
    this.getAuth();
  }

  public async handleSubmit(e: any) {
    e.preventDefault();

    if (e.target?.item.value) {
      await fetch('http://localhost:5000/item/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name: e.target.item.value })
      })
        .catch(() => console.error('Error submitting'));
    } else {
      alert('Item cannot be blank.')
    }

    this.getItems();

  }

  public async getItems() {
    await fetch('http://localhost:5000/', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(items => this.setState({ items: items.items }));
  }

  public async getAuth() {
    await fetch('http://localhost:5000/checkAuth', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(user => this.setState({ username: user.user }));
  }

  public async deleteItem(id: string) {

    await fetch('http://localhost:5000/item/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      // We convert the React state to JSON and send it as the POST body
      body: JSON.stringify({ _id: id })
    })
      .catch(() => console.error('Error submitting'));

    this.getItems();
  }

  public async editItem(id: string) {
    let newName = window.prompt('Enter the new name:');

    await fetch('http://localhost:5000/item/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      // We convert the React state to JSON and send it as the POST body
      body: JSON.stringify({ _id: id, newName: newName })
    })
      .catch(() => console.error('Error submitting'));

    this.getItems();

  }

  public async googleLogin() {
    await fetch('http://localhost:5000/auth/google');
  }
}




