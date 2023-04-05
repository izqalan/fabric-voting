// make rest api requests

export default class Api {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async get(path: string) {
    const res = await fetch(`${this.url}${path}`);
    return res.json();
  }

  async post(path: string, body: any) {
    const res = await fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async put(path: string, body: any) {
    const res = await fetch(`${this.url}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
