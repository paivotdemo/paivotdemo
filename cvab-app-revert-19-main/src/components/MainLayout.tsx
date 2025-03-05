import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import {Box, Stack} from "@mui/material"
import {Outlet} from 'react-router-dom'

function MainLayout(){
    return (
        <>
          <Box minHeight="100vh">
            <Navbar />
            <Stack direction="row" justifyContent="space-between">
              
              <Sidebar/>
              
              <Box flex={4} p={2} sx={{ml: { xs: "0px" , md: "330px"}}}>
                  <Outlet />
              </Box>
            </Stack>
            <Footer />
          </Box>
        </>
      )
}

export default MainLayout;