import { Button, styled } from '@mui/material';

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #76AADA 0%, #5A95C9 100%)',
    color: 'white',
    borderRadius: '5px',
    padding: '6px 16px',
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(118, 170, 218, 0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #5A95C9 0%, #4A85B9 100%)',
        boxShadow: '0 4px 12px rgba(118, 170, 218, 0.25)',
        transform: 'translateY(-1px)',
    },
    '&:disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
}));

export default GradientButton;