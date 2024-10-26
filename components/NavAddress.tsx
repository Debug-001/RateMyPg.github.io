import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/context/Firebase';

const NavAddress = () => {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  const [universityName, setUniversityName] = useState<string | null>(null);
  const [pgName, setPgName] = useState<string | null>(null);

  useEffect(() => {
    const fetchNames = async () => {
      const [universityId, pgId] = pathSegments.slice(-2);

      // Fetch University Name
      if (universityId) {
        const universityRef = doc(db, "universities", universityId);
        const universitySnap = await getDoc(universityRef);
        if (universitySnap.exists()) {
          setUniversityName(universitySnap.data().name || "Unknown University");
        }
      }

      // Fetch PG Name
      if (pgId) {
        const pgRef = doc(db, "universities", universityId, "pgs", pgId);
        const pgSnap = await getDoc(pgRef);
        if (pgSnap.exists()) {
          setPgName(pgSnap.data().name || "Unknown PG");
        }
      }
    };

    fetchNames();
  }, [pathSegments]);

  return (
    <nav className="d-flex align-items-center pt-4">
      <ol className="breadcrumb d-flex flex-wrap">
        <li className="breadcrumb-item">
          <Link href="/">Home</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const routePath = '/' + pathSegments.slice(0, index + 1).join("/");
          let displayText = decodeURIComponent(segment);

          // Determine the display text based on the index
          if (index === pathSegments.length - 2) {
            // Second last segment should be university name if available
            displayText = universityName || displayText;
          } else if (index === pathSegments.length - 1) {
            // Last segment should be PG name if available; fallback to university name
            displayText = pgName || universityName || displayText;
          }

          return (
            <li key={index} className="breadcrumb-item d-flex align-items-center">
              <IoIosArrowForward size={20} className="mx-1" />
              <Link href={routePath}>{displayText}</Link>
            </li>
          );
        })}
      </ol>

      <style jsx>{`
        nav {
          font-size: 1rem;
        }
        .breadcrumb {
          flex-wrap: wrap;
        }
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .breadcrumb-item a {
          color: #007bff;
          text-decoration: none;
        }
        .breadcrumb-item a:hover {
          text-decoration: underline;
        }

        // Responsive adjustments
        @media (max-width: 768px) {
          nav {
            font-size: 0.875rem;
          }
        }

        @media (max-width: 576px) {
          .breadcrumb-item a {
            white-space: nowrap;
          }
        }
      `}</style>
    </nav>
  );
};

export default NavAddress;
