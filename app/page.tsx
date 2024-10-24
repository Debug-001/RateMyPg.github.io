'use client'
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import headlogo1 from "../assets/header-logo1.png";
import headlogo2 from "../assets/header-logo2.png";
import christ from "../assets/christ.jpg";
import pesu from "../assets/pesu.jpg";
import rvce from "../assets/rvce.jpg";
import { CgProfile } from "react-icons/cg";
import { Fade } from "react-awesome-reveal";

const page = () => {
  return (
    <>
      <Navbar />
      {/* search bar section  */}
      <div
        className="container-fluid top-section"
        style={{
          backgroundImage: `url('/bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          height: "60vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <div
          className="container p-5 d-flex flex-column justify-content-center align-items-center"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h1 className="display-4 pt-5 text-white fw-bolder">
            Explore the world of <span className="text-info">PG's </span>
            and <span className="text-warning">Dorms </span>near your University
          </h1>
          <div className="input-group pt-4 mb-3 w-75">
            <input
              type="text"
              className="form-control"
              placeholder="Hit up your University name..."
              aria-label="search"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-secondary"
              type="button"
              id="button-addon2"
            >
              Search
            </button>
          </div>
          <Link href="/all">
            <p className="search-bar-text text-white">All Universities</p>
          </Link>
        </div>
      </div>
      {/* dorm intro section  */}
      <div className="container-fluid mid-section p-5 mt-4">
        <div className="row  d-flex  justify-content-center align-items-center pb-5">
          <div className="col-6 col-md-4">
          <Fade direction="right" triggerOnce>
            <h2 className="display-6 fw-bold">Find your University</h2>
            <p className="text-secondary fs-5">
              We've collected Pg reviews from over 1500+ North/South Indian
              Dorms. Search for your university to get started.
            </p>
          </Fade>
          </div>
          <div className="col-6 col-md-4">
          {/* <Fade direction="left" triggerOnce> */}
            <Image src={headlogo1} width={500} height={300} alt="header-img" />
            {/* </Fade> */}
          </div>
        </div>
        <div className="row pt-4  d-flex  justify-content-center align-items-center pb-5">
          <div className="col-6 col-md-4 mx-5">
          {/* <Fade direction="up" triggerOnce> */}
            <Image src={headlogo2} width={400} height={300} alt="header-img" />
            {/* </Fade> */}
          </div>
          <div className="col-6 col-md-4">
          <Fade direction="left" triggerOnce>
            <h2 className="display-6 fw-bold">Anonymous PG Reviews</h2>
            <p className="text-secondary fs-5">
              Let every student know about your PG experience! Your review will
              be anonymous, and your feedback will guide future improvements.
            </p>
            </Fade>

          </div>
        </div>
      </div>
      {/* dorm browse section */}
      <div className="container-fluid mid-section pb-5 h-100 d-flex flex-column align-items-center">
        <div className="text-container d-flex flex-column justify-content-center align-items-center">
          <h2 className="display-5 fs-1 fw-bold text-center pt-5">
            Browse the best <span className="text-primary">Student PG's</span>{" "}
            in your Area
          </h2>
          <hr className="h1-hr" />
        </div>
        <div className="d-flex flex-column gap-5 pt-5">
          <div className="row">
            <div className="col-6 col-md-4">
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src="https://lh5.googleusercontent.com/p/AF1QipNFAXsE9gPW2o-oCn8sStkkOX_NIuDY5e282VmQ=w408-h288-k-no"
                  className="card-img-top"
                  alt="..."
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">New-Slv Stays Luxury Pg</h5>
                  <p className="card-text">
                    22, Christ Ln, near Christ University, krishna nagar,
                    Koramangala Industrial Layout, Koramangala, Bengaluru,
                    Karnataka 560029
                  </p>
                  <a href="/" className="btn-custom">
                    Explore
                  </a>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src="https://lh5.googleusercontent.com/p/AF1QipPD6K222piKZffNRh0IardP4xUBNJeFLj-0O2n0=w408-h544-k-no"
                  className="card-img-top"
                  alt="..."
                  style={{ width: "100%", height: "225px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    Panchavati sri Anjeneya Luxury pg
                  </h5>
                  <p className="card-text">
                    Veerabhadra Nagar, Banashankari 3rd Stage, Banashankari,
                    Bengaluru, Karnataka 560085
                  </p>
                  <a href="#" className="btn btn-secondary">
                    Explore
                  </a>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src="https://lh5.googleusercontent.com/p/AF1QipNmeGWv7Mta_rQ8DCVW_aYs5hwnXsDVJ4hTKd6x=w408-h464-k-no"
                  className="card-img-top"
                  alt="..."
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">ROYAL LUXURY PG FOR GENTS</h5>
                  <p className="card-text">
                    4, 80 Feet Rd, 1st phase Girinagar, Phase 2, Banashankari
                    1st Stage, Banashankari, Bengaluru, Karnataka 560085
                  </p>
                  <a href="#" className="btn btn-secondary">
                    Explore
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* university browse section  */}
      <div className="container-fluid mid-section p-5 d-flex flex-column">
        <div className="text-container d-flex flex-column justify-content-center align-items-center">
          <h1 className="fs-1 fw-bold  mt-5 text-center">
            Checkout Top
            <span className="text-primary"> Universities</span>
          </h1>
          <hr className="h1-hr" />
        </div>
        <div
          id="carouselExampleDark"
          className="carousel pt-5 carousel-dark slide"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide-to={0}
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide-to={1}
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleDark"
              data-bs-slide-to={2}
              aria-label="Slide 3"
            />
          </div>
          <div className="carousel-inner">
            <Link href="/">
              <div className="carousel-item active" data-bs-interval={10000}>
                <Image
                  src={pesu}
                  className="d-block w-100"
                  alt="First slide"
                  width={800}
                  height={400}
                  style={{ objectFit: "cover", height: "400px" }}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5 className="text-white fs-3">
                    Pes University, EC/RR Campus
                  </h5>
                  <p className="text-white fs-6">
                    Choose from some of the best PG's near PESU.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/">
              <div className="carousel-item" data-bs-interval={2000}>
                <Image
                  src={christ}
                  className="d-block w-100"
                  alt="Second slide"
                  width={800}
                  height={400}
                  style={{ objectFit: "cover", height: "400px" }}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5 className="text-white fs-3">
                    Christ University, Bangalore
                  </h5>
                  <p className="text-white fs-6">
                    Choose from some of the best PG's near ChristU.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/">
              <div className="carousel-item">
                <Image
                  src={rvce}
                  className="d-block w-100"
                  alt="Third slide"
                  width={800}
                  height={400}
                  style={{ objectFit: "cover", height: "400px" }}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5 className="text-white fs-3">RVCE, Bangalore</h5>
                  <p className="text-white fs-6">
                    Choose from some of the best PG's near RVCE.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* student forums q/a */}
      <div className="container pt-5 pb-5">
        <div className="text-container d-flex flex-column justify-content-center align-items-center">
          <h1 className="fs-1 fw-bold  mt-5 text-center">
            Live from the Student
            <span className="text-primary"> Forums</span>
          </h1>
          <hr className="h1-hr" />
        </div>
        <div
          className="accordion pt-5 d-flex flex-column gap-5"
          id="accordionPanelsStayOpenExample"
        >
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button fs-5"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Worst Pg's to stay away from Near PES RR campus
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <div className="d-flex gap-3 pb-3">
                  <CgProfile size={25} />
                  <h3 className="fs-4">XYZ Kumar</h3>
                </div>
                <strong>This is the first item's accordion body.</strong> It is
                shown by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control
                the overall appearance, as well as the showing and hiding via
                CSS transitions. You can modify any of this with custom CSS or
                overriding our default variables. It's also worth noting that
                just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fs-5"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Best Freshman Pg's near Christ Central Campus
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables. It's also worth
                noting that just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fs-5"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Best Freshman PG's near PESU EC Campus?
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse">
              <div className="accordion-body">
                <strong>This is the third item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element. These
                classes control the overall appearance, as well as the showing
                and hiding via CSS transitions. You can modify any of this with
                custom CSS or overriding our default variables.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fs-5"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Stay Away from Panchavati PG near PESU RR Campus.
              </button>
            </h2>
            <div id="collapseFour" className="accordion-collapse collapse">
              <div className="accordion-body">
                <strong>This is the fourth item's accordion body.</strong> It is
                hidden by default, until the collapse plugin adds the
                appropriate classes that we use to style each element.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
