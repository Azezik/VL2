import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileForm from "./ProfileForm";

export default function MyProfile() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) {
      fetch(`/api/profile/${stored}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("userId");
        });
    }
  }, []);

  const handleAuth = async (endpoint: string) => {
    setError("");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("userId", data.id.toString());
      setUser(data);
      setUsername("");
      setPassword("");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Authentication failed");
    }
  };

  if (!user) {
    return (
      <Layout title="My Profile">
        <div className="max-w-sm mx-auto space-y-4">
          <h2 className="text-xl font-bold text-center">
            {isSignup ? "Sign Up" : "Log In"}
          </h2>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            className="w-full"
            onClick={() => handleAuth(isSignup ? "/api/signup" : "/api/login")}
          >
            {isSignup ? "Sign Up" : "Log In"}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Have an account? Log In" : "Need an account? Sign Up"}
          </Button>
        </div>
      </Layout>
    );
  }

  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  return <ProfileForm username={user.username} onLogout={logout} />;
}
