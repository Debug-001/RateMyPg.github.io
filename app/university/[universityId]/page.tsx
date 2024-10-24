'use client'; // Ensure this is the first line in your component

import { useEffect, useState } from "react";
import { db } from "@/context/Firebase"; // Your Firebase config
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const UniversityDetailsPage = ({ params }) => { // Destructure params to get universityId
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pgs, setPgs] = useState([]);

  const { universityId } = params; // Directly get universityId from params

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!universityId) return; // Check if universityId is defined

      try {
        const universityDoc = doc(db, "universities", universityId); // Fetch university document
        const universitySnapshot = await getDoc(universityDoc);

        if (universitySnapshot.exists()) {
          setUniversity({ id: universitySnapshot.id, ...universitySnapshot.data() });

          // Fetch PGs from the subcollection
          const pgsCollection = collection(universityDoc, "pgs");
          const pgsSnapshot = await getDocs(pgsCollection);
          const pgsList = pgsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPgs(pgsList);
        } else {
          console.error("University not found");
        }
      } catch (error) {
        console.error("Error fetching university data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId]); // Dependency on universityId

  if (loading) return <p>Loading...</p>;
  if (!university) return <p>No university found.</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>{university.name}</h1>
        <p>{university.address}</p>
        {university.imageURL && (
          <img
            src={university.imageURL}
            alt={university.name}
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
        )}
        {!university.imageURL && <p>No image available</p>}

        <h2>PGs:</h2>
        {pgs.length === 0 ? (
          <p>No PGs available for this university.</p>
        ) : (
          <ul>
            {pgs.map((pg) => (
              <li key={pg.id}>{pg.name || "No Name Provided"}</li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UniversityDetailsPage;
