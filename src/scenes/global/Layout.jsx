import { CssBaseline } from "@mui/material"
// import { Sidebar } from "lucide-react"
import Topbar from "./Topbar"

const Layout = ({ children }) => {

    return (    
    <div className="app">
        <CssBaseline />
        {/* <Sidebar /> */}
        <main className="content">
        <Topbar />
        {children}
        </main>
    </div>
    )
}

export default Layout;