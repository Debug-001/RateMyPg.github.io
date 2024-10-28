"use client";
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import NavAddress from "@/components/NavAddress";
import { CiLocationOn } from "react-icons/ci";
import Button from "@/components/Button";

interface University {
  id: string;
  name: string;
  address: string;
}

interface PG {
  imageUrl: any;
  id: string;
  name: string;
  location: string;
  contact: string;
}

const UniversityDetailsPage = ({ params }) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [pgs, setPgs] = useState<PG[]>([]);
  const { universityId } = params;

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
            ...doc.data(),
          })) as PG[];
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

  return (
    <>
      <Navbar />
      <div className="">
        <div
          className="container-fluid top-section"
          style={{
            backgroundImage: `url(/uni.png)`,
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
            className="container d-flex flex-column justify-content-center align-items-center"
            style={{ position: "relative", height: "100%", zIndex: 2 }}
          >
            <h1 className="display-4 text-white fw-bolder text-center">
              {university?.name || "University Not Found"}
            </h1>
          </div>
        </div>
        <div className="container pb-5">
          <NavAddress />
          <div className="text-container  d-flex flex-column ">
            <h1 className="fs-1 fw-bold  mt-5">
              Browse Pg's and Unfiltered
              <span className="text-primary"> Reviews</span>
            </h1>
            <hr className="h1-hr" />
          </div>
          {pgs.length === 0 ? (
            <p>No PGs available for this university.</p>
          ) : (
            <div className="d-flex flex-column gap-5 pt-5">
              <div className="row">
                {pgs.map((pg) => (
                  <div key={pg.id} className="col-6 col-md-4 mb-4">
                    <div
                      className="card shadow p-2"
                      style={{
                        width: "100%",
                        height: "400px", // Increased card height for more content space
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {pg?.imageUrl ? (
                        <img
                          src={pg.imageUrl}
                          alt={pg.name}
                          className="card-img-top"
                          style={{
                            height: "200px", // Fixed image height for uniformity
                            width: "100%",
                            objectFit: "cover",
                            borderRadius:"10px"
                          }}
                        />
                      ) : (
                        <div
                          className="card-img-top placeholder"
                          style={{
                            height: "200px",
                            width: "100%",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius:"10px"
                          }}
                        >
                          <span>No Image Available</span>
                        </div>
                      )}
                      <div
                        className="card-body"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          flexGrow: 1,
                        }}
                      >
                        <h5
                          className="card-title fs-3"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          {pg?.name || "PG Not Found"}
                        </h5>
                        <p className="card-text">
                          <small className="text-muted">
                            <CiLocationOn size={22} />{" "}
                            {pg.location || "Not provided"}
                          </small>
                        </p>
                        <Link href={`/university/${universityId}/${pg.id}`}>
                          <Button
                            className="btn-custom px-3 mt-2"
                            text="Explore"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UniversityDetailsPage;
