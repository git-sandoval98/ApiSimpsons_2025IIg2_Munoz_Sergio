import './App.css'
import Header from './Components/Header/Header'
import Navbar from './Components/Navbar/Navbar'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import EpisodiesPage from './Pages/EpisodiesPage/EpisodiesPage'
import CharactersPage from './Pages/CharactersPage/CharactersPage'
import LocationPage from './Pages/LocationPage/LocationPage'

function App() {
  return (
    <Router>
      <p>Hola</p>
      <Header />
      <div id='container-pages'>
        <Navbar />
        <Routes>
          <Route path='/episodios' element={<EpisodiesPage />} />
          <Route path='/personajes' element={<CharactersPage />} />
          <Route path='/localizacion' element={<LocationPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
