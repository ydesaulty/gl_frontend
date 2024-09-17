import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from "./pages/login";
import { Home } from "./components/home";
import { Navigation } from './components/navigation';
import { Logout } from './pages/logout';
import HomePage from './pages/HomePage';
import CSPByCategory from './pages/CSPByCategory';
import CategoryByCSP from './pages/CategoryByCSP';
import AverageBasket from './pages/AverageBasket';
import Documentation from './pages/Documentation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/csp-by-category" element={<CSPByCategory />} />
        <Route path="/category-by-csp" element={<CategoryByCSP />} />
        <Route path="/average-basket" element={<AverageBasket />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/documentation" component={Documentation} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
