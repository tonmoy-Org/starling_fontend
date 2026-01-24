import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Modal,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Stack,
    Tooltip,
    TablePagination,
    CircularProgress,
    Avatar,
    InputAdornment,
} from '@mui/material';
import {
    Search,
    X,
    Trash2,
    RotateCcw,
    History,
} from 'lucide-react';
import { alpha } from '@mui/material/styles';
import StyledTextField from '../../../components/ui/StyledTextField'; // Make sure this exists

const TEXT_COLOR = '#0F1115';
const GREEN_COLOR = '#10b981';
const RED_COLOR = '#ef4444';
const PURPLE_COLOR = '#8b5cf6';
const GRAY_COLOR = '#6b7280';
const BLUE_COLOR = '#1976d2';

// Helper function to get technician initial
const getTechnicianInitial = (technicianName) => {
    if (!technicianName) return '?';
    return technicianName.charAt(0).toUpperCase();
};

// Helper function to parse address
const parseDashboardAddress = (fullAddress) => {
    if (!fullAddress) return { street: '', city: '', state: '', zip: '', original: '' };
    const parts = fullAddress.split(' - ');
    if (parts.length < 2) return { street: fullAddress, city: '', state: '', zip: '', original: fullAddress };
    const street = parts[0].trim();
    const remaining = parts[1].trim();
    const zipMatch = remaining.match(/\b\d{5}\b/);
    const zip = zipMatch ? zipMatch[0] : '';
    const withoutZip = remaining.replace(zip, '').trim();
    const cityState = withoutZip.split(',').map(s => s.trim());
    return {
        street,
        city: cityState[0] || '',
        state: cityState[1] || '',
        zip,
        original: fullAddress,
    };
};

// Format date with timezone
const formatDateTimeWithTZ = (dateString) => {
    if (!dateString) return '—';
    try {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${month} ${day}, ${year} ${displayHours}:${minutes} ${ampm}`;
    } catch (e) {
        return '—';
    }
};

const RmeRecycleBinModal = ({
    open,
    onClose,
    // Data props
    recycleBinItems = [],
    isRecycleBinLoading = false,
    recycleBinSearch = '',
    setRecycleBinSearch = () => { },
    recycleBinPage = 0,
    recycleBinRowsPerPage = 10,
    handleChangeRecycleBinPage = () => { },
    handleChangeRecycleBinRowsPerPage = () => { },
    selectedRecycleBinItems = new Set(),
    // Action props
    toggleRecycleBinSelection = () => { },
    toggleAllRecycleBinSelection = () => { },
    confirmBulkRestore = () => { },
    confirmBulkPermanentDelete = () => { },
    handleSingleRestore = () => { },
    handleSinglePermanentDelete = () => { },
    // State props
    restoreFromRecycleBinMutation = { isPending: false },
    permanentDeleteFromRecycleBinMutation = { isPending: false },
    bulkRestoreMutation = { isPending: false },
    bulkPermanentDeleteMutation = { isPending: false },
    // Display props
    isMobile = false,
    isSmallMobile = false,
}) => {
    // Filter items based on search
    const filteredRecycleBinItems = useMemo(() => {
        if (!recycleBinSearch) return recycleBinItems;
        const searchLower = recycleBinSearch.toLowerCase();
        return recycleBinItems.filter(item => {
            const workOrderNumber = item.wo_number || 'N/A';
            const technician = item.technician || 'Unassigned';
            const deletedBy = item.deleted_by || 'Unknown';
            const address = parseDashboardAddress(item.full_address || '');

            return (
                workOrderNumber.toLowerCase().includes(searchLower) ||
                technician.toLowerCase().includes(searchLower) ||
                address.street.toLowerCase().includes(searchLower) ||
                address.city.toLowerCase().includes(searchLower) ||
                deletedBy.toLowerCase().includes(searchLower)
            );
        });
    }, [recycleBinItems, recycleBinSearch]);

    // Paginated items
    const recycleBinPageItems = useMemo(() => {
        return filteredRecycleBinItems.slice(
            recycleBinPage * recycleBinRowsPerPage,
            recycleBinPage * recycleBinRowsPerPage + recycleBinRowsPerPage
        );
    }, [filteredRecycleBinItems, recycleBinPage, recycleBinRowsPerPage]);

    // Determine if all items on page are selected
    const allSelectedOnPage = recycleBinPageItems.length > 0 &&
        recycleBinPageItems.every(item =>
            selectedRecycleBinItems.has(item.id?.toString() || item.id)
        );

    // Determine if some items on page are selected
    const someSelectedOnPage = recycleBinPageItems.length > 0 &&
        recycleBinPageItems.some(item =>
            selectedRecycleBinItems.has(item.id?.toString() || item.id)
        ) && !allSelectedOnPage;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="recycle-bin-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={{
                width: isMobile ? '100%' : '95%',
                maxWidth: 1400,
                maxHeight: '90vh',
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: 24,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                m: isMobile ? 1 : 0,
            }}>
                {/* Header */}
                <Box sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                    bgcolor: alpha(PURPLE_COLOR, 0.03),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(PURPLE_COLOR, 0.1),
                            color: PURPLE_COLOR,
                        }}>
                            <History size={20} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: TEXT_COLOR,
                                mb: 0.5,
                            }}>
                                Recycle Bin
                            </Typography>
                            <Typography variant="body2" sx={{
                                fontSize: '0.85rem',
                                color: GRAY_COLOR,
                            }}>
                                {filteredRecycleBinItems.length} deleted work order(s) • Restore or permanently delete
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            color: GRAY_COLOR,
                            '&:hover': {
                                backgroundColor: alpha(GRAY_COLOR, 0.1),
                            },
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </Box>

                {/* Toolbar with search and bulk actions */}
                <Box sx={{
                    p: 1.5,
                    borderBottom: `1px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: isMobile ? '100%' : 'auto',
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                    }}>
                        <Checkbox
                            size="small"
                            checked={allSelectedOnPage}
                            indeterminate={someSelectedOnPage}
                            onChange={toggleAllRecycleBinSelection}
                            sx={{
                                padding: '4px',
                                color: PURPLE_COLOR,
                                '&.Mui-checked': {
                                    color: PURPLE_COLOR,
                                },
                            }}
                        />
                        <Box sx={{ width: isMobile ? '100%' : 300 }}>
                            <StyledTextField
                                size="small"
                                placeholder="Search deleted work orders..."
                                value={recycleBinSearch}
                                onChange={(e) => setRecycleBinSearch(e.target.value)}
                                sx={{
                                    width: '100%',
                                    '& .MuiInputBase-root': {
                                        fontSize: '0.8rem',
                                        height: '36px',
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={16} color={GRAY_COLOR} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: recycleBinSearch && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setRecycleBinSearch('')}
                                                edge="end"
                                                sx={{ p: 0.5 }}
                                            >
                                                <X size={16} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: isMobile ? 'flex-start' : 'flex-start',
                        mt: isMobile ? 1 : 0,
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                    }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RotateCcw size={14} />}
                            onClick={confirmBulkRestore}
                            disabled={selectedRecycleBinItems.size === 0 || bulkRestoreMutation?.isPending}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                color: GREEN_COLOR,
                                borderColor: alpha(GREEN_COLOR, 0.3),
                                '&:hover': {
                                    borderColor: GREEN_COLOR,
                                    backgroundColor: alpha(GREEN_COLOR, 0.05),
                                },
                            }}
                        >
                            {isSmallMobile ? 'Restore' : 'Restore'} ({selectedRecycleBinItems.size})
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Trash2 size={14} />}
                            onClick={confirmBulkPermanentDelete}
                            disabled={selectedRecycleBinItems.size === 0 || bulkPermanentDeleteMutation?.isPending}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                color: RED_COLOR,
                                borderColor: alpha(RED_COLOR, 0.3),
                                '&:hover': {
                                    borderColor: RED_COLOR,
                                    backgroundColor: alpha(RED_COLOR, 0.05),
                                },
                            }}
                        >
                            {isSmallMobile ? 'Delete' : 'Delete'} ({selectedRecycleBinItems.size})
                        </Button>
                    </Box>
                </Box>

                {/* Table Content */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {isRecycleBinLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress size={24} sx={{ color: PURPLE_COLOR }} />
                        </Box>
                    ) : filteredRecycleBinItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <History size={48} color={alpha(GRAY_COLOR, 0.3)} />
                            <Typography variant="body2" sx={{
                                mt: 2,
                                color: GRAY_COLOR,
                                fontSize: '0.9rem',
                            }}>
                                No deleted items in recycle bin
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: GRAY_COLOR,
                                fontSize: '0.8rem',
                            }}>
                                Deleted work orders will appear here
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': {
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: alpha(PURPLE_COLOR, 0.05),
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: alpha(PURPLE_COLOR, 0.2),
                                borderRadius: '4px',
                            },
                        }}>
                            <Table size="small" sx={{ minWidth: isMobile ? 1000 : 'auto' }}>
                                <TableHead>
                                    <TableRow sx={{
                                        bgcolor: alpha(PURPLE_COLOR, 0.04),
                                        '& th': {
                                            borderBottom: `2px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                                            fontWeight: 600,
                                            fontSize: isMobile ? '0.75rem' : '0.8rem',
                                            color: TEXT_COLOR,
                                            py: 1.5,
                                            px: 1.5,
                                            whiteSpace: 'nowrap',
                                        }
                                    }}>
                                        <TableCell padding="checkbox" width={50} />
                                        <TableCell sx={{ minWidth: 120 }}>Work Order</TableCell>
                                        <TableCell sx={{ minWidth: 180 }}>Address</TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>Deleted By</TableCell>
                                        <TableCell sx={{ minWidth: 150 }}>Deleted At</TableCell>
                                        <TableCell width={150} sx={{ minWidth: 120 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recycleBinPageItems.map((item) => {
                                        const itemId = item.id?.toString() || item.id;
                                        const isSelected = selectedRecycleBinItems.has(itemId);
                                        const workOrderNumber = item.wo_number || 'N/A';
                                        const deletedBy = item.deleted_by || 'Unknown';
                                        const deletedByEmail = item.deleted_by_email || '';

                                        // Address parsing (safe)
                                        const fullAddress = item.full_address || '';
                                        const [streetPart = '', restPart = ''] = fullAddress.split(',');
                                        const restParts = restPart.trim().split(/\s+/);

                                        const street = streetPart.trim() || 'Unknown';
                                        const city = restParts[0] || 'Unknown';
                                        const state = restParts[1] || 'Unknown';
                                        const zip = restParts[2] || 'Unknown';


                                        return (
                                            <TableRow
                                                key={itemId}
                                                hover
                                                sx={{
                                                    bgcolor: isSelected ? alpha(PURPLE_COLOR, 0.1) : 'white',
                                                    '&:hover': {
                                                        backgroundColor: alpha(PURPLE_COLOR, 0.05),
                                                    },
                                                }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        size="small"
                                                        checked={isSelected}
                                                        onChange={() => toggleRecycleBinSelection(itemId)}
                                                        sx={{
                                                            padding: '4px',
                                                            color: PURPLE_COLOR,
                                                            '&.Mui-checked': {
                                                                color: PURPLE_COLOR,
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{
                                                        fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                        fontWeight: 500,
                                                        color: TEXT_COLOR,
                                                    }}>
                                                        {workOrderNumber}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        fontSize: '0.75rem',
                                                        color: GRAY_COLOR,
                                                    }}>
                                                        Status: {item.techReportSubmitted === true ? 'Submitted' : 'Waiting'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 500,
                                                        fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'break-word',
                                                    }}>
                                                        {street}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        color: GRAY_COLOR,
                                                        fontSize: isMobile ? '0.75rem' : '0.8rem',
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'break-word',
                                                    }}>
                                                        {city}, {state} {zip}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{
                                                            fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                            color: TEXT_COLOR,
                                                        }}>
                                                            {deletedBy}
                                                        </Typography>
                                                        {deletedByEmail && !isMobile && (
                                                            <Typography variant="caption" sx={{
                                                                fontSize: '0.75rem',
                                                                color: GRAY_COLOR,
                                                            }}>
                                                                {deletedByEmail}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{
                                                        fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                        color: TEXT_COLOR,
                                                    }}>
                                                        {formatDateTimeWithTZ(item.deleted_date)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={0.5}>
                                                        <Tooltip title="Restore">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleSingleRestore(item)}
                                                                disabled={restoreFromRecycleBinMutation?.isPending}
                                                                sx={{
                                                                    color: GREEN_COLOR,
                                                                    '&:hover': {
                                                                        backgroundColor: alpha(GREEN_COLOR, 0.1),
                                                                    },
                                                                }}
                                                            >
                                                                <RotateCcw size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete Permanently">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleSinglePermanentDelete(item)}
                                                                disabled={permanentDeleteFromRecycleBinMutation?.isPending}
                                                                sx={{
                                                                    color: RED_COLOR,
                                                                    '&:hover': {
                                                                        backgroundColor: alpha(RED_COLOR, 0.1),
                                                                    },
                                                                }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>

                {/* Pagination */}
                {filteredRecycleBinItems.length > 0 && (
                    <Box sx={{
                        borderTop: `1px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                        p: 1,
                    }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredRecycleBinItems.length}
                            rowsPerPage={recycleBinRowsPerPage}
                            page={recycleBinPage}
                            onPageChange={handleChangeRecycleBinPage}
                            onRowsPerPageChange={handleChangeRecycleBinRowsPerPage}
                            sx={{
                                '& .MuiTablePagination-toolbar': {
                                    minHeight: '44px',
                                },
                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                    fontSize: '0.8rem',
                                },
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default RmeRecycleBinModal;