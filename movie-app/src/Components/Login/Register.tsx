import "./Login-and-register.css";
import { Form, useActionData, redirect,Link ,useLocation} from "react-router-dom";
export default function Register() {
  const data = useActionData();
  const location = useLocation();
  const isToggled = location.state?.isToggled || false;
  return (
    <div className={`login-page ${isToggled ? "dark-theme" : ""}`}>
      <h2 className="login-title">Welcome to movie app!</h2>
      <Form method="post" className={`login-form ${isToggled ? "dark-form" : ""}`}>
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

        <button type="submit">Register</button>
        <Link className="register-link" to="/login">Already have an account? Login</Link>
        <Link className="go-back" to="/">Go Back</Link>
      </Form>
  
      {data?.error && <p style={{ color: "red" }}>{data.error}</p>}
    </div>
  );
}

export const registerAction = async ({ request }) => {
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
