import './App.css';
import { Navigate, Route, Routes } from 'react-router';
import AboutPage from './pages/AboutPage/AboutPage';
import CharacterDetailsPage from './pages/CharacterDetailsPage/CharacterDetailsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SearchPage from './pages/SearchPage/SearchPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/page/1" replace />} />

      <Route path="/page/:pageNumber" element={<SearchPage />}>
        <Route path="details/:characterId" element={<CharacterDetailsPage />} />
      </Route>

      <Route path="/about" element={<AboutPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
