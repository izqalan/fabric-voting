// make rest api requests

export default class Api {
  url = 'http://localhost:8081/api/v1';

  //constructor that takes in a url, url is optional
  constructor(url?: string) {
    if (url) {
      this.url = url;
    }
  }

  async get(path: string) {
    const res = await fetch(`${this.url}${path}`, {
      method: 'GET',
    });
    return res.json();
  }

  async post(path: string, body: any) {
    const res = await fetch(`${this.url}${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async put(path: string, body: any) {
    const res = await fetch(`${this.url}${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async delete(path: string) {
    const res = await fetch(`${this.url}${path}`, {
      method: 'DELETE',
    });
    return res.json();
  }
}
