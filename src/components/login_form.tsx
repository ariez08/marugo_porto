import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Api";
import CapsuleButton from "./capsule_button";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await loginUser({ username, password });
      setSuccessMessage(response.message);
      login(username);
      navigate("/collection");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
    }
  };

  return (
      <form
        className="flex flex-col w-full"
        onSubmit={handleSubmit}
      >
        {error && (
          <p className="text-red font-bold text-xs bg-red/10 p-2.5 rounded-xl border border-red mb-4 text-center">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-green font-bold text-xs bg-green/10 p-2.5 rounded-xl border border-green mb-4 text-center">
            {successMessage}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-black-100 text-sm font-bold font-desc mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/90 border border-gray-300 rounded-xl w-full py-2.5 px-3.5 leading-tight focus:outline-none focus:border-blue text-black-100 shadow-inner font-desc text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black-100 text-sm font-bold font-desc mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/90 border border-gray-300 rounded-xl w-full py-2.5 px-3.5 leading-tight focus:outline-none focus:border-blue text-black-100 shadow-inner font-desc text-sm"
            required
          />
        </div>

        <div className="mt-2">
          <CapsuleButton
            type="submit"
            className="w-full bg-yellow-200 hover:bg-yellow-100 font-desc"
            containerClassName="w-full"
          >
            Masuk Sekarang
          </CapsuleButton>
        </div>
      </form>
  );
};

export default LoginForm;
