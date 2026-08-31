import { useState } from 'react'
import './App.css'

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [rankedList, setRankedList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY: string = import.meta.env.VITE_OMDB_API_KEY;

  const searchMovies = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`);
      const data = await response.json();

      if (data.Response === 'True') {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
        setError("No data")
      }
    } catch (err) {
      console.error("Failed to fetch OMDb data:", err);
      alert("Failed to fetch data. Please try again.");
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToRanking = (movie: Movie) => {
    if (!rankedList.find((item) => item.imdbID === movie.imdbID)) {
      setRankedList([...rankedList, movie]);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newList = [...rankedList];
    if (direction === 'up' && index > 0) {
      [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    } else if (direction === 'down' && index < newList.length - 1) {
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    }
    setRankedList(newList);
  };

  const removeFromRanking = (imdbID: string) => {
    setRankedList(rankedList.filter((movie) => movie.imdbID !== imdbID));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Fox Property Ranker</h1>
      <p>Search for iconic Fox properties and build your top list.</p>

      <form onSubmit={searchMovies} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search movie title..." 
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Search OMDb</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <h2>Search Results</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {searchResults.map((movie) => (
              <div key={movie.imdbID} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <strong>{movie.Title}</strong> ({movie.Year})
                <button 
                  onClick={() => addToRanking(movie)}
                  style={{ display: 'block', marginTop: '5px' }}>
                  + Add to Rank
                </button>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2>My Official Ranking</h2>
          {rankedList.length === 0 ? (
            <p>Your list is empty. Add some movies!</p>
          ) : (
            <ol style={{ paddingLeft: '20px' }}>
              {rankedList.map((movie, index) => (
                <li key={movie.imdbID} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <strong>{movie.Title}</strong> ({movie.Year})
                  <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
                    <button onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                      ⬆️ Up
                    </button>
                    <button onClick={() => moveItem(index, 'down')} disabled={index === rankedList.length - 1}>
                      ⬇️ Down
                    </button>
                    <button onClick={() => removeFromRanking(movie.imdbID)} style={{ color: 'red', marginLeft: 'auto' }}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
