import React, { useMemo, useState } from 'react';
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
    Alert,
} from '@mui/material';
import {
    Search,
    X,
    Trash2,
    RotateCcw,
    History,
    AlertTriangle,
} from 'lucide-react';
import { alpha } from '@mui/material/styles';
import OutlineButton from '../../../components/ui/OutlineButton';
import SearchInput from './SearchInput'; // You might want to extract this too

const TEXT_COLOR = '#0F1115';
const GREEN_COLOR = '#10b981';
const RED_COLOR = '#ef4444';
const PURPLE_COLOR = '#8b5cf6';
const GRAY_COLOR = '#6b7280';

const formatDateShort = (dateString) => {
    if (!dateString) return '—';
    try {
        // Helper function - you might need to import it or define locally
        const toPacificTime = (dateString) => {
            const TIMEZONE_OFFSET = -8 * 60 * 60 * 1000;
            const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
            return new Date(date.getTime() + TIMEZONE_OFFSET);
        };
        const date = toPacificTime(dateString);
        const format = (date, formatStr) => {
            // Simple format function - you might want to import from date-fns
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            if (formatStr === 'MMM dd, HH:mm') {
                return `${month} ${day}, ${hours}:${minutes}`;
            }
            return `${month} ${day}`;
        };
        return format(date, 'MMM dd, HH:mm');
    } catch (e) {
        return '—';
    }
};

const RecycleBinModal = ({
    open,
    onClose,
    recycleBinItems,
    isRecycleBinLoading,
    recycleBinSearch,
    setRecycleBinSearch,
    recycleBinPage,
    recycleBinRowsPerPage,
    handleChangeRecycleBinPage,
    handleChangeRecycleBinRowsPerPage,
    selectedRecycleBinItems,
    toggleRecycleBinSelection,
    toggleAllRecycleBinSelection,
    confirmBulkRestore,
    confirmBulkPermanentDelete,
    handleSingleRestore,
    handleSinglePermanentDelete,
    restoreFromRecycleBinMutation,
    permanentDeleteFromRecycleBinMutation,
    bulkRestoreMutation,
    bulkPermanentDeleteMutation,
    isMobile,
    isSmallMobile,
}) => {
    const filteredRecycleBinItems = useMemo(() => {
        if (!recycleBinSearch) return recycleBinItems;
        const searchLower = recycleBinSearch.toLowerCase();
        return recycleBinItems.filter(item =>
            item.workOrderNumber?.toLowerCase().includes(searchLower) ||
            item.customerName?.toLowerCase().includes(searchLower) ||
            item.street?.toLowerCase().includes(searchLower) ||
            item.city?.toLowerCase().includes(searchLower) ||
            item.deletedBy?.toLowerCase().includes(searchLower)
        );
    }, [recycleBinItems, recycleBinSearch]);

    const recycleBinPageItems = filteredRecycleBinItems.slice(
        recycleBinPage * recycleBinRowsPerPage,
        recycleBinPage * recycleBinRowsPerPage + recycleBinRowsPerPage
    );

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
                                {filteredRecycleBinItems.length} deleted item(s) • Restore or permanently delete
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
                            checked={recycleBinPageItems.length > 0 && recycleBinPageItems.every(item =>
                                selectedRecycleBinItems.has(item.id)
                            )}
                            indeterminate={
                                recycleBinPageItems.length > 0 &&
                                recycleBinPageItems.some(item =>
                                    selectedRecycleBinItems.has(item.id)
                                ) &&
                                !recycleBinPageItems.every(item =>
                                    selectedRecycleBinItems.has(item.id)
                                )
                            }
                            onChange={toggleAllRecycleBinSelection}
                            sx={{
                                padding: '4px',
                                color: PURPLE_COLOR,
                                '&.Mui-checked': {
                                    color: PURPLE_COLOR,
                                },
                            }}
                        />
                        <SearchInput
                            value={recycleBinSearch}
                            onChange={setRecycleBinSearch}
                            placeholder="Search deleted items..."
                            color={PURPLE_COLOR}
                            fullWidth={isMobile}
                        />
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
                                Deleted items will appear here
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
                                        <TableCell sx={{ minWidth: 120 }}>Deleted At</TableCell>
                                        <TableCell width={150} sx={{ minWidth: 120 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recycleBinPageItems.map((item) => {
                                        const isSelected = selectedRecycleBinItems.has(item.id);
                                        const workOrderNumber = item.workOrderNumber || 'N/A';
                                        const type = item.type || 'STANDARD';
                                        const deletedBy = item.deletedBy || 'Unknown';
                                        const deletedByEmail = item.deletedByEmail || '';

                                        return (
                                            <TableRow
                                                key={item.id}
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
                                                        onChange={() => toggleRecycleBinSelection(item.id)}
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
                                                        {type}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{
                                                        fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                        color: TEXT_COLOR,
                                                        mb: 0.5,
                                                    }}>
                                                        {item.street || '—'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        fontSize: '0.75rem',
                                                        color: GRAY_COLOR,
                                                    }}>
                                                        {[item.city, item.state, item.zip].filter(Boolean).join(', ') || '—'}
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
                                                        {formatDateShort(item.deletedAt)}
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

export default RecycleBinModal;