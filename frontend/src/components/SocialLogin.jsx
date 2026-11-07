import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ShopContext } from "../context/ShopContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SocialLogin = ({ mode = "Login" }) => {
  const { settoken, setUser, backendUrl } = useContext(ShopContext);

  // The Google button needs a pixel width (200 to 400), so we measure the
  // space available and keep it updated when the screen size changes.
  const wrapRef = useRef(null);
  const [btnWidth, setBtnWidth] = useState(280);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w) setBtnWidth(Math.min(400, Math.max(200, w)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleGoogle = async (credentialResponse) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/google", {
        credential: credentialResponse.credential,
      });

      if (data.success) {
        // same steps your normal login uses
        settoken(data.token);
        localStorage.setItem("token", data.token);
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        toast.success("Login successful!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        OR
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div ref={wrapRef} className="flex w-full justify-center overflow-hidden">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            key={btnWidth}
            onSuccess={handleGoogle}
            onError={() => toast.error("Google sign-in failed")}
            text={mode === "Login" ? "signin_with" : "signup_with"}
            width={String(btnWidth)}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SocialLogin;
