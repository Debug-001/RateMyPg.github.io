"use client";
import logo from "../assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { auth } from "../context/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";

export const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.replace("/");
        toast.success("Logged in Successfully");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("Log In failed");
    }
  };

  const logout = () => {
    auth.signOut();
    toast.success("Log Out Success");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src={logo} alt="logo" width={45} height={45} />
          <span className="ms-2 fs-4 fw-bold">Rate My <span className="text-primary">Pg.com</span></span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            <li className="nav-item">
              <Link href="/university" className="nav-link text-black fs-5 hover-underline-animation">
                Student Pg
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/forums" className="nav-link text-black fs-5 hover-underline-animation">
                Forums
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/gc" className="nav-link text-black fs-5 hover-underline-animation">
                Global Chat
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/adduni" className="nav-link text-black fs-5 hover-underline-animation">
                 University
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/aboutus" className="nav-link text-black fs-5 hover-underline-animation">
                About Us
              </Link>
            </li>
          </ul>

          {!user ? (
            <button
              className="btn-custom  d-flex align-items-center m-2 gap-1"
              onClick={googleLogin}
            >
              <FcGoogle className="mx-1" size={20} /> Sign In
            </button>
          ) : (
            <div className="dropdown">
              <button
                className="btn-custom dropdown-toggle mx-3"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.displayName}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => router.replace("/profile")}
                  >
                    Profile
                  </button>
                </li>
                <div className="dropdown-divider" />
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </nav>
  );
};
