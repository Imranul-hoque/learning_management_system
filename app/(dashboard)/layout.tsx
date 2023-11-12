import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full">
            <div className="w-full md:pl-60 fixed inset-x-0 z-50">
                <Navbar />
            </div>
            <div className="w-60 fixed inset-y-0 z-50 hidden md:flex border-r">
                <Sidebar />
            </div>
            <main className="md:pl-60 pt-[75px] h-full">
                {children}
            </main>
        </div>
    )
}