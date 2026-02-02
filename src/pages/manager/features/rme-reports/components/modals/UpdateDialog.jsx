import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Save, X } from 'lucide-react';
import StyledSelect from '../../../../../../components/ui/StyledSelect';
import {
    BLUE_COLOR,
    GRAY_COLOR,
    TEXT_COLOR,
    ORANGE_COLOR,
} from '../../utils/constants';
import OutlineButton from '../../../../../../components/ui/OutlineButton';

const UpdateDialog = ({ open, onClose, item, onSubmit }) => {
    const [formData, setFormData] = useState({
        category: '',
        componentType: '',
        customLabel: '',
        serialNumber: '',
        sortOrder: ''
    });

    // Define all categories
    const categories = [
        { value: '', label: '' },
        { value: '1', label: 'Aerobic Treatment Unit' },
        { value: '5', label: 'Disinfection' },
        { value: '10', label: 'Distribution' },
        { value: '11', label: 'Drainage' },
        { value: '6', label: 'Drainfield (disposal)' },
        { value: '3', label: 'Media Filter' },
        { value: '12', label: 'Monitoring' },
        { value: '7', label: 'Panel' },
        { value: '4', label: 'Pump' },
        { value: '2', label: 'TANK' }
    ];

    // Define components for each category
    const categoryComponents = {
        // Pump Category (4) - Keep existing
        '4': [
            { value: '', label: '' },
            { value: '29', label: 'Effluent Pump' },
            { value: '40', label: 'Siphon' }
        ],
        // Tank Category (2) - Keep existing
        '2': [
            { value: '', label: '' },
            { value: '117', label: 'Ammonia tank' },
            { value: '25', label: 'Clarifying Tank' },
            { value: '37', label: 'Grease Trap' },
            { value: '39', label: 'Grease trap - 2 Compartment' },
            { value: '28', label: 'Holding Tank' },
            { value: '48', label: 'Pump Basin' },
            { value: '26', label: 'Pump Tank' },
            { value: '50', label: 'Recirculation Tank' },
            { value: '19', label: 'Septic Tank - 1 Compartment' },
            { value: '23', label: 'Septic Tank - 2 Compartment' },
            { value: '49', label: 'Septic Tank - 3 Compartment' },
            { value: '24', label: 'Surge Tank' },
            { value: '27', label: 'Trash Tank' }
        ],
        // Aerobic Treatment Unit (1) - Keep existing
        '1': [
            { value: '', label: '' },
            { value: '201', label: 'ATU' },
        ],
        // Media Filter (3) - UPDATE THIS SECTION with HTML data
        '3': [
            { value: '', label: '' },
            { value: '17', label: 'Biofilter' },
            { value: '12', label: 'Bottomless Sand Filter' },
            { value: '15', label: 'Mound' },
            { value: '81', label: 'Mound - At Grade' },
            { value: '78', label: 'Peat Filter' },
            { value: '105', label: 'Recirculating Gravel Filter' },
            { value: '13', label: 'Recirculating Sand Filter' },
            { value: '11', label: 'Sand Filter' },
            { value: '16', label: 'Textile Filter' },
            { value: '14', label: 'Trickling Filter' }
        ],
        // Disinfection (5) - Keep existing
        '5': [
            { value: '', label: '' },
            { value: '501', label: 'Chlorine' },
            { value: '502', label: 'Ozone' },
            { value: '503', label: 'Ultraviolet' }
        ],
        // Drainfield (disposal) - Category 6 - Keep existing
        '6': [
            { value: '', label: '' },
            { value: '52', label: 'Cesspool' },
            { value: '7', label: 'Drip Irrigation' },
            { value: '101', label: 'Drip Irrigation (Automatic Flush)' },
            { value: '102', label: 'Drip Irrigation (Continuous Flush)' },
            { value: '103', label: 'Drip Irrigation (Manual Flush)' },
            { value: '53', label: 'Drywell' },
            { value: '80', label: 'ET/ETI Bed' },
            { value: '1', label: 'Gravity' },
            { value: '3', label: 'Gravity Bed' },
            { value: '54', label: 'Lagoon' },
            { value: '125', label: 'NPDES - Dry Ditch' },
            { value: '127', label: 'NPDES - Open water' },
            { value: '126', label: 'NPDES - Stream' },
            { value: '91', label: 'Pit Privy' },
            { value: '4', label: 'Pressure' },
            { value: '5', label: 'Pressure Bed' },
            { value: '6', label: 'Sand Lined Trench' },
            { value: '129', label: 'Seepage pit' },
            { value: '130', label: 'Seepage pit enhanced' },
            { value: '88', label: 'Spray Irrigation' },
            { value: '116', label: 'Surface Drip Irrigation' },
            { value: '115', label: 'Wastewater pond' }
        ],
        // Distribution - Category 10 - Keep existing
        '10': [
            { value: '', label: '' },
            { value: '101', label: 'Automatic Distribution Valve' },
            { value: '102', label: 'Bull-run Valve' },
            { value: '103', label: 'D-Box' },
            { value: '104', label: 'Diverter Valve' },
            { value: '105', label: 'Flow Meter' },
            { value: '106', label: 'Manifold' },
        ],
        // Drainage - Category 11 (add if needed)
        '11': [
            { value: '', label: '' },
            // Add drainage components here if needed
        ],
        // Monitoring - Category 12 (add if needed)
        '12': [
            { value: '', label: '' },
            // Add monitoring components here if needed
        ],
        // Panel - Category 7 (add if needed)
        '7': [
            { value: '', label: '' },
            // Add panel components here if needed
        ],
        // Default for other categories
        'default': [
            { value: '', label: '' },
            { value: '1', label: 'Component 1' },
            { value: '2', label: 'Component 2' }
        ]
    };

    // Generate sort order options (1-98)
    const sortOrderOptions = [{ value: '', label: '' }, ...Array.from({ length: 98 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString()
    }))];

    // Get components for selected category
    const getComponentsForCategory = () => {
        if (!formData.category) {
            return [{ value: '', label: '' }];
        }
        return categoryComponents[formData.category] || categoryComponents['default'];
    };

    const handleChange = (field, value) => {
        // If category changes, reset component type
        if (field === 'category') {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                componentType: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = () => {
        onSubmit(item.id, formData);
        onClose();
        resetForm();
    };

    const handleClose = () => {
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            category: '4',
            componentType: '29',
            customLabel: '',
            serialNumber: '',
            sortOrder: ''
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{
                bgcolor: alpha(BLUE_COLOR, 0.05),
                borderBottom: `1px solid ${alpha(BLUE_COLOR, 0.1)}`,
                py: 2,
                px: 3
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
                        Update Septic Components for Report
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{
                    display: 'block',
                    color: GRAY_COLOR,
                    mt: 0.5,
                    fontSize: '0.75rem'
                }}>
                    ID: {item?.id || 'N/A'} | Technician: {item?.technician || 'N/A'}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ py: 3, px: 3, overflow: 'auto' }}>
                <Box sx={{
                    border: '2px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    mb: 3
                }}>
                    <Typography
                        component="legend"
                        sx={{
                            px: 1,
                            fontWeight: 600,
                            color: TEXT_COLOR,
                            fontSize: '0.9rem',
                            mb: 2
                        }}
                    >
                        Septic System Components
                    </Typography>

                    {/* Component Information */}
                    <Box>
                        {/* 1. Select A Category */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                1. Select A Category
                            </Typography>
                            <FormControl fullWidth size="small">
                                <InputLabel>Category</InputLabel>
                                <StyledSelect
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    label="Category"
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            </FormControl>
                            <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                                (Required)
                            </Typography>
                        </Box>

                        {/* 2. Select A Component */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                2. Select A Component
                            </Typography>
                            <FormControl fullWidth size="small">
                                <InputLabel>Component Type</InputLabel>
                                <StyledSelect
                                    value={formData.componentType}
                                    onChange={(e) => handleChange('componentType', e.target.value)}
                                    label="Component Type"
                                    disabled={!formData.category}
                                >
                                    {getComponentsForCategory().map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            </FormControl>
                            <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                                (Required)
                            </Typography>
                        </Box>

                        {/* 3. Add a Custom Label */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                3. Add a Custom Label
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                value={formData.customLabel}
                                onChange={(e) => handleChange('customLabel', e.target.value)}
                                placeholder="Enter custom label"
                            />
                            <Typography variant="caption" sx={{ color: 'maroon', mt: 0.5 }}>
                                (optional)
                            </Typography>
                        </Box>

                        {/* 4. Serial Number / Sort Order */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                4. Serial Number / Sort Order
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    size="small"
                                    value={formData.serialNumber}
                                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                                    placeholder="Serial Number"
                                    sx={{ flexGrow: 1 }}
                                />
                                <FormControl size="small" sx={{ width: 80 }}>
                                    <InputLabel>Order</InputLabel>
                                    <StyledSelect
                                        value={formData.sortOrder}
                                        onChange={(e) => handleChange('sortOrder', e.target.value)}
                                        label="Order"
                                    >
                                        {sortOrderOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </StyledSelect>
                                </FormControl>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'maroon', mt: 0.5 }}>
                                (optional)
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{
                borderTop: `1px solid ${alpha(GRAY_COLOR, 0.1)}`,
                py: 2,
                px: 3,
                gap: 1
            }}>
                <OutlineButton
                    variant="outlined"
                    onClick={handleClose}
                    startIcon={<X size={16} />}
                >
                    Cancel
                </OutlineButton>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    color="warning"
                    size="small"
                    startIcon={<Save size={14} />}
                    sx={{
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        height: '32px',
                        bgcolor: ORANGE_COLOR,
                        '&:hover': {
                            bgcolor: alpha(ORANGE_COLOR, 0.9),
                        },
                    }}
                >
                    Update Component
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateDialog;