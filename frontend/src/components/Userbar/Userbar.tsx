import { FC, useState } from "react";
import { useSelector } from "react-redux";
import RootState from "../../models/RootState";
import useAuth from "../../hooks/useAuth";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './Userbar.module.css';
import RegularButton from "../UI/Buttons/RegularButton";
import { styled } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface UserbarInterface {
    openSetting: () => void;
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  }));

const Userbar: FC<UserbarInterface> = ({ openSetting }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = () => setIsOpen(!isOpen);

    const user = useSelector((state: RootState) => state.toolkit.user);
    const { logout } = useAuth();

    return (
        <>
            <IconButton className={styles.iconButton} onClick={toggleDrawer}>
                <AccountCircleIcon color="primary" className={styles.icon} fontSize="large"/>
            </IconButton>

            <Drawer color="primary" className={styles.drawer} anchor="right" open={isOpen} onClose={toggleDrawer}>
                <DrawerHeader className={styles.header}>
                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                        <ChevronLeftIcon color="primary" />
                    </IconButton>
                </DrawerHeader>
                <div className={styles.pannel}>
                    <div className={styles.content}>
                        <h3>Добро пожаловать, {user.email}</h3>
                        <h4>{user.isActivated ? 'Аккаунт активирован' : 'Вам надо активировать аккаунт'}</h4>

                        {user.isAdmin && (
                            <div className={styles.settings}>
                                <RegularButton action={openSetting}>Настройки</RegularButton>
                            </div>
                        )}

                        <button onClick={() => logout()} style={{ marginTop: '1rem' }}>Выйти</button>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default Userbar;
