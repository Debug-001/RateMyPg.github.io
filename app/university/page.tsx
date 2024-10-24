"use client";
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const UniversityPage = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universitiesCollection = collection(db, "universities");
        const universitiesSnapshot = await getDocs(universitiesCollection);
        const universitiesList = universitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUniversities(universitiesList);
      } catch (error) {
        console.error("Error fetching universities: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  if (loading) {
    return null;
  }
  return (
    <>
      <Navbar />
      <div
        className="container-fluid top-section"
        style={{
          backgroundImage: `url('/search-bg.png')`,
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
          className="container d-flex flex-column justify-content-center align-items-center h-100"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h1 className="display-4 text-white fw-bolder text-center">
            <span className="text-info">University </span> Catalogue
          </h1>
        </div>
      </div>

      <div className="mid-section pb-5 pt-5">
        <div className="d-flex flex-column mx-5">
          <h2 className="fs-1 font-bold fw">List of Universities</h2>
          <hr className="h1-hr" />
        </div>
        {universities.length === 0 ? (
          <div>No universities found.</div>
        ) : (
          <ul className="d-flex gap-5 px-5 pt-4">
            {universities.map((university) => (
              <li key={university.id} className="mb-4">
                <Link href={`/university/${university.id}`} passHref>
                  <p
                    className="fw-bolder uni-name fs-5 text-black"
                    style={{ cursor: "pointer" }}
                  >
                    {university.name || "No Name Provided"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UniversityPage;
