"use client";
import { useEffect, useState } from "react";
import { db } from "@/context/Firebase"; 
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext"; // Import your Auth context

const AdminPage = () => {
  const { user, loading } = useAuth(); // Get user and loading state from Auth context
  const [universityName, setUniversityName] = useState("");
  const [universityAddress, setUniversityAddress] = useState("");
  const [universityImageUrl, setUniversityImageUrl] = useState("");

  const [pgName, setPgName] = useState("");
  const [pgLocation, setPgLocation] = useState("");
  const [pgOwner, setPgOwner] = useState("");
  const [pgComments, setPgComments] = useState("");
  
  const [universities, setUniversities] = useState([]); // State to hold universities
  const [selectedUniversityId, setSelectedUniversityId] = useState(""); // State for selected university ID

  // Fetch universities on component mount
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

  const handleAddUniversity = async () => {
    if (universityName && universityAddress && universityImageUrl) {
      try {
        await addDoc(collection(db, "universities"), {
          name: universityName,
          address: universityAddress,
          imageUrl: universityImageUrl,
        });
        // Clear input fields
        setUniversityName("");
        setUniversityAddress("");
        setUniversityImageUrl("");
        alert("University added successfully!");
      } catch (error) {
        console.error("Error adding university: ", error);
      }
    } else {
      alert("Please fill in all fields for the university.");
    }
  };

  const handleAddPg = async () => {
    if (pgName && pgLocation && pgOwner && pgComments && selectedUniversityId) {
      try {
        await addDoc(collection(db, "pgs"), {
          name: pgName,
          location: pgLocation,
          owner: pgOwner,
          comments: pgComments,
          universityId: selectedUniversityId, // Include university ID
        });
        // Clear input fields
        setPgName("");
        setPgLocation("");
        setPgOwner("");
        setPgComments("");
        setSelectedUniversityId(""); // Clear selected university
        alert("PG added successfully!");
      } catch (error) {
        console.error("Error adding PG: ", error);
      }
    } else {
      alert("Please fill in all fields for the PG.");
    }
  };

  // Redirect to a different page if the user is not admin or loading
  useEffect(() => {
    if (!loading && user?.email !== "ombhatt1158@gmail.com") {
      // Redirect or display a message
      window.location.href = "/"; // Redirect to home or another page
    }
  }, [loading, user]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

        <h2 className="text-xl mb-2">Add University</h2>
        <input
          type="text"
          placeholder="University Name"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          className="block mb-2"
        />
        <input
          type="text"
          placeholder="University Address"
          value={universityAddress}
          onChange={(e) => setUniversityAddress(e.target.value)}
          className="block mb-2"
        />
        <input
          type="text"
          placeholder="University Image URL"
          value={universityImageUrl}
          onChange={(e) => setUniversityImageUrl(e.target.value)}
          className="block mb-2"
        />
        <button onClick={handleAddUniversity} className="bg-blue-500 text-white p-2 rounded">
          Add University
        </button>

        <h2 className="text-xl mb-2 mt-8">Add PG</h2>
        
        <select
          value={selectedUniversityId}
          onChange={(e) => setSelectedUniversityId(e.target.value)}
          className="block mb-2"
          required
        >
          <option value="">Select University</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="PG Name"
          value={pgName}
          onChange={(e) => setPgName(e.target.value)}
          className="block mb-2"
        />
        <input
          type="text"
          placeholder="PG Location"
          value={pgLocation}
          onChange={(e) => setPgLocation(e.target.value)}
          className="block mb-2"
        />
        <input
          type="text"
          placeholder="PG Owner"
          value={pgOwner}
          onChange={(e) => setPgOwner(e.target.value)}
          className="block mb-2"
        />
        <textarea
          placeholder="PG Comments"
          value={pgComments}
          onChange={(e) => setPgComments(e.target.value)}
          className="block mb-2"
        />
        <button onClick={handleAddPg} className="bg-blue-500 text-white p-2 rounded">
          Add PG
        </button>
      </div>
      <Footer />
    </>
  );
};

export default AdminPage;
