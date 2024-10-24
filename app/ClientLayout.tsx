'use client'; 

import React, { useState, useEffect, useRef } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setHovering] = useState(false);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(() => {
          setCursorPosition({ x: mouseX, y: mouseY });
          requestRef.current = null;
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseOver = () => setHovering(true);
    const handleMouseOut = () => setHovering(false);

    const elements = document.querySelectorAll(".btn, .input-feilds, .accordion, .accordion-header, .accordion-body");
    elements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, []);

  return (
    <>
      <div
        className={`custom-cursor ${isHovering ? "hover-effect" : ""}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transition: "transform 0.05s linear",
        }}
      ></div>
      {children}
    </>
  );
}
