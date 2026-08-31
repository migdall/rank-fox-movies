import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
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
  const [count, setCount] = useState(0)

  const API_KEY: string = "YOUR_OMDB_API_KEY";

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
      }
    } catch (err) {
      console.error("Failed to fetch OMDb data:", err);
      alert("Failed to fetch data. Please try again.");
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
    </div>
  )
}

export default App
