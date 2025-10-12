import './App.css'
import Header from './Components/Header/Header'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import EpisodiesPage from './Pages/EpisodiesPage/EpisodiesPage'
import CharactersPage from './Pages/CharactersPage/CharactersPage'
import LocationPage from './Pages/LocationPage/LocationPage'
import NotFound from './Pages/NotFound/NotFound'
import Home from './Pages/Home/Home'

function App() {
  return (
    <>
          <Header />
      <div id='container-pages'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/episodios" element={<EpisodiesPage />} />
          <Route path="/personajes" element={<CharactersPage />} />
          <Route path="/localizacion" element={<LocationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
