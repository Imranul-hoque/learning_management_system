"use client";

import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
    return (
      <div className="h-full w-full flex flex-col space-y-3 pl-4 pt-3">
        <div className="pl-5 py-3">
          <Logo />
        </div>
        <div>
          <SidebarRoutes />
        </div>
      </div>
    );
}
 
export default Sidebar;