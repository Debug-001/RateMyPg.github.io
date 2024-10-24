"use client";
import logo from "../assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { auth } from "../context/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import Button from "./Button";
import Link from "next/link";

export const Navbar = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.replace("/profile");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  if (loading) {
    return null;
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
          {/* <hr className="h1-hr" /> */}
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
            <button
              type="button"
              className="btn-custom"
              onClick={() => setShowModal(true)}
            >
              Sign In
            </button>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
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
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => auth.signOut()}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Sign in
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <button className="btn btn-primary" onClick={googleLogin}>
                  Login with Google
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
