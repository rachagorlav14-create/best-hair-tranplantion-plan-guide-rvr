import { Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import BottomNav from "./BottomNav";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const hideChrome = pathname === "/auth";
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!hideChrome && <SiteHeader />}
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>
      {!hideChrome && <SiteFooter />}
      {!hideChrome && <BottomNav />}
    </div>
  );
}
