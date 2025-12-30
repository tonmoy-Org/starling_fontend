import { TextField, styled } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "&:hover fieldset": {
            borderColor: "#76AADA",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#76AADA",
            borderWidth: "1px",
        },
    },
}));

export default StyledTextField;