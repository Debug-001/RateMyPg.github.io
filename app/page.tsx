"use client";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import headlogo1 from "../assets/header-logo1.png";
import headlogo2 from "../assets/header-logo2.png";
import christ from "../assets/christ.jpg";
import pesu from "../assets/pesu.jpg";
import rvce from "../assets/rvce.jpg";
import { CgProfile } from "react-icons/cg";
import { Fade } from "react-awesome-reveal";
import SearchBar from "@/components/SearchBar";
import { db } from "@/context/Firebase";
import Button from "@/components/Button";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { FaQuestionCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { IoMdHeartEmpty } from "react-icons/io";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  userId: string;
  displayName: string;
  profileImage: string;
  university: string;
  likes: string[];
}

interface University {
  id: string;
  name: string;
  address: string;
}
interface PG {
  universityId: any;
  id: string;
  name: string;
  location: string;
  contact: string;
}

const page = ({ params }) => {
  const { user, loading: authLoading } = useAuth();
  const [topPosts, setTopPosts] = useState([]);
  const [pgs, setPgs] = useState<PG[]>([]);
  const [university, setUniversity] = useState<University | null>(null);
  const { universityId } = params;
  const [posts, setPosts] = useState<ForumPost[]>([]);

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!universityId) return;

      try {
        const universityDoc = doc(db, "universities", universityId);
        const universitySnapshot = await getDoc(universityDoc);

        if (universitySnapshot.exists()) {
          setUniversity({
            id: universitySnapshot.id,
            ...universitySnapshot.data(),
          } as University);

          const pgsCollection = collection(universityDoc, "pgs");
          const pgsSnapshot = await getDocs(pgsCollection);
          const pgsList = pgsSnapshot.docs.map((doc) => ({
            id: doc.id,
            universityId,
            ...doc.data(),
          })) as unknown as PG[];
          setPgs(pgsList);
        } else {
          console.error("University not found");
        }
      } catch (error) {
        console.error("Error fetching university data: ", error);
      }
    };

    fetchUniversityData();
  }, [universityId]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("likes", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopPosts(posts);
      } catch (error) {
        console.error("Error fetching top posts: ", error);
      }
    };

    fetchTopPosts();
  }, []);

  useEffect(() => {
    const fetchPGs = async () => {
      const universitiesCollection = collection(db, "universities");
      const universityDocs = await getDocs(universitiesCollection);
      const allPGs = [];

      const fetchAllPGsPromises = universityDocs.docs.map(
        async (universityDoc) => {
          const pgsCollection = collection(
            db,
            `universities/${universityDoc.id}/pgs`
          );
          const pgDocs = await getDocs(pgsCollection);

          pgDocs.forEach((pgDoc) => {
            allPGs.push({
              id: pgDoc.id,
              universityId: universityDoc.id,
              ...pgDoc.data(),
            });
          });
        }
      );

      await Promise.all(fetchAllPGsPromises);
      setPgs(allPGs);
    };

    fetchPGs();
  }, []);

  const checkUserAuthenticated = () => {
    if (!user) {
      toast.error("Please sign in first.");
      return false;
    }
    return true;
  };

  const handlePostLike = async (postId: string) => {
    if (!checkUserAuthenticated()) return;

    const postRef = doc(db, "posts", postId);
    const selectedPost = posts.find((post) => post.id === postId);
    const isLiked = selectedPost?.likes.includes(user.uid);
    const updatedLikes = isLiked
      ? selectedPost?.likes.filter((id) => id !== user.uid)
      : [...(selectedPost?.likes || []), user.uid];

    try {
      await updateDoc(postRef, { likes: updatedLikes });
      if (user) {
        toast.success(isLiked ? "Like removed" : "Liked!");
      } else {
        toast.error("Login First");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
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
          <SearchBar />
        </div>
      </div>
      {/* dorm intro section  */}
      <div className="container-fluid mid-section p-4 p-md-5 mt-4">
        <div className="row d-flex justify-content-center align-items-center pb-4">
          <div className="col-12 col-md-6 col-lg-4 text-center text-md-start mb-4 mb-md-0">
            <Fade direction="right" triggerOnce>
              <h2 className="display-6 fw-bold">Find your University</h2>
              <p className="text-secondary fs-5">
                We've collected PG reviews from over 1500+ North/South Indian
                dorms. Search for your university to get started.
              </p>
            </Fade>
          </div>
          <div className="col-12 col-md-6 col-lg-4 text-center">
            <Image
              src={headlogo1}
              width={400}
              height={250}
              alt="header-img"
              className="img-fluid"
            />
          </div>
        </div>

        <div className="row pt-4 d-flex justify-content-center align-items-center pb-4">
          <div className="col-12 col-md-6 col-lg-4 text-center text-md-start mb-4 mb-md-0">
            <Image
              src={headlogo2}
              width={400}
              height={250}
              alt="header-img"
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4 text-center text-md-start">
            <Fade direction="left" triggerOnce>
              <h2 className="display-6 fw-bold">Anonymous PG Reviews</h2>
              <p className="text-secondary fs-5">
                Let every student know about your PG experience! Your review
                will be anonymous, and your feedback will guide future
                improvements.
              </p>
            </Fade>
          </div>
        </div>
      </div>
      {/* dorm browse section */}
      <div className="container-fluid mid-section pb-5 h-100 d-flex flex-column align-items-center">
        <div className="text-container d-flex flex-column justify-content-center align-items-center text-center">
          <h2 className="display-5 fs-1 fw-bold pt-5">
            Browse the best <span className="text-primary">Student PG's</span>{" "}
            in your Area
          </h2>
          <hr className="h1-hr" />
        </div>
        <div className="pt-5">
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-start gap-3">
            {/* Column for the PG Cards */}
            <div className="col-12 col-md-8">
              <div className="row row-cols-1 row-cols-md-3 g-3">
                {" "}
                {/* Changed row-cols-md-2 to row-cols-md-3 */}
                {pgs.map((pg) => (
                  <div className="col" key={pg.id}>
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{pg.name}</h5>
                        <p className="card-text">{pg.location}</p>
                        <Link
                          href={`/university/${pg.universityId}/${pg.id}`}
                          passHref
                        >
                          <button className="btn btn-primary">Explore</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
          <h1 className="fs-1 fw-bold mt-5 text-center">
            Live from <span className="text-primary">Student Forums</span>
          </h1>
          <hr className="h1-hr" />
        </div>
        <div className="row pt-3">
          {topPosts.length > 0 ? (
            <div className="accordion w-100" id="accordionExample">
              {topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="accordion-item shadow rounded mt-5"
                >
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="true"
                      aria-controls={`collapse${index}`}
                    >
                      <img
                        src={post.profileImage}
                        alt={post.displayName}
                        className="rounded-circle"
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "10px",
                        }}
                      />
                      {post.title}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p className="bg-dark p-3 rounded text-white">
                        {post.content || "No content available."}
                      </p>
                      <div className="d-flex justify-content-end align-items-center flex-row gap-2">
                        <span
                          onClick={() => handlePostLike(post.id)}
                          className={`icon-container me-2`}
                        >
                          <IoMdHeartEmpty size={25}
                            className={`icon ${
                              post.likes.includes(user?.uid)
                                ? "icons-like"
                                : "icons-liked"
                            }`}
                          />
                          {post.likes.length}
                        </span>

                        <Link href="/forums">
                          <button className="btn btn-primary">Read More</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default page;
