import crxLogo from '@/assets/crx.svg';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';
import HelloWorld from '@/components/HelloWorld';
import './App.css';

export default function App() {
  return (
    <div>
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <a href="https://crxjs.dev/vite-plugin" target="_blank" rel="noreferrer">
        <img src={crxLogo} className="logo crx" alt="crx logo" />
      </a>
      <span className="bg-red-600 text-white">TC</span>
      <HelloWorld msg="Vite + React + CRXJS" />
    </div>
  );
}
