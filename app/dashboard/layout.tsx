import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../components/Navbar";
import { JSX } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <>
        <Navbar />
        {children}
    </>
  );
}