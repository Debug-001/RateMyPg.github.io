"use client";
import logo from "../assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { auth } from "../context/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";


export const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth(); // Removed loading state
  const [showModal, setShowModal] = useState(false);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.replace("/");
        toast.success('Logged in Succesfully')
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error('Log In failed')
    }
  };

  function logout(){
    toast.success('Log Out Success')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white">
      <div className="container-fluid">
        <Image
          src={logo}
          alt="logo"
          className="logo-img"
          width={45}
          height={45}
        />
        <li className="nav-item px-4 d-flex flex-column justify-content-center align-items-center">
          <a
            className="nav-link active fs-2 fw-bolder d-none d-md-block d-lg-block"
            aria-current="page"
            href="/"
          >
            R a t e My <span className="text-primary">Pg.com</span>
          </a>
        </li>
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
        <div
          className="collapse navbar-collapse d-flex justify-content-between align-items-center"
          id="navbarNav"
        >
          <ul className="navbar-nav d-flex justify-content-center gap-4 fs-5">
            <li className="nav-item hover-underline-animation">
              <Link href="/forums" className="text-black nav-link">
                Forums
              </Link>
            </li>
            <li className="nav-item hover-underline-animation">
              <Link href="/university" className="text-black nav-link">
                Pg's
              </Link>
            </li>
            <li className="nav-item hover-underline-animation">
              <Link href="/gc" className="text-black nav-link">
                Global Chat
              </Link>
            </li>
            <li className="nav-item hover-underline-animation">
              <Link href="/adduni" className="text-black nav-link">
                Add University
              </Link>
            </li>
            <li className="nav-item hover-underline-animation">
              <Link href="/aboutus" className="text-black nav-link">
                About Us
              </Link>
            </li>
          </ul>

          {!user ? (
             <button className="btn-custom d-flex align-items-center m-2 gap-1" onClick={googleLogin}>
             <FcGoogle size={20}/>Sign In with Google
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
                <div className="dropdown-divider"/>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => auth.signOut() && logout()}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <Toaster/>
    </nav>
  );
};
