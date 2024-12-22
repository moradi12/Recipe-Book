// src/components/MainLayout/MainLayout.tsx
import Navbar from '../../Pages/Navbar/Navbar';
import { MainRoute } from '../../Pages/Route/MainRoute/MainRoute';
import { Footer } from '../Footer/Footer';
import './MainLayout.css';

export function MainLayout(): JSX.Element {
  return (
    <div className="MainLayout">
      <header>
        {/* Navbar is part of the header */}
        <Navbar />
      </header>

      <main>
        <MainRoute />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
