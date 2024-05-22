import { FC, useState, useRef, useEffect } from "react";
import styles from './NavBar.module.css';
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import NavButton from "../../../../components/UI/Buttons/NavButton";
import { styled } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface Section {
    name: string;
    val: string;
}

interface NavBarProps {
    onButtonClick: (buttonName: Section, timeframe: Section) => void;
}

const buttons: Section[] = [
    {
        name: 'dump-pump',
        val: 'Top Coins'
    },
    {
        name: 'rules',
        val: 'Правила'
    },
    {
        name: 'trends',
        val: 'Тренды'
    },
    {
        name: 'comb',
        val: 'Совмещения'
    },
    {
        name: 'pairs',
        val: 'Монеты'
    }
];

const trends: Section[] = [
    {
        name: '15 minutes trend',
        val: '15m'
    },
    {
        name: '1 hour trend',
        val: '1h'
    },
    {
        name: '4 hours trend',
        val: '4h'
    },
    {
        name: '1 day trend',
        val: '1d'
    }
];

const NavBar: FC<NavBarProps> = ({ onButtonClick }) => {
    const [active, setActive] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const changeActive = (index: number, timeframe = {name: '', val: ''}) => {
        // console.log(timeframe);
        
        setActive(index);
        onButtonClick(buttons[index], timeframe);
        setDrawerOpen(false);
        setIsModalOpen(false)
    }

    const handleTrendsClick = () => {
        setIsModalOpen(true);
    }

    const handleDurationSelect = (trend: Section) => {
        // Call changeActive with the selected duration
        changeActive(buttons.findIndex(button => button.name === 'trends'), trend);
        setIsModalOpen(false);
        setDrawerOpen(false);
    }

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
      }));

    return (
        <div>
            <IconButton className={styles.menuButton} onClick={toggleDrawer}>
                <MenuIcon color="primary" className={styles.icon} fontSize="large" />
            </IconButton>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <DrawerHeader className={styles.header}>
                    <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                        <ChevronRightIcon color="primary" />
                    </IconButton>
                </DrawerHeader>
                <nav className={`${styles.navigation} ${styles.drawerNavigation}`}>
                    <ul>
                        {buttons.map((elem, index) => (
                        <li key={elem.name}>
                        {elem.name === 'trends' ? (
                            <>
                                <NavButton action={() => handleTrendsClick()} isActive={index === active}>
                                    {elem.val}
                                </NavButton>
                                {isModalOpen && (
                                    <ul className={styles.addMenu}>
                                        {trends.map((trend) => (
                                            <li key={trend.name} onClick={() => handleDurationSelect(trend)}>
                                                {trend.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <NavButton action={() => changeActive(index)} isActive={index === active}>
                                {elem.val}
                            </NavButton>
                        )}
                    </li>
                        ))}
                    </ul>
                </nav>
            </Drawer>

            <nav className={styles.navigation}>
                <ul>
                    {buttons.map((elem, index) => (
                        <li key={elem.name}>
                            {elem.name === 'trends' ? (
                                <>
                                    <NavButton action={() => handleTrendsClick()} isActive={index === active}>
                                        {elem.val}
                                    </NavButton>
                                    {isModalOpen && (
                                        <div className={styles.modalWrapper}>
                                            <div className={styles.modal}>
                                                <ul className={styles.modalList}>
                                                    {trends.map((trend) => (
                                                        <li key={trend.name} onClick={() => handleDurationSelect(trend)}>
                                                            {trend.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <NavButton action={() => changeActive(index)} isActive={index === active}>
                                    {elem.val}
                                </NavButton>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default NavBar;
