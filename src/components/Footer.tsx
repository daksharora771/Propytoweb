import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-gradient-to-b from-black to-black text-white pb-4 px-6 
    "
    >
      <div className="footer_seperator flex flex-row items-center justify-center pb-3 pt-2 relative">
        <div className="footer-seperator-line"></div>
      </div>
      <div className="flex flex-col 3xl:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          © 2025 <span className="text-[#e5a526]">Propyto</span>. All rights
          reserved - Info Edge (India) Ltd.
        </p>
        <div className="flex gap-3">
          <Link
            href="https://crealogic.tech/"
            target="_blank"
            className="text-[#e5a526]"
          >
            crealogic.tech
          </Link>
          group venture.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
