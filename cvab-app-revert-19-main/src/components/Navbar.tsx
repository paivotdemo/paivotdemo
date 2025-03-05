import { Menu as MenuIcon } from "@mui/icons-material"
import {AppBar, Toolbar, Typography, Menu, MenuItem, Box} from "@mui/material"
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const goHomeHandler = () => {
        navigate('/cvab');
    }

    return (
        <AppBar position="sticky" sx={
                {display:{xs:"block", md:"none"},
                background: "url(https://as1.ftcdn.net/jpg/02/17/89/41/240_F_217894165_H4jRalQ4eg9Kp8XUVGEa7XFDEPtTQ9PY.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}>
            <Toolbar>
                <MenuIcon onClick={e=>setOpen(true)} sx={{display:{xs:"block", md:"none"}, cursor: "pointer"}}/>
                <Typography onClick={goHomeHandler} component="div" variant="h6" noWrap p={2} sx={{cursor: "pointer"}}>C V ANDREWS BIBLE</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <LanguageSwitcher />
            </Toolbar>
            
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={open}
                onClose={e=>setOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem component="a" href="/cvab">{t("home_page", {ns: 'common'})}</MenuItem>
                <MenuItem component="a" href="/cvab/about">{t("about_us", {ns: 'common'})}</MenuItem>
                <MenuItem component="a" href="/cvab/contact" >{t("contact_us", {ns: 'common'})}</MenuItem>
            </Menu>
        </AppBar>
    )
}
export default Navbar