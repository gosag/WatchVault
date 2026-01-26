import "./Login.css";
import { Form, useActionData, redirect,Link } from "react-router-dom";
export default function Login() {
  const data = useActionData();
  return (
    <div className="login-page">
      <h2 className="login-title">Login Page</h2>
      <Form method="post" className="login-form">
        <label htmlFor="username">Username:</label>
        <input type="text" 
        id="username" 
        name="username" 
        minLength="3"
        maxLength="15"
        required />

        <label htmlFor="password">Password:</label>
        <input type="password" 
        id="password"
        minLength="6"
        maxLength="20"
        name="password" required />

        <button type="submit">Login</button>
        <Link className="register-link">Don't have an account? Register</Link>
      </Form>

      {data?.error && <p style={{ color: "red" }}>{data.error}</p>}
    </div>
  );
}

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const submission = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  if (!submission.username || !submission.password) {
    return { error: "Please fill all the fields" };
  }
  else{
    
  // For demo purposes only (real app would call API here)
  localStorage.setItem("user", JSON.stringify(submission));
  alert("Login successful!");
  }


  return redirect("/");
};
