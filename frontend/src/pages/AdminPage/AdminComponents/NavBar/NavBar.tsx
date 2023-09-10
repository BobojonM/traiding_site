import { FC, useState, useRef, useEffect } from "react";
import styles from './NavBar.module.css';
import NavButton from "../../../../components/UI/Buttons/NavButton";

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
        val: 'Dump/Pump'
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
    }

    const handleTrendsClick = () => {
        setIsModalOpen(true);
    }

    const handleDurationSelect = (trend: Section) => {
        setIsModalOpen(false);
        // Call changeActive with the selected duration
        changeActive(buttons.findIndex(button => button.name === 'trends'), trend);
    }

    return (
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
                                        <div className={styles.modal} ref={modalRef}>
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
    );
}

export default NavBar;
