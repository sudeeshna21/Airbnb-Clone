
import React, { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function loginUser(e) {
        e.preventDefault();
        try{
            const {data} = await axios.post('/login', {
                email,
                password
            });
            setUser(data);
            alert('Login Successful');
            setRedirect(true);
        }
        catch(err) {
            alert('Login Failed');
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }

  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
            <h1 className='text-4xl text-center mb-4'>Login</h1>
            <form className='max-w-md mx-auto' onSubmit={loginUser}>
                <input type="email" placeholder="yours@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>
                <button className='primary' type="submit">Login</button>
                <div className='text-center py-2 text-gray-500'>Don't have an account? <Link className='underline text-black' to='/register'>Register</Link></div>
            </form>
        </div>
    </div>
  )
}

export default LoginPage;