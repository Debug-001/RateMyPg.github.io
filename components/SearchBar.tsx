import Link from "next/link";

import { useEffect, useState } from "react";
import { db } from "@/context/Firebase";
import { collection, getDocs } from "firebase/firestore"; // Ensure correct imports

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const universitiesCollection = collection(db, "universities");
        const snapshot = await getDocs(universitiesCollection);
        const uniList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUniversities(uniList);
      } catch (error) {
        console.error("Error fetching universities: ", error);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    } else {
      setFilteredUniversities([]);
    }
  }, [searchTerm, universities]);

  return (
    <>
        <div className="input-group pt-4 mb-3 w-75">
          <input
            type="text"
            className="form-control"
            placeholder="Hit up your University name..."
            aria-label="search"
            aria-describedby="button-addon2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
          />
          <button className="btn btn-secondary" type="button" id="button-addon2">
            Search
          </button>
        </div>
        {filteredUniversities.length > 0 && (
          <ul className="list-group mt-2 w-75">
            {filteredUniversities.map((uni) => (
              <li key={uni.id} className="list-group-item">
                <Link href={`/university/${uni.id}`}>
                  {uni.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/university">
          <p className="search-bar-text text-white">All Universities</p>
        </Link>
        </>
  );
};

export default SearchBar;
