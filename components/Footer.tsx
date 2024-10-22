import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
export const Footer = () => {
  return (
    <footer>
      <div className="d-flex flex-column justify-content-center align-items-center p-5 bg-light">
        <h1>
          <a
            className="nav-link active fs-1 fw-bolder d-none d-md-block d-lg-block"
            aria-current="page"
            href="#"
          >
            R a t e My <span className="text-primary">Pg.com</span>
          </a>
        </h1>
        <div className="footer-icons d-flex gap-4 py-3">
          <Link className="text-black" href="https://www.instagram.com">
            <FaInstagram size={25} />
          </Link>
          <Link className="text-black" href="https://www.twitter.com">
            <FaXTwitter size={23} />
          </Link>
        </div>
        <div className="footer-links d-flex gap-4 fs-5 display-6 fw-bolder pt-2">
          <Link href="/about">
            <p className="text-black">About</p>
          </Link>
          <Link href="/all">
            <p className="text-black">All Universities</p>{" "}
          </Link>
          <Link href="/about">
            <p className="text-black">Add School</p>{" "}
          </Link>
        </div>
        <div className="footer-subsection py-3 d-flex gap-4">
          <Link href="/termsnco">
            <p className="text-black">Terms & Co</p>{" "}
          </Link>
          •
          <Link href="/privacy">
            <p className="text-black">Privacy Policy</p>{" "}
          </Link>
          •
          <Link href="">
            <p className="text-black">All Rights Reserved</p>{" "}
          </Link>
        </div>
      </div>
    </footer>
  );
};
