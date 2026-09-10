import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function MainLayout() {


    return (
        <div style={{ display: "flex" }}>
            <Header />          

            <main>
                <Outlet />
                <Footer/>
            </main>
        </div>
    );
}