import { useState,useEffect } from 'react'
import './App.css'
function App() {
const [form, setForm] = useState({
  firstName:'',
  lastName:'',
  email:'',
  goBy:'',
});
const [data, setData] = useState<any>(null);
useEffect(()=>{
  async function FetchData(){
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data= await res.json();
    setData(data);
}
FetchData();
},[])
/* useEffect(()=>{
  const timer = setInterval(()=>{
    setCount(prevState=>prevState + 1);
  },1000);
  return () => clearInterval(timer);
},[]) */
function handleChange(e:any){
  setForm({...form, [e.target.name]:e.target.value})
}

  return (
    <>
      <div>
        <form onSubmit={
          (e) => {e.preventDefault();
          console.log(form)
          }}>
          <input
            type='text'
            placeholder='First Name'
            name="firstName"
            onChange={handleChange}
          />

          <br/>
          <input
            type='text'
            placeholder='Last Name'
            name="lastName"
            onChange={handleChange}
          />
          <br/>
          <input
            type="text"
            placeholder="Goes by"
            name="goBy"
            onChange={handleChange}
          />
          <br/>
          <input
            type='email'
            placeholder='Email'
            name='email'
            onChange={handleChange}
          />
          <br/>
          <button type='submit'>Submit</button>
        </form>
        <h1>Hey B*tch, Guess who is back?</h1>
      </div>
      <div>
        <h2>First Name: {form.firstName}</h2>
        <h2>Last Name: {form.lastName}</h2>
        <h2>Goes By: {form.goBy}</h2>
        <h2>Email: {form.email}</h2>
      </div>
      {data && (
        <div>
          <h2>Todo: {data.title}</h2>
        </div>
      )}
    </>
  )
}
export default App
