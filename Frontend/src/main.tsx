import { StrictMode } from 'react'
import ReactDOM  from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx'
import CardPage from './CardPage.tsx';
import CardEditPage from './CardEditPage.tsx';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element = {<App />}/>
      <Route path='/item/:id' element = {<CardPage />}/>
      <Route path="/edit/:id" element={<CardEditPage />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
