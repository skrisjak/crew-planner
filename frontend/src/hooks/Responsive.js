import { useEffect, useState } from "react";

export const useResponsive = () => {
    const [mobile, setMobile] = useState(window.innerWidth <= 800);
    const [fullScreen, setFullScreen] = useState(window.innerWidth === window.screen.width);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setMobile(window.innerWidth <= 800);
            setFullScreen(window.innerWidth === window.screen.width);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { mobile, fullScreen, width};
};