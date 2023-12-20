import React,{useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const apiURL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [loginDetails,setLoginDetails]= useState({
    email:'',
    password:''
  })

  const handleInputChange = (event)=>{
    const {name,value}= event.target;
    setLoginDetails((prevDetails) => ({
       ...prevDetails, [name]: value 
      }))
  }

  const [errorMessage, setErrorMessage] = useState(null);

  const handleUserLogin = async ()=>{
    try{
      const response = await axios.post(`${apiURL}/login`,loginDetails);
      if(response.status===200){
        localStorage.setItem("token",response.data.token)
        navigate('/');
        
      }
    }catch(error){
      if(error.response.status===404){
        setErrorMessage("User is not Registered")
      }
      else if(error.response.status===401){
        setErrorMessage("Authorization Error! Please Check Password")
      }else{
        setErrorMessage("Network Error")
      }
    }
  }
  
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-6 gap-0 mt-10">
        {/* Left Side */}
        <div className="col-span-6 lg:col-span-3 xl:col-span-3">
          <div className="bg-gray-200 p-4">
            <h1 className="text-5xl font-thin md:text-center">
              Welcome to VChat Instant Messaging App
            </h1>
            <div className="mt-10 w-full max-w-md mx-auto  border-2 border-black border-opacity-20 rounded-md p-4 lg:p-8">
              
              {/* set Error Message Area */}
              <div className="text-red-500 text-start mb-2">
                {errorMessage && <p>{errorMessage}</p>}
              </div>

              <form className="" onSubmit={(e)=>e.preventDefault()}> 
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-4 px-3"
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={loginDetails.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border border-red-500 rounded w-full py-4 px-3"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="******************"
                    value={loginDetails.password}
                    onChange={handleInputChange}
                  />
                  <p className="text-red-500 text-xs italic">
                    Please Enter Your Password.
                  </p>
                </div>
                <div className="items-center justify-between">
                  <Link
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    to="fogot-password"
                  >
                    Forgot Password?
                  </Link>
                  <button
                    className="mt-6 bg-orange-500 hover:bg-blue-700 font-bold text-white w-full py-3 px-4 rounded-3xl"
                    type="submit"
                    onClick={handleUserLogin}
                  >
                    Sign In
                  </button>
                </div>
              </form>
              <div className="flex items-center mt-6">
                <div className="flex-grow border-b border-solid border-black"></div>
                <div className="mx-4">or</div>
                <div className="flex-grow border-b border-solid border-black"></div>
              </div>
              {/* Google Sign in Area */}
              <div>
                <p className="text-xs">
                  By clicking Continue, you agree to Our User Agreement, Privacy
                  Policy, and Cookie Policy.
                </p>
                <button
                  className="mt-6 flex items-center hover:bg-blue-700 hover:text-white text-black w-full py-2 px-4 rounded-3xl outline outline-2"
                  type="button"
                >
                  <div className="flex mx-auto">
                    <svg
                      className="mt-1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#fbc02d"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#e53935"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4caf50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1565c0"
                        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                    <span className="ml-2">Continue with Google</span>
                  </div>
                </button>
              </div>
              {/* Signup Page */}
              <div className="mt-5">
                <Link to="/signup">
                  <button className="item-center hover:bg-blue-700 hover:text-white font-bold text-black w-full py-2 px-4 rounded-3xl outline outline-2">
                    New User! Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="hidden lg:block">
          <div className=" login-bg mt-52 mx-0 border-l-2 h-96"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
