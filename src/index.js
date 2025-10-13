import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/auth';
import "./global.css"
import Routes from './routes/routes.js';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <AuthProvider>
    <Routes/>
  </AuthProvider>
    
  
);

