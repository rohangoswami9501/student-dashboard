import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

export const metadata: Metadata = {
  title: "EduAdmin",
  description: "Student Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
          <ToastContainer position="top-right" autoClose={3000} />
        </AppProvider>
      </body>
    </html>
  );
}