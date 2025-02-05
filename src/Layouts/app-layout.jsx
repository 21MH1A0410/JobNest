import { Outlet } from "react-router-dom";
import Header from "../components/header";
const AppLayout = () => {
    return (
    <div>
        <div className="grid-background"></div>
        <main className="min-h-screen container mx-auto px-4">
            <Header/>
            <Outlet/>
        </main>
        <div className="p-10 text-center bg-gray-800 mt-10 ">
            <p className="text-white"></p>
        &copy; {new Date().getFullYear()} PortalGo. All rights reserved.
        </div>
    </div>
    )
};

export default AppLayout;