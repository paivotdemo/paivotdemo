import About from './components/About';
import Contact from './components/Contact';
import { Countdown } from './components/Countdown'
import MainLayout from './components/MainLayout'
import {Routes, Route} from 'react-router-dom'
import MainContent from './components/MainContent';
import NoMatchRoute from './components/NoMatchRoute';
import Book from './components/Book';
import { Suspense } from 'react';

function App() {
  return (
    <div className='App'>
      
      <Routes>
          <Route path='/' element={<Countdown />}></Route>
          <Route path='cvab' element={<MainLayout />}>
            <Route index element={<MainContent />} />
            <Route path='about' element={<About />}></Route>
            <Route path='contact' element={<Contact />}></Route>
            <Route path='book/:bookId' element={<Book />}></Route>
          </Route>
          
          <Route path='*' element={<NoMatchRoute />}></Route>
       </Routes>
    </div>
  )
}

export default function WrappedApp() {
  return (
    <Suspense fallback="loading...">
      <App />
    </Suspense>
  );
}
