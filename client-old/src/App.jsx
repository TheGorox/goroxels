// import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./js/app/GamePage.jsx";
// import ConvertPage from "./pages/ConvertPage.jsx";
// import AdminPage from "./pages/AdminPage.jsx";
// import RadioPage from "./pages/RadioPage.jsx";

export default function App() {
    return (
        <GamePage />
    );

    // todo: change to routing mode when full React transition is done
    // return (
    //     <BrowserRouter>
    //         <Routes>
    //             <Route path="/" element={<GamePage />} />
    //             <Route path="/convert" element={<ConvertPage />} />
    //             <Route path="/admin" element={<AdminPage />} />
    //             <Route path="/radio" element={<RadioPage />} />
    //         </Routes>
    //     </BrowserRouter>
    // );
}
