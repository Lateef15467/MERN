import React, { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ShopContext } from "../context/ShopContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SocialLogin = ({ mode = "Login" }) => {
  const { settoken, setUser, backendUrl } = useContext(ShopContext);

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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        OR
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => toast.error("Google sign-in failed")}
            text={mode === "Login" ? "signin_with" : "signup_with"}
            width="320"
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default SocialLogin;
