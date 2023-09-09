import styles from './AdminPage.module.css'

import { FC, useState } from "react";
import Userbar from "../../components/Userbar/Userbar";
import NavBar, { Section } from "./AdminComponents/NavBar/NavBar";
import Rules from "./AdminComponents/Rules/Rules";
import Trends from './AdminComponents/Trends/Trends';
import Combinations from './AdminComponents/Combinations/Combinations';



const AdminPage: FC = () => {
    const [selectedSection, setSelectedSection] = useState<Section | null>({
        name: 'rules',
        val: 'Правила'
    });
    const [selectedTimeframe, setSelectedTimeframe] = useState<Section>({name: '', val: ''});

    const handleSectionSelection = (section: Section, timeframe: Section) => {
        if(timeframe){
            setSelectedTimeframe(timeframe);
        }
        
        setSelectedSection(section);
    }

    return(
        <div className={styles.page}>
            <Userbar/>
            <NavBar onButtonClick={(section, timeframe) => handleSectionSelection(section, timeframe)}/>
            <div>
                {selectedSection?.name === 'rules' ? (
                    <Rules></Rules>
                ) : selectedSection?.name === 'comb' ? (
                    <Combinations></Combinations>
                ) : <Trends timeframe={selectedTimeframe}></Trends>}
            </div>
        </div>
    )
}

export default AdminPage;