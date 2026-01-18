import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const TOSReports = () => {
    return (
        <Box>
            <Helmet>
                <title>TOS | Sterling Septic & Plumbing LLC</title>
                <meta name="description" content="Super Admin TOS page" />
            </Helmet>
            <Typography gutterBottom sx={{ mb: 4, fontSize: 14 }}>
                This Page Is Coming Soon....
            </Typography>
            <div style={{ width: '100%', height: '100vh' }}>
                <object
                    data="https://pdfobject.com/pdf/sample.pdf"
                    type="application/pdf"
                    width="100%"
                    height="100%"
                >
                    <p>
                        PDF cannot be displayed.{" "}
                        <a href="https://pdfobject.com/pdf/sample.pdf" target="_blank" rel="noreferrer">
                            Download PDF
                        </a>
                    </p>
                </object>
            </div>
        </Box>
    );
};

export default TOSReports;