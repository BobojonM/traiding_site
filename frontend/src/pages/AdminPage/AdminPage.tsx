import styles from './AdminPage.module.css'

import { FC, useState } from "react";
import Userbar from "../../components/Userbar/Userbar";
import NavBar, { Section } from "./AdminComponents/NavBar/NavBar";
import Rules from "./AdminComponents/Rules/Rules";
import Trends from './AdminComponents/Trends/Trends';
import Combinations from './AdminComponents/Combinations/Combinations';
import Pairs from './AdminComponents/Pairs/Pairs';
import Settings from './AdminComponents/Settings/Settings';

const AdminPage: FC = () => {
    const [selectedSection, setSelectedSection] = useState<Section | null>({
        name: 'rules',
        val: 'Правила'
    });
    const [selectedTimeframe, setSelectedTimeframe] = useState<Section>({name: '', val: ''});
    const [showSettings, setShowSettings] = useState(false);

    const handleSectionSelection = (section: Section, timeframe: Section) => {
        if(timeframe){
            setSelectedTimeframe(timeframe);
        }
        setShowSettings(false);
        setSelectedSection(section);
    };

    const openSettings = () => {
        setShowSettings(true);
    }

    return(
        <div className={styles.page}>
            <Userbar openSetting={openSettings}/>
            <NavBar onButtonClick={(section, timeframe) => handleSectionSelection(section, timeframe)}/>
            <div>
                {showSettings ? (
                    <Settings/>
                ) : selectedSection?.name === 'rules' ? (
                    <Rules></Rules>
                ) : selectedSection?.name === 'comb' ? (
                    <Combinations></Combinations>
                ) : selectedSection?.name === 'pairs' ? (
                    <Pairs></Pairs>
                ) : <Trends timeframe={selectedTimeframe}></Trends>}
            </div>
        </div>
    )
}

export default AdminPage;