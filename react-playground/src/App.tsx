import { useState } from 'react'
import './App.css'
function App() {
const [form, setForm] = useState({
  firstName:'',
  lastName:'',
  email:''})
  return (
    <>
      <div>
        <form onSubmit={
          (e) => {e.preventDefault(),
          console.log(form)
          }}>
          <input
            type='text'
            placeholder='First Name'
            value={form.firstName}
            onChange={(e) => setForm({...form, firstName: e.target.value})}
          />
          <br/>
          <input
            type='text'
            placeholder='Last Name'
            value={form.lastName}
            onChange={(e) => setForm({...form, lastName: e.target.value})}
          />
          <br/>
          <input
            type='email'
            placeholder='Email'
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <br/>
          <button type='submit'>Submit</button>
        </form>
        <h1>Hey B*tch, Guess who is back?</h1>
      </div>
      <div>
        <h2>First Name: {form.firstName}</h2>
        <h2>Last Name: {form.lastName}</h2>
        <h2>Email: {form.email}</h2>
      </div>
    </>
  )
}
export default App
