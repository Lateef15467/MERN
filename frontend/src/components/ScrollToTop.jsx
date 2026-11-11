import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const activeKey = useRef(location.key);
  const isRestoring = useRef(false);

  // Save scroll position independently for each history entry
  useEffect(() => {
    const savePosition = () => {
      if (isRestoring.current) return;

      sessionStorage.setItem(
        `page-scroll-${activeKey.current}`,
        String(window.scrollY),
      );
    };

    window.addEventListener("scroll", savePosition, {
      passive: true,
    });

    window.addEventListener("pagehide", savePosition);
    document.addEventListener("click", savePosition, true);

    return () => {
      savePosition();
      window.removeEventListener("scroll", savePosition);
      window.removeEventListener("pagehide", savePosition);
      document.removeEventListener("click", savePosition, true);
    };
  }, []);

  // Restore the correct page position on Back / Forward
  useLayoutEffect(() => {
    activeKey.current = location.key;

    let observer;
    let timeout;
    let cancelled = false;

    if (navigationType !== "POP") {
      isRestoring.current = true;

      window.scrollTo(0, 0);

      requestAnimationFrame(() => {
        isRestoring.current = false;
      });

      return;
    }

    const savedPosition = sessionStorage.getItem(`page-scroll-${location.key}`);

    if (savedPosition === null) {
      isRestoring.current = false;
      window.scrollTo(0, 0);
      return;
    }

    const target = Number(savedPosition);

    isRestoring.current = true;

    const restorePosition = () => {
      if (cancelled) return;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll >= target) {
        window.scrollTo(0, target);
        isRestoring.current = false;

        observer?.disconnect();
        clearTimeout(timeout);
      } else {
        window.scrollTo(0, Math.max(0, maxScroll));
      }
    };

    requestAnimationFrame(restorePosition);

    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(restorePosition);
      observer.observe(document.documentElement);
    }

    window.addEventListener("resize", restorePosition);

    timeout = setTimeout(() => {
      isRestoring.current = false;
      observer?.disconnect();
    }, 3000);

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(timeout);
      window.removeEventListener("resize", restorePosition);
    };
  }, [location.key, navigationType]);

  return null;
};

export default ScrollToTop;
