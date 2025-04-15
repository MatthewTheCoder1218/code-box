import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../helper/supabaseClient'; // Adjust path if needed
import toast from 'react-hot-toast';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // 1. Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // Store full_name in auth.users metadata (optional)
          },
        },
      });

      if (authError) {
        setMessage(authError.message);
        setLoading(false);
        return;
      }

      console.log("User created in Auth:", authData);

      // 2. Insert user data into the 'users' table
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, full_name: name, email }]);

      if (dbError) {
        toast.error("Error creating user profile. Please try again.");
        setMessage("Error creating user profile. Please try again.");
      } else {
        console.log("User data stored in 'users' table");
        setMessage("Account created successfully!");
        toast.success("Account created successfully!")
        // Redirect to home or another appropriate page
        navigate('/login');
      }
    } catch (error) {
      toast.error("Signup error:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }

    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
      <div className="w-full max-w-sm p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-white text-black rounded-md font-semibold hover:scale-105 transition"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;