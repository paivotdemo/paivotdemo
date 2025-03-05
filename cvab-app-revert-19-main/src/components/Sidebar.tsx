import {Box, Typography, Stack, Avatar, Button, ButtonGroup} from "@mui/material"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from "react-i18next";

const Sidebar = () => {
    const { t } = useTranslation();

    return (
        <Box flex={1} p={2} position="fixed"
            sx={{ 
                    display:{ xs: "none" , md: "block"}, 
                    background: "url(https://as1.ftcdn.net/jpg/02/17/89/41/240_F_217894165_H4jRalQ4eg9Kp8XUVGEa7XFDEPtTQ9PY.jpg)",
                    bgcolor: "#cccccc",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    color: "white",
                    minWidth: "300px",
                    height: "100%"
                }}>
                
                <LanguageSwitcher />
                <Stack spacing={2} p={2} alignItems="center" textAlign="center" 
                        >
                    <AutoStoriesIcon  sx={{color: "white", height: 100, width: 100}} />
                    <Typography variant="h5">C V ANDREWS <br/> BIBLE</Typography>
                    
                    <Stack spacing={0} sx={{width:"100%", color: "#acc7db", backgroundColor: "#4482ad"}}>
                        <ButtonGroup orientation="vertical" 
                            variant="outlined" size="small" color="inherit">
                            <Button href="/cvab">{t("home_page", {ns: 'common'})}</Button>
                            <Button href="/cvab/about">{t("about_us", {ns: 'common'})}</Button>
                            <Button href="/cvab/contact">{t("contact_us", {ns: 'common'})}</Button>
                        </ButtonGroup>
                    </Stack>

                    <Avatar alt="C V Andrews" src="/images/cvandrews.jpg" sx={{width: 200, height: 200}} />
                    <Box sx={{maxWidth: "250px"}}>
                        <Typography variant="caption">
                        "{t("cvandrews_message", {ns: 'common'})}"
                        </Typography>
                    </Box>  
                </Stack>
                
        </Box>
    )
}
export default Sidebar