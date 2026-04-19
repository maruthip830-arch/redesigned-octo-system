import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Products from '../components/Products';
import Process from '../components/Process';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        let elem = document.getElementById(location.hash.slice(1));
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Features />
      <Products />
      <Process />
    </>
  );
};

export default Home;
