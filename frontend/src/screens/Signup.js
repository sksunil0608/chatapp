import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate()
  const apiURL = process.env.REACT_APP_BASE_URL;

  const [signupDetails, setSignupDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSignupDetails((prevDetails) => {
      return { ...prevDetails, [name]: value }
    })
  }



  //Api calling here
  const handleUserSignup = async () => {
    try {
      const response = await axios.post(`${apiURL}/signup`, signupDetails);

      if (response.status === 201) {
        // Successful signup
        navigate('/login')
      } else if (response.status === 204) {
        setErrorMessage("Bad Parameters, Please fill all the details carefully!")
      }
      else {
        // User already exist
        setErrorMessage("Something Weired happend")
      }
    } catch (error) {
      // Handle network or other errors
      if (error && error.response.status === 409) {
        setErrorMessage("User already Exist")
      }else if (error.response.status===400){
        setErrorMessage("Please Fill all the details")
      }
      else {
        setErrorMessage("Network Error")
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="lg:bg-gray-200 ">
        <div className=" p-4">
          <h1 className="text-5xl font-thin text-center">
            Welcome to VChat Instant Messaging
          </h1>
          <div className=" mt-10 bg-white max-w-md lg:max-w-screen-lg mx-auto border-2 border-black border-opacity-20 rounded-lg p-4 lg:p-8">
            <form className="" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                {/* set Error Message Area */}
                <div className=" col-span-2 lg:col-span-2 text-red-500 text-start">
                  {errorMessage && <p>{errorMessage}</p>}
                </div>
                {/* First Name */}
                <div className="col-span-2 lg:col-span-1">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="fname"
                    >
                      First Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3"
                      id="fname"
                      type="text"
                      name="fname"
                      placeholder="First Name"
                      value={signupDetails.fname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {/* Last Name */}
                <div className="col-span-2 lg:col-span-1">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="lname"
                    >
                      Last Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3"
                      id="lname"
                      type="text"
                      name="lname"
                      placeholder="Last Name"
                      value={signupDetails.lname}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="col-span-2">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3"
                      id="email"
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={signupDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {/* Phone */}
                <div className="col-span-2">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="phone"
                    >
                      Phone
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3"
                      id="phone"
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      value={signupDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {/* Password */}
                <div className="col-span-2 lg:col-span-1">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="shadow appearance-none border border-red-300 rounded w-full py-2 px-3"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="******************"
                      value={signupDetails.password}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-yellow-500 text-xs italic">
                      Please Enter Your Password.
                    </p>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="col-span-2 lg:col-span-1">
                  <div className="">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="confirm_password"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="shadow appearance-none border border-red-300 rounded w-full py-2 px-3"
                      id="confirm_password"
                      type="password"
                      name="confirm_password"
                      placeholder="******************"
                      value={signupDetails.confirm_password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mx-auto">
                <button
                  className="mt-6 bg-orange-500 hover:bg-blue-700 hover:text-white font-bold text-white w-full py-3 lg:py-2 px-4 rounded-3xl"
                  type="submit"
                  onClick={handleUserSignup}
                >
                  Sign Up
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
              <p className="text-xs text-center">
                By clicking Continue, you agree to Our User Agreement, Privacy
                Policy, and Cookie Policy.
              </p>
              <button
                className="mt-6 flex items-center hover:bg-blue-700 hover:text-white  text-black w-full py-2 px-4 rounded-3xl outline outline-2"
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
            {/* Login Page */}
            <div className="mt-5">
              <Link to="/login">
                <button className="item-center hover:bg-blue-700 hover:text-white font-bold text-black w-full py-2 px-4 rounded-3xl outline outline-2">
                  Already a User! Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
