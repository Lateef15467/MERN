import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_PREFIX = "scroll-pos:";

// How long to wait for the page to grow tall enough before giving up
const MAX_RESTORE_WAIT_MS = 1500;

// Jump instantly, even if the site CSS has `scroll-behavior: smooth`
const jumpTo = (top) => {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = previous;
};

const getMaxScroll = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Which history entry is currently on screen
  const activeKey = useRef(location.key);

  // True while we are moving the page ourselves (so we don't save those moves)
  const isRestoring = useRef(false);

  // Take over scroll restoration from the browser
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Save the scroll position for the current history entry
  useEffect(() => {
    let frame = null;

    const save = () => {
      frame = null;
      if (isRestoring.current) return;

      try {
        sessionStorage.setItem(
          `${STORAGE_PREFIX}${activeKey.current}`,
          String(Math.round(window.scrollY)),
        );
      } catch (error) {
        // Storage can be unavailable (private mode); ignore
      }
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(save);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);

    // Capture the exact position right before a link click navigates away
    document.addEventListener("click", save, true);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      document.removeEventListener("click", save, true);
    };
  }, []);

  // Handle every navigation
  useLayoutEffect(() => {
    activeKey.current = location.key;
    isRestoring.current = true;

    let frame = null;
    let finished = false;

    const userEvents = ["wheel", "touchstart", "keydown", "mousedown"];

    const finish = () => {
      if (finished) return;
      finished = true;

      if (frame !== null) cancelAnimationFrame(frame);
      userEvents.forEach((name) => window.removeEventListener(name, finish));

      isRestoring.current = false;
    };

    // Normal navigation (clicking a link): go to the top,
    // or to the #section if the URL has one
    if (navigationType !== "POP") {
      const hashId = location.hash ? location.hash.slice(1) : "";
      const hashTarget = hashId ? document.getElementById(hashId) : null;

      if (hashTarget) {
        hashTarget.scrollIntoView();
      } else {
        jumpTo(0);
      }

      // Let the scroll event from this jump pass before saving again
      frame = requestAnimationFrame(() => {
        frame = null;
        finish();
      });

      return finish;
    }

    // Back / Forward: restore the saved position
    let saved = null;

    try {
      saved = sessionStorage.getItem(`${STORAGE_PREFIX}${location.key}`);
    } catch (error) {
      saved = null;
    }

    if (saved === null) {
      jumpTo(0);
      finish();
      return finish;
    }

    const target = Number(saved) || 0;
    const startedAt = performance.now();

    // If the person scrolls or interacts, stop immediately
    userEvents.forEach((name) =>
      window.addEventListener(name, finish, { passive: true }),
    );

    const tick = () => {
      frame = null;
      if (finished) return;

      const maxScroll = getMaxScroll();

      // Page is tall enough: jump once and stop
      if (maxScroll >= target) {
        jumpTo(target);
        finish();
        return;
      }

      // Page is still loading: wait, then settle at the lowest reachable point
      if (performance.now() - startedAt > MAX_RESTORE_WAIT_MS) {
        jumpTo(maxScroll);
        finish();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    tick();

    return finish;
  }, [location.key, navigationType]);

  return null;
};

export default ScrollToTop;
