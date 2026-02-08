import { useState, useEffect, useRef, use } from "react";

export default function useScrollHideNavbar() {
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => { 
            if (window.innerWidth >= 768) {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                    setShowNavbar(false);
                } else {
                    setShowNavbar(true);
                }
            
                lastScrollY.current = currentScrollY;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return showNavbar;
}