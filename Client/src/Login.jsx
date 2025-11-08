import React, { useContext } from 'react'
import { assets } from './assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from './Context/AppContext';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate()
    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

    const [state, setState] = React.useState('Login'); // Login or Sign Up
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            axios.defaults.withCredentials = true;
            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { username, email, password })
                if (data.success) {
                    toast.success("Registration Successful. Please login now.");
                    navigate('/login');

                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
                if (data.success) {
                    setIsLoggedIn(true);
                    getUserData();
                    toast.success("Login Successful");
                    navigate('/');

                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }// Stop loading


    }


    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 width-28 sm:w-32 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? "Create account" : "Login"}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? "Create your account" : "Login to your account !"}</p>
                <form onSubmit={onSubmitHandler}>
                    {
                        state === 'Sign Up' &&
                        (
                            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                                <img src={assets.person_icon} alt='' />
                                <input onChange={e => setUsername(e.target.value)} value={username} type='text' placeholder='Full Name' required className='bg-transparent outline-none' />
                            </div>
                        )
                    }
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt='' />
                        <input onChange={e => setEmail(e.target.value)} value={email} type='email' placeholder='Email' required className='bg-transparent outline-none' />
                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt='' />
                        <input onChange={e => setPassword(e.target.value)} value={password} type='password' placeholder='password' required className='bg-transparent outline-none' />
                    </div>
                    {
                        state === 'Login' && (<p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forget Password ?</p>)
                    }
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-full font-medium text-white transition-all duration-200 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:opacity-90'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Processing...
                            </div>
                        ) : (
                            state
                        )}
                    </button>

                </form>
                {
                    state === 'Sign Up' ?
                        (<p onClick={() => setState('Login')} className='text-gray-400 text-center text-xs mt-4'>Already have an account ? <span className='text-blue-400 cursor-pointer underline '>  Login here</span></p>)
                        : (<p onClick={() => setState('Sign Up')} className='text-gray-400 text-center text-xs mt-4'>Don't have an account ? <span className='text-blue-400 cursor-pointer underline '>  Sign Up</span></p>)
                }

            </div>
        </div>
    )
}

export default Login
