import './App.css'
import Header from './Components/Header/Header'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './Pages/Home/Home'
import CharactersPage from './Pages/CharactersPage/CharactersPage'
import EpisodiesPage from './Pages/EpisodiesPage/EpisodiesPage'
import LocationPage from './Pages/LocationPage/LocationPage'
import EpisodeDetail from './Pages/EpisodeDetail/EpisodeDetail'
import LocationDetail from './Pages/LocationDetail/LocationDetail'
import NotFound from './Pages/NotFound/NotFound'
import Page from './Components/Page/Page'
import ScrollToTop from './Components/Page/ScrollToTop'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/personajes" element={<Page><CharactersPage /></Page>} />
        <Route path="/episodios" element={<Page><EpisodiesPage /></Page>} />
        <Route path="/localizacion" element={<Page><LocationPage /></Page>} />
        <Route path="/episodio/:id" element={<Page><EpisodeDetail /></Page>} />
        <Route path="/lugar/:id" element={<Page><LocationDetail /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <div id="container-pages">
        <Navbar />
        <div style={{ flex: 1, minWidth: 0, padding: '0 16px' }}>
          <ScrollToTop />
          <AnimatedRoutes />
        </div>
      </div>
    </>
  )
}
