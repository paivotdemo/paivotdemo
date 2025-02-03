
import {Box, Typography, Stack, Avatar} from "@mui/material"
import { useTranslation } from "react-i18next";

const Footer = () => {    
    const { t } = useTranslation();
    return (

        <Box flex={1} p={2} color="white" position="sticky"
            sx={{ 
                    top: "100vh",
                    display:{xs:"block", md:"none"},
                    background: "url(https://as1.ftcdn.net/jpg/02/17/89/41/240_F_217894165_H4jRalQ4eg9Kp8XUVGEa7XFDEPtTQ9PY.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}>
                    
            <Stack direction="row" spacing={2} p={2}  sx={{justifyContent: "center", display: "flex",  alignItems: "center"}}>                
                <Avatar alt="C V Andrews" src="/images/cvandrews.jpg" sx={{width: 150, height: 150}} />                
                <Typography variant="caption">
                "{t("cvandrews_message", {ns: 'common'})}"
                </Typography>
            </Stack>
        </Box>
    )
}
export default Footer