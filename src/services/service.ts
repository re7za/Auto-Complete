function fetchApi(url: string, signal: any): Promise<[]> {
  return fetch(url, { signal})
      .then(async res => {
        const result = await res.json();
        return result.items;
      });
}

export default fetchApi;
