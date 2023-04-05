// make rest api requests

export default class Api {
  url: string;
  
  constructor(url: string) {
    this.url = url;
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