import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-900 to-sky-300">
      <div className="w-full max-w-md bg-white bg-opacity-95 shadow-xl rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain mb-3"
          />
          <h1 className="text-2xl font-semibold text-gray-800">SS ENTERPRISES</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="userEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="userEmail"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="userPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="userPassword"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {/* <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Forgot your password?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Reset it here
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}
