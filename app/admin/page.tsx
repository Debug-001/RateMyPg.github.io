"use client";
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const AdminPage = () => {
  const { user, loading } = useAuth();
  const [universityName, setUniversityName] = useState("");
  const [universityAddress, setUniversityAddress] = useState("");
  const [universityImageUrl, setUniversityImageUrl] = useState("");

  const [pgName, setPgName] = useState("");
  const [pgLocation, setPgLocation] = useState("");
  const [pgOwner, setPgOwner] = useState("");
  const [pgComments, setPgComments] = useState("");

  const [universities, setUniversities] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");

  const notifySuccess = () => toast.success("Added successfully");
  const notifyError = () => toast.error("Failed to add, error!");
  const notifyExists = (type) =>
    toast.error(`${type} already exists. Please search.`);

  useEffect(() => {
    const fetchUniversities = async () => {
      const universitiesCollection = collection(db, "universities");
      const universitiesSnapshot = await getDocs(universitiesCollection);
      const universitiesList = universitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUniversities(universitiesList);
    };

    fetchUniversities();
  }, []);

  const checkUniversityExists = async (name) => {
    const q = query(collection(db, "universities"), where("name", "==", name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkPgExists = async (universityId, name) => {
    const universityRef = doc(db, "universities", universityId);
    const q = query(
      collection(universityRef, "pgs"),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleAddUniversity = async () => {
    if (universityName && universityAddress && universityImageUrl) {
      try {
        const exists = await checkUniversityExists(universityName);
        if (exists) {
          notifyExists("University");
          return;
        }

        const docRef = await addDoc(collection(db, "universities"), {
          name: universityName,
          address: universityAddress,
          imageUrl: universityImageUrl,
        });

        const newUniversity = {
          id: docRef.id,
          name: universityName,
          address: universityAddress,
          imageUrl: universityImageUrl,
        };

        setUniversities((prevUniversities) => [
          ...prevUniversities,
          newUniversity,
        ]);

        setUniversityName("");
        setUniversityAddress("");
        setUniversityImageUrl("");
        notifySuccess();
      } catch (error) {
        notifyError();
        console.error("Error adding university: ", error);
      }
    } else {
      toast.error("Please fill in all fields for the university.");
    }
  };

  const handleAddPg = async () => {
    if (pgName && pgLocation && pgOwner && pgComments && selectedUniversityId) {
      try {
        const exists = await checkPgExists(selectedUniversityId, pgName);
        if (exists) {
          notifyExists("PG");
          return;
        }

        const universityRef = doc(db, "universities", selectedUniversityId);
        await addDoc(collection(universityRef, "pgs"), {
          name: pgName,
          location: pgLocation,
          owner: pgOwner,
          comments: pgComments,
        });

        setPgName("");
        setPgLocation("");
        setPgOwner("");
        setPgComments("");
        setSelectedUniversityId("");
        notifySuccess();
      } catch (error) {
        notifyError();
        console.error("Error adding PG: ", error);
      }
    } else {
      toast.error("Please fill in all fields for the PG.");
    }
  };

  useEffect(() => {
    if (!loading && user?.email !== "ombhatt1158@gmail.com") {
      window.location.href = "/";
    }
  }, [loading, user]);

  return (
    <>
      <Navbar />
      <div className="container-fluid mx-auto px-4 py-8 mid-section">
        <div className="text-container d-flex flex-column justify-content-center align-items-center">
          <h1 className="fs-1 fw-bold  mt-5 text-center">
            Admin Control
            <span className="text-primary"> Panel</span>
          </h1>
          <hr className="h1-hr" />
        </div>
        <div className="container mt-5  pb-5 pt-5">
          <h2 className="fs-3 mb-2">Add University</h2>
          <div className="d-flex flex-column justify-content-center gap-3  w-50">
            <div className="input-group">
              <input
                type="text"
                placeholder="University Name"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                className="form-control"
                aria-label="University Name"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="University Address"
                value={universityAddress}
                onChange={(e) => setUniversityAddress(e.target.value)}
                className="form-control"
                aria-label="University Address"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="University Image URL"
                value={universityImageUrl}
                onChange={(e) => setUniversityImageUrl(e.target.value)}
                className="form-control"
                aria-label="University Image URL"
              />
            </div>
            <button
              onClick={handleAddUniversity}
              className="btn-custom w-25 text-white p-2 rounded"
            >
              Add University
            </button>
          </div>
          <div className="d-flex gap-4 flex-column pt-5">
          <h2 className="fs-3 mb-2 mt-8">Add PG's near your University</h2>
          <div className="dropdown">
            <button
              className="btn-custom dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedUniversityId
                ? universities.find(
                    (university) => university.id === selectedUniversityId
                  )?.name || "Select University"
                : "Select University"}
            </button>
            <ul className="dropdown-menu">
              {universities.map((university) => (
                <li key={university.id}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => setSelectedUniversityId(university.id)}
                  >
                    {university.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="d-flex flex-column gap-3 w-50">
            <div className="input-group">
              <input
                type="text"
                placeholder="PG Name"
                value={pgName}
                onChange={(e) => setPgName(e.target.value)}
                className="form-control"
                aria-label="PG Name"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="PG Location"
                value={pgLocation}
                onChange={(e) => setPgLocation(e.target.value)}
                className="form-control"
                aria-label="PG Location"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="PG Owner"
                value={pgOwner}
                onChange={(e) => setPgOwner(e.target.value)}
                className="form-control"
                aria-label="PG Owner"
              />
            </div>
            <button
              onClick={handleAddPg}
              className="btn-custom w-25 text-white p-2 rounded"
            >
              Add PG
            </button>
          </div>
          </div>
        </div>
      </div>
      <Toaster />
      <Footer />
    </>
  );
};

export default AdminPage;
