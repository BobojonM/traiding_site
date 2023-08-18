import styles from './AdminPage.module.css'

import { FC, useState } from "react";
import Userbar from "../../components/Userbar/Userbar";
import NavBar, { Section } from "./AdminComponents/NavBar/NavBar";
import Rules from "./AdminComponents/Rules/Rules";



const AdminPage: FC = () => {
    const [selectedSection, setSelectedSection] = useState<Section | null>({
        name: 'rules',
        val: 'Правила'
    });

    const handleSectionSelection = (section: Section) => {
        setSelectedSection(section);
    }

    return(
        <div className={styles.page}>
            <Userbar/>
            <NavBar onButtonClick={handleSectionSelection}/>
            <div>
                {selectedSection && (
                    <Rules></Rules>
                )}
            </div>
        </div>
    )
}

export default AdminPage;