import { useRef, useState, useEffect } from "react";
import Header from "./Header";
import { CheckValidateData, CheckValidateData1 } from "../utils/Validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR } from "../utils/constant";


const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(() => {
    const saved = sessionStorage.getItem("isSignInForm");
    return saved === null ? true : JSON.parse(saved);
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    let message = null;
    if (isSignInForm) {
      message = CheckValidateData(emailRef.current.value, passwordRef.current.value);
    } else {
      message = CheckValidateData1(nameRef.current.value, emailRef.current.value, passwordRef.current.value);
      if (!confirmPassword || passwordRef.current.value !== confirmPassword) {
        message = "Passwords do not match";
      }
    }
    setErrorMessage(message);
    if (message) return;

    try {
      if (isSignInForm) {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailRef.current.value,
          passwordRef.current.value
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: nameRef.current?.value || "",
          photoURL: USER_AVATAR,
        });
        // Optionally, dispatch user info here if needed
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailRef.current.value,
          passwordRef.current.value
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: nameRef.current.value,
          photoURL: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
        });
        const { uid, email, displayName, photoURL } = auth.currentUser;
        dispatch(
          addUser({
            uid,
            email,
            displayName,
            photoURL,
          })
        );
      }
    } catch (error) {
      if (!isSignInForm && error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use");
      } else if (isSignInForm && error.code === "auth/invalid-credential") {
        setErrorMessage("Email or Password entered is incorrect. Please check your email or Password.");
      } else {
        setErrorMessage(error.code ? error.code + " " + error.message : error.message);
      }
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm((prev) => {
      sessionStorage.setItem("isSignInForm", JSON.stringify(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    sessionStorage.setItem("isSignInForm", JSON.stringify(isSignInForm));
  }, [isSignInForm]);

  return (
    <div>
      <Header />
      <div className="w-screen absolute">
        <img
          className="w-full h-screen object-cover object-center sm:object-top md:object-center lg:object-cover xl:object-cover 2xl:object-cover no-scrollbar"
          alt="background"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be66-427c-8b72-5cb39d275279/94eb5ad7-10d8-4cca-bf45-ac52e0a052c0/IN-en-20240226-popsignuptwoweeks-perspective_alpha_website_large.jpg"
        />
      </div>
      <form
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-lg absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            ref={nameRef}
            type="text"
            placeholder="Full Name"
            className="p-4 my-4 w-full bg-gray-700 "
            autoComplete="off"
          />
        )}
        <input
          ref={emailRef}
          type="text"
          placeholder="Email Address"
          className="p-4 my-4 w-full bg-gray-700 "
          autoComplete="off"
        />
        <div className="relative">
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-4 my-4 w-full bg-gray-700 pr-12"
            autoComplete="off"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.273 7.355 19.5 12 19.5c1.658 0 3.237-.335 4.646-.94M21.065 12.001a10.477 10.477 0 00-2.045-3.778M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25-4.03 8.25-9 8.25-9-3.694-9-8.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {!isSignInForm && (
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="p-4 my-4 w-full bg-gray-700 pr-12"
              autoComplete="off"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.273 7.355 19.5 12 19.5c1.658 0 3.237-.335 4.646-.94M21.065 12.001a10.477 10.477 0 00-2.045-3.778M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25-4.03 8.25-9 8.25-9-3.694-9-8.25z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        )}
        <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>
        <button
          type="button"
          onClick={handleAuth}
          className="p-4 my-4 bg-red-700 w-full  rounded-lg"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to Netflix? Sign Up Now"
            : "Already Registered? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
