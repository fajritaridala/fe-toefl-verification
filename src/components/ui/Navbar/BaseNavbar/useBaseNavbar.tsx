"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useBaseNavbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return { isScrolled, handleLogin };
};

export default useBaseNavbar;
