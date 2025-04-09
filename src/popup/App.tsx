import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div
        className="bg-gray-100 flex flex-col text-base"
        style={{ width: '400px' }}
      >
        <Header />
        <main className="flex-grow p-3">
          <ConfigForm />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
