// import styles from './AdminPage.module.css'

import { FC } from "react";
import Userbar from "../../components/Userbar/Userbar";
import NavBar from "./AdminComponents/NavBar/NavBar";

const AdminPage: FC = () => {
    return(
        <div>
            <Userbar/>
            <NavBar/>
        </div>
    )
}

export default AdminPage;