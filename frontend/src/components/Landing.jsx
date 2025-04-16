import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to Recipe App</h1>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
