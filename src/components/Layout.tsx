import { useLocation } from "react-router-dom";
import Header from "./../components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isOrderDetails = pathname.includes("/orders/details");

  return (
    <div
      className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-100"
      style={{
        height: "100dvh",
        maxHeight: "-webkit-fill-available",
      }}
    >
      <Header />
      <main
        className={`flex-1 min-h-0 p-3 sm:p-4 overflow-auto ${
          isOrderDetails ? "bg-gradient-to-br from-blue-50 via-white to-blue-100" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
