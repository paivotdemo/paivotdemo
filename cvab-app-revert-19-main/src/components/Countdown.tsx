import './Countdown.css';
import { Typography } from '@mui/material'
import {Stack} from '@mui/material';
import { useTranslation } from "react-i18next";

export const Countdown = () => {

    const { t } = useTranslation();
    return (
        <Stack className="countdown" spacing={2}>
                
                {/* <Avatar alt="C V Andrews" src="/images/cvandrews.jpg" sx={{ width: 200, height: 200 }} /> */}
                <Typography variant='h5'>{t("coming_soon", {ns: 'common'})}</Typography>
                {/* <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                    <Stack direction={'row'} spacing={4}>
                        <Stack>
                            <Box><Typography variant='h4'>24</Typography></Box>
                            <Box><Typography variant='subtitle2'>days</Typography></Box>
                        </Stack>
                        <Stack>
                            <Box><Typography variant='h4'>12</Typography></Box>
                            <Box><Typography variant='subtitle2'>hours</Typography></Box>
                        </Stack>
                        <Stack>
                            <Box><Typography variant='h4'>44</Typography></Box>
                            <Box><Typography variant='subtitle2'>minutes</Typography></Box>
                        </Stack>
                        <Stack>
                            <Box><Typography variant='h4'>43</Typography></Box>
                            <Box><Typography variant='subtitle2'>seconds</Typography></Box>
                        </Stack>
                    </Stack>
                    <Divider />
                </Box> */}
        </Stack>
    )
} 