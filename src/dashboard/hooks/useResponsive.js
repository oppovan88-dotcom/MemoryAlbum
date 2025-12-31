import { useState, useEffect } from 'react';

export const useResponsive = () => {
    const [screen, setScreen] = useState({
        isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
        isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
        isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreen({
                isMobile: window.innerWidth < 768,
                isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
                isDesktop: window.innerWidth >= 1024,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screen;
};

export default useResponsive;
