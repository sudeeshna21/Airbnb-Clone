import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function RegisterPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(e) {
        e.preventDefault();
        try{
            await axios.post('/register', {
                name,
                email,
                password
            });
            alert('Registration Successful. Now you can login!');
            handleClear();
        }
        catch(err) {
            alert('Registration Failed. Please try again later!');
        }
    }

    const handleClear = () => {
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className='mt-4 grow flex items-center justify-around'>
            <div className='mb-64'>
                <h1 className='text-4xl text-center mb-4'>Register</h1>
                <form className='max-w-md mx-auto' onSubmit={registerUser}>
                    <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)}/>
                    <input type="email" placeholder="yours@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className='primary' type="submit">Register</button>
                    <div className='text-center py-2 text-gray-500'>Already a member? <Link className='underline text-black' to='/login'>Login</Link></div>
                </form>
            </div>
        </div>
      )
}

export default RegisterPage