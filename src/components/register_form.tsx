import React, { useState } from "react";
import { createUser } from "../Api";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await createUser({ username, email, password });
      setSuccessMessage(response.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
      <form 
        className="flex flex-col bg-white shadow-lg border rounded-xl px-16 pt-4 pb-4" 
        onSubmit={handleSubmit}
      >
        {error && <p className="text-red text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green text-sm mb-4">{successMessage}</p>}

        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Your username please"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 leading-tight"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your username please"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 leading-tight"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password please"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 leading-tight"
            required
          />
        </div>

        <div className="place-self-end">
          <button
            type="submit"
            className="bg-blue text-white py-1 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>
  );
};

export default RegisterForm;
