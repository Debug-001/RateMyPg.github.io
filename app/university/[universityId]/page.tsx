'use client'; 
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase"; 
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
interface University {
  id: string;
  name: string;
  address: string;
  imageURL?: string; 
}

const UniversityDetailsPage = ({ params }) => { 
  const [university, setUniversity] = useState<University | null>(null);
  const [pgs, setPgs] = useState([]);
  const { universityId } = params;

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!universityId) return; 

      try {
        const universityDoc = doc(db, "universities", universityId);
        const universitySnapshot = await getDoc(universityDoc);

        if (universitySnapshot.exists()) {
          setUniversity({ id: universitySnapshot.id, ...universitySnapshot.data() } as University);

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
      }
    };

    fetchUniversityData();
  }, [universityId]); 

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>{university?.name || "University Not Found"}</h1>
        <p>{university?.address || "No Address Available"}</p>
        {university?.imageURL ? (
          <img
            src={university.imageURL}
            alt={university.name}
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
        ) : (
          <p>No image available</p>
        )}

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
