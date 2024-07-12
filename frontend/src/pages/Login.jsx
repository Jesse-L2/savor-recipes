import { useContext } from "react";

const Login = () => {
  const { loginUser } = useContext();

  return (
    <form onSubmit={loginUser}>
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
