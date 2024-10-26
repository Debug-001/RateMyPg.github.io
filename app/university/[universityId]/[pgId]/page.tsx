"use client";
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TbPhotoPlus } from "react-icons/tb";
import NavAddress from "@/components/NavAddress";

interface University {
  id: string;
  name: string;
  address: string;
}

const PgDetailsPage = ({ params }) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [pg, setPg] = useState(null);
  const { universityId, pgId } = params;

  useEffect(() => {
    const fetchPgData = async () => {
      if (!universityId || !pgId) return;

      try {
        const universityDoc = doc(db, "universities", universityId);
        const universitySnapshot = await getDoc(universityDoc);

        if (universitySnapshot.exists()) {
          setUniversity({
            id: universitySnapshot.id,
            ...universitySnapshot.data(),
          } as University);
        }
        const pgDoc = doc(db, "universities", universityId, "pgs", pgId);
        const pgSnapshot = await getDoc(pgDoc);

        if (pgSnapshot.exists()) {
          setPg({
            id: pgSnapshot.id,
            ...pgSnapshot.data(),
          });
        } else {
          console.error("PG not found");
        }
      } catch (error) {
        console.error("Error fetching PG data: ", error);
      }
    };

    fetchPgData();
  }, [universityId, pgId]);

  if (!pg) return null;

  const handleAddPhotos = () => {
    console.log("Load images from users");
  };

  return (
    <>
      <Navbar />
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
            {pg?.name || "PG Not Found"}
          </h1>
          <p className="text-white fw fs-4">
            {" "}
            {university?.name || "University Not Found"}
          </p>
          <p>Ratings</p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            zIndex: 2,
          }}
        >
          <button
            className="btn-photo d-flex align-items-center"
            onClick={handleAddPhotos}
          >
            <TbPhotoPlus className="mx-1" size={20} /> Add Photos
          </button>
        </div>
      </div>
      <div className="container">
        <NavAddress/>
        <div className="d-flex flex-column ">
          <h1 className="fs-1 fw-bold mt-5">
            Pg
            <span className="px-1 text-primary"> Details</span>
          </h1>
          <hr className="h1-hr" />
        </div>
        <div className="card mb-3">
          {/* <Image
            src={`url('./bg.png')`}
            className="card-img-top"
            width={50}
            height={50}
            alt="..."
          /> */}
          <div className="card-body">
            <h5 className="card-title"> {pg?.name || "PG Not Found"}</h5>
            <p className="card-text">
              <small className="text-body-secondary">
                {pg.location || "Not provided"}
              </small>
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{pg.contact || "Not provided"}</li>
          </ul>
          <div className="card-body">
            <a href="#" className="card-link">
              Add a Comment
            </a>
            <a href="#" className="card-link">
              Browse Comments
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PgDetailsPage;
