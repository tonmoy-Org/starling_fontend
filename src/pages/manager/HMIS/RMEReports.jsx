import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Snackbar,
    Alert,
    CircularProgress,
    Avatar,
    Stack,
    Checkbox,
    Button,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    TablePagination,
    Modal,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    Search,
    X,
    Trash2,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    Timer,
    Mail,
    User,
    CheckCheck,
    Eye,
    Lock,
    Printer,
    History,
    Edit,
    FileText,
    File,
    Calendar,
    MapPin,
    User as UserIcon,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RotateCcw,
    PhoneCall,
    Plus,
} from 'lucide-react';

const TEXT_COLOR = '#0F1115';
const BLUE_COLOR = '#1976d2';
const GREEN_COLOR = '#10b981';
const RED_COLOR = '#ef4444';
const ORANGE_COLOR = '#ed6c02';
const GRAY_COLOR = '#6b7280';
const PURPLE_COLOR = '#8b5cf6';
const TEAL_COLOR = '#14b8a6';

const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return '—';
    }
};

const RMEReports = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    const [selectedActive, setSelectedActive] = useState(new Set());
    const [selectedHistory, setSelectedHistory] = useState(new Set());

    const [pageActive, setPageActive] = useState(0);
    const [rowsPerPageActive, setRowsPerPageActive] = useState(10);
    const [pageHistory, setPageHistory] = useState(0);
    const [rowsPerPageHistory, setRowsPerPageHistory] = useState(10);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
    const [deletionSection, setDeletionSection] = useState('');
    const [lockDialogOpen, setLockDialogOpen] = useState(false);
    const [selectedForLock, setSelectedForLock] = useState(new Set());

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const [historyPage, setHistoryPage] = useState(0);
    const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
    const [selectedHistoryItems, setSelectedHistoryItems] = useState(new Set());

    const [searchTerm, setSearchTerm] = useState('');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Simulated data - replace with actual API calls
    const activeReports = useMemo(() => [
        {
            id: '1',
            date: '12/22/2025',
            elapsedTime: '10 HOURS',
            elapsedColor: GREEN_COLOR,
            technician: 'Jason',
            technicianInitial: 'J',
            address: '123 MAIN ST - Kent WA 98032',
            street: '123 MAIN ST',
            city: 'Kent',
            state: 'WA',
            zip: '98032',
            lastReport: true,
            unlockedReport: false,
            rmeCompleted: true,
            priority: 'Standard',
            status: 'Active',
            createdAt: '2025-12-22T08:00:00',
        },
        {
            id: '2',
            date: '01/21/2026',
            elapsedTime: '26 HOURS',
            elapsedColor: ORANGE_COLOR,
            technician: 'Josh',
            technicianInitial: 'J',
            address: '777 42ND AVE - Puyallup WA 98372',
            street: '777 42ND AVE',
            city: 'Puyallup',
            state: 'WA',
            zip: '98372',
            lastReport: false,
            unlockedReport: true,
            rmeCompleted: true,
            priority: 'High',
            status: 'Active',
            createdAt: '2026-01-21T09:00:00',
        },
        {
            id: '3',
            date: '11/15/2025',
            elapsedTime: '50 HOURS',
            elapsedColor: RED_COLOR,
            technician: 'Billy',
            technicianInitial: 'B',
            address: '555 12TH ST - Graham WA 98338',
            street: '555 12TH ST',
            city: 'Graham',
            state: 'WA',
            zip: '98338',
            lastReport: false,
            unlockedReport: true,
            rmeCompleted: true,
            priority: 'Emergency',
            status: 'Active',
            createdAt: '2025-11-15T10:00:00',
        },
        {
            id: '4',
            date: '12/18/2025',
            elapsedTime: '2 HOURS',
            elapsedColor: GREEN_COLOR,
            technician: 'Jason',
            technicianInitial: 'J',
            address: '111 44TH DR - Eatonville WA 98328',
            street: '111 44TH DR',
            city: 'Eatonville',
            state: 'WA',
            zip: '98328',
            lastReport: true,
            unlockedReport: false,
            rmeCompleted: true,
            priority: 'Standard',
            status: 'Active',
            createdAt: '2025-12-18T11:00:00',
        },
        {
            id: '5',
            date: '01/14/2026',
            elapsedTime: '5 HOURS',
            elapsedColor: GREEN_COLOR,
            technician: 'Damon',
            technicianInitial: 'D',
            address: '888 OAK ST - Tacoma WA 98409',
            street: '888 OAK ST',
            city: 'Tacoma',
            state: 'WA',
            zip: '98409',
            lastReport: true,
            unlockedReport: false,
            rmeCompleted: false,
            priority: 'Medium',
            status: 'Pending',
            createdAt: '2026-01-14T08:30:00',
        },
    ], []);

    const historyReports = useMemo(() => [
        {
            id: 'h1',
            status: 'LOCKED',
            statusColor: GREEN_COLOR,
            date: '01/14/2026',
            by: 'Damon',
            byEmail: 'damon@company.com',
            reportId: 'RME-2026-001',
            address: '123 MAIN ST - Kent WA 98032',
            action: 'locked',
            actionTime: '2026-01-14T14:30:00',
        },
        {
            id: 'h2',
            status: 'DELETED',
            statusColor: RED_COLOR,
            date: '01/18/2026',
            by: 'Eric',
            byEmail: 'eric@company.com',
            reportId: 'RME-2026-002',
            address: '777 42ND AVE - Puyallup WA 98372',
            action: 'deleted',
            actionTime: '2026-01-18T16:45:00',
        },
        {
            id: 'h3',
            status: 'DELETED',
            statusColor: RED_COLOR,
            date: '04/21/2025',
            by: 'Cameron',
            byEmail: 'cameron@company.com',
            reportId: 'RME-2025-045',
            address: '555 12TH ST - Graham WA 98338',
            action: 'deleted',
            actionTime: '2025-04-21T11:20:00',
        },
        {
            id: 'h4',
            status: 'LOCKED',
            statusColor: GREEN_COLOR,
            date: '10/22/2025',
            by: 'Eric',
            byEmail: 'eric@company.com',
            reportId: 'RME-2025-089',
            address: '111 44TH DR - Eatonville WA 98328',
            action: 'locked',
            actionTime: '2025-10-22T09:15:00',
        },
        {
            id: 'h5',
            status: 'UNLOCKED',
            statusColor: BLUE_COLOR,
            date: '12/05/2025',
            by: 'Jason',
            byEmail: 'jason@company.com',
            reportId: 'RME-2025-102',
            address: '888 OAK ST - Tacoma WA 98409',
            action: 'unlocked',
            actionTime: '2025-12-05T13:40:00',
        },
    ], []);

    // Filter active reports based on search term
    const filteredActiveReports = useMemo(() => {
        if (!searchTerm) return activeReports;
        const searchLower = searchTerm.toLowerCase();
        return activeReports.filter(report =>
            report.technician.toLowerCase().includes(searchLower) ||
            report.address.toLowerCase().includes(searchLower) ||
            report.street.toLowerCase().includes(searchLower) ||
            report.city.toLowerCase().includes(searchLower) ||
            report.status.toLowerCase().includes(searchLower)
        );
    }, [activeReports, searchTerm]);

    // Filter history reports based on search
    const filteredHistoryReports = useMemo(() => {
        if (!historySearch) return historyReports;
        const searchLower = historySearch.toLowerCase();
        return historyReports.filter(item =>
            item.by.toLowerCase().includes(searchLower) ||
            item.reportId.toLowerCase().includes(searchLower) ||
            item.address.toLowerCase().includes(searchLower) ||
            item.status.toLowerCase().includes(searchLower)
        );
    }, [historyReports, historySearch]);

    const handleChangePageActive = (event, newPage) => {
        setPageActive(newPage);
    };

    const handleChangeRowsPerPageActive = (event) => {
        setRowsPerPageActive(parseInt(event.target.value, 10));
        setPageActive(0);
    };

    const handleChangePageHistory = (event, newPage) => {
        setPageHistory(newPage);
    };

    const handleChangeRowsPerPageHistory = (event) => {
        setRowsPerPageHistory(parseInt(event.target.value, 10));
        setPageHistory(0);
    };

    const handleChangeHistoryPage = (event, newPage) => {
        setHistoryPage(newPage);
    };

    const handleChangeHistoryRowsPerPage = (event) => {
        setHistoryRowsPerPage(parseInt(event.target.value, 10));
        setHistoryPage(0);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const confirmDelete = (selectionSet, section) => {
        if (selectionSet.size === 0) return;
        setSelectedForDeletion(selectionSet);
        setDeletionSection(section);
        setDeleteDialogOpen(true);
    };

    const executeDelete = () => {
        // Simulate delete operation
        console.log('Deleting items:', Array.from(selectedForDeletion));
        showSnackbar(`${selectedForDeletion.size} report(s) deleted`, 'success');
        setSelectedActive(new Set());
        setDeleteDialogOpen(false);
        setSelectedForDeletion(new Set());
    };

    const confirmLock = (selectionSet) => {
        if (selectionSet.size === 0) return;
        setSelectedForLock(selectionSet);
        setLockDialogOpen(true);
    };

    const executeLock = () => {
        // Simulate lock operation
        console.log('Locking items:', Array.from(selectedForLock));
        showSnackbar(`${selectedForLock.size} report(s) locked`, 'success');
        setSelectedActive(new Set());
        setLockDialogOpen(false);
        setSelectedForLock(new Set());
    };

    const toggleSelection = (setState, id) => {
        setState(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleAllSelection = (setState, items, pageItems) => {
        const allPageIds = new Set(pageItems.map(item => item.id));
        const currentSelected = new Set(setState);
        const allSelectedOnPage = Array.from(allPageIds).every(id => currentSelected.has(id));

        if (allSelectedOnPage) {
            const newSet = new Set(currentSelected);
            allPageIds.forEach(id => newSet.delete(id));
            return newSet;
        } else {
            const newSet = new Set([...currentSelected, ...allPageIds]);
            return newSet;
        }
    };

    const toggleHistorySelection = (id) => {
        setSelectedHistoryItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleAllHistorySelection = () => {
        const currentPageItems = filteredHistoryReports.slice(
            historyPage * historyRowsPerPage,
            historyPage * historyRowsPerPage + historyRowsPerPage
        );

        const allPageIds = new Set(currentPageItems.map(item => item.id));
        const currentSelected = new Set(selectedHistoryItems);
        const allSelectedOnPage = Array.from(allPageIds).every(id => currentSelected.has(id));

        if (allSelectedOnPage) {
            const newSet = new Set(currentSelected);
            allPageIds.forEach(id => newSet.delete(id));
            setSelectedHistoryItems(newSet);
        } else {
            const newSet = new Set([...currentSelected, ...allPageIds]);
            setSelectedHistoryItems(newSet);
        }
    };

    const activePageItems = filteredActiveReports.slice(
        pageActive * rowsPerPageActive,
        pageActive * rowsPerPageActive + rowsPerPageActive
    );

    const historyPageItems = filteredHistoryReports.slice(
        pageHistory * rowsPerPageHistory,
        pageHistory * rowsPerPageHistory + rowsPerPageHistory
    );

    const historyModalPageItems = filteredHistoryReports.slice(
        historyPage * historyRowsPerPage,
        historyPage * historyRowsPerPage + historyRowsPerPage
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: '0.95rem',
                            color: TEXT_COLOR,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        RME Reports Management
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: GRAY_COLOR,
                            fontSize: '0.8rem',
                            fontWeight: 400,
                        }}
                    >
                        Track and manage RME reports efficiently
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<History size={16} />}
                    onClick={() => setHistoryModalOpen(true)}
                    sx={{
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: PURPLE_COLOR,
                        borderColor: alpha(PURPLE_COLOR, 0.3),
                        '&:hover': {
                            borderColor: PURPLE_COLOR,
                            backgroundColor: alpha(PURPLE_COLOR, 0.05),
                        },
                    }}
                >
                    History ({historyReports.length})
                </Button>
            </Box>

            {/* Active RME Reports Section */}
            <Section
                title="Active RME Reports"
                color={BLUE_COLOR}
                count={filteredActiveReports.length}
                selectedCount={selectedActive.size}
                onDelete={() => confirmDelete(selectedActive, 'Active Reports')}
                additionalActions={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                position: 'relative',
                                width: 200,
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px 8px 36px',
                                    fontSize: '0.8rem',
                                    border: `1px solid ${alpha(GRAY_COLOR, 0.3)}`,
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    outline: 'none',
                                    height: '36px',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: GRAY_COLOR,
                                }}
                            />
                            {searchTerm && (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchTerm('')}
                                    sx={{
                                        position: 'absolute',
                                        right: '4px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '2px',
                                    }}
                                >
                                    <X size={14} />
                                </IconButton>
                            )}
                        </Box>
                        {selectedActive.size > 0 && (
                            <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() => confirmLock(selectedActive)}
                                startIcon={<Lock size={14} />}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    height: '30px',
                                    px: 1.5,
                                }}
                            >
                                Lock ({selectedActive.size})
                            </Button>
                        )}
                    </Stack>
                }
            >
                <RMETable
                    items={activePageItems}
                    selected={selectedActive}
                    onToggleSelect={(id) => toggleSelection(setSelectedActive, id)}
                    onToggleAll={() => setSelectedActive(toggleAllSelection(selectedActive, filteredActiveReports, activePageItems))}
                    color={BLUE_COLOR}
                    showActions
                    totalCount={filteredActiveReports.length}
                    page={pageActive}
                    rowsPerPage={rowsPerPageActive}
                    onPageChange={handleChangePageActive}
                    onRowsPerPageChange={handleChangeRowsPerPageActive}
                />
            </Section>

            {/* Locked/Deleted History Section */}
            <Section
                title="Lock/Delete History"
                color={TEAL_COLOR}
                count={filteredHistoryReports.length}
                selectedCount={selectedHistory.size}
                onDelete={() => confirmDelete(selectedHistory, 'History')}
                showTimer={false}
            >
                <HistoryTable
                    items={historyPageItems}
                    selected={selectedHistory}
                    onToggleSelect={(id) => toggleSelection(setSelectedHistory, id)}
                    onToggleAll={() => setSelectedHistory(toggleAllSelection(selectedHistory, filteredHistoryReports, historyPageItems))}
                    color={TEAL_COLOR}
                    totalCount={filteredHistoryReports.length}
                    page={pageHistory}
                    rowsPerPage={rowsPerPageHistory}
                    onPageChange={handleChangePageHistory}
                    onRowsPerPageChange={handleChangeRowsPerPageHistory}
                />
            </Section>

            {/* History Modal */}
            <Modal
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                aria-labelledby="history-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    width: '95%',
                    maxWidth: 1400,
                    maxHeight: '90vh',
                    bgcolor: 'white',
                    borderRadius: '8px',
                    boxShadow: 24,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
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
                                    RME History
                                </Typography>
                                <Typography variant="body2" sx={{
                                    fontSize: '0.85rem',
                                    color: GRAY_COLOR,
                                }}>
                                    {filteredHistoryReports.length} historical events • View lock/delete history
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => setHistoryModalOpen(false)}
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
                    </Box>

                    <Box sx={{
                        p: 1.5,
                        borderBottom: `1px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: 250,
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={historySearch}
                                    onChange={(e) => setHistorySearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px 8px 36px',
                                        fontSize: '0.8rem',
                                        border: `1px solid ${alpha(GRAY_COLOR, 0.3)}`,
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        outline: 'none',
                                        height: '36px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <Search
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: GRAY_COLOR,
                                    }}
                                />
                                {historySearch && (
                                    <IconButton
                                        size="small"
                                        onClick={() => setHistorySearch('')}
                                        sx={{
                                            position: 'absolute',
                                            right: '4px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            padding: '2px',
                                        }}
                                    >
                                        <X size={14} />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Printer size={14} />}
                                onClick={() => window.print()}
                                sx={{
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    color: BLUE_COLOR,
                                    borderColor: alpha(BLUE_COLOR, 0.3),
                                    '&:hover': {
                                        borderColor: BLUE_COLOR,
                                        backgroundColor: alpha(BLUE_COLOR, 0.05),
                                    },
                                }}
                            >
                                Print Report
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        {filteredHistoryReports.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <History size={48} color={alpha(GRAY_COLOR, 0.3)} />
                                <Typography variant="body2" sx={{
                                    mt: 2,
                                    color: GRAY_COLOR,
                                    fontSize: '0.9rem',
                                }}>
                                    No history records found
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{
                                            bgcolor: alpha(PURPLE_COLOR, 0.04),
                                            '& th': {
                                                borderBottom: `2px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                                                fontWeight: 600,
                                                fontSize: '0.8rem',
                                                color: TEXT_COLOR,
                                                py: 1.5,
                                            }
                                        }}>
                                            <TableCell padding="checkbox" width={50}>
                                                <Checkbox
                                                    size="small"
                                                    checked={historyModalPageItems.length > 0 && historyModalPageItems.every(item => selectedHistoryItems.has(item.id))}
                                                    indeterminate={historyModalPageItems.length > 0 && historyModalPageItems.some(item => selectedHistoryItems.has(item.id)) && !historyModalPageItems.every(item => selectedHistoryItems.has(item.id))}
                                                    onChange={toggleAllHistorySelection}
                                                    sx={{ padding: '4px' }}
                                                />
                                            </TableCell>
                                            <TableCell>Report ID</TableCell>
                                            <TableCell>Action</TableCell>
                                            <TableCell>Address</TableCell>
                                            <TableCell>By</TableCell>
                                            <TableCell>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historyModalPageItems.map((item) => {
                                            const isSelected = selectedHistoryItems.has(item.id);

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
                                                            onChange={() => toggleHistorySelection(item.id)}
                                                            sx={{ padding: '4px' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{
                                                            fontSize: '0.85rem',
                                                            fontWeight: 500,
                                                            color: TEXT_COLOR,
                                                        }}>
                                                            {item.reportId}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={item.status}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                height: '20px',
                                                                backgroundColor: alpha(item.statusColor, 0.1),
                                                                color: item.statusColor,
                                                                border: `1px solid ${alpha(item.statusColor, 0.2)}`,
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{
                                                            fontSize: '0.85rem',
                                                            color: TEXT_COLOR,
                                                            mb: 0.5,
                                                        }}>
                                                            {item.address.split(' - ')[0]}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            fontSize: '0.75rem',
                                                            color: GRAY_COLOR,
                                                        }}>
                                                            {item.address.split(' - ')[1]}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" sx={{
                                                                fontSize: '0.85rem',
                                                                color: TEXT_COLOR,
                                                            }}>
                                                                {item.by}
                                                            </Typography>
                                                            {item.byEmail && (
                                                                <Typography variant="caption" sx={{
                                                                    fontSize: '0.75rem',
                                                                    color: GRAY_COLOR,
                                                                }}>
                                                                    {item.byEmail}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{
                                                            fontSize: '0.85rem',
                                                            color: TEXT_COLOR,
                                                        }}>
                                                            {formatDate(item.actionTime)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            fontSize: '0.75rem',
                                                            color: GRAY_COLOR,
                                                        }}>
                                                            {new Date(item.actionTime).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>

                    {filteredHistoryReports.length > 0 && (
                        <Box sx={{
                            borderTop: `1px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                            p: 1,
                        }}>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={filteredHistoryReports.length}
                                rowsPerPage={historyRowsPerPage}
                                page={historyPage}
                                onPageChange={handleChangeHistoryPage}
                                onRowsPerPageChange={handleChangeHistoryRowsPerPage}
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'white',
                        borderRadius: '6px',
                        border: `1px solid ${alpha(RED_COLOR, 0.1)}`,
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${alpha(RED_COLOR, 0.1)}`,
                    pb: 1.5,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(RED_COLOR, 0.1),
                            color: RED_COLOR,
                        }}>
                            <Trash2 size={18} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{
                                color: TEXT_COLOR,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}>
                                Delete Reports
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: GRAY_COLOR,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                            }}>
                                Permanently delete selected reports
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5, pb: 1.5 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: TEXT_COLOR,
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            mb: 2,
                        }}
                    >
                        Are you sure you want to permanently delete <strong>{selectedForDeletion.size} report(s)</strong> from the <strong>{deletionSection}</strong> section?
                    </Typography>
                    <Box sx={{
                        p: 1.5,
                        borderRadius: '6px',
                        backgroundColor: alpha(RED_COLOR, 0.05),
                        border: `1px solid ${alpha(RED_COLOR, 0.1)}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                    }}>
                        <AlertTriangle size={18} color={RED_COLOR} />
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: RED_COLOR,
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    mb: 0.5,
                                }}
                            >
                                Warning: This action cannot be undone
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: TEXT_COLOR,
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                }}
                            >
                                All selected reports will be permanently deleted and cannot be recovered.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            textTransform: 'none',
                            color: TEXT_COLOR,
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            px: 2,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={executeDelete}
                        variant="contained"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                        sx={{
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            px: 2,
                            bgcolor: RED_COLOR,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: alpha(RED_COLOR, 0.9),
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Delete Permanently
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Lock Confirmation Dialog */}
            <Dialog
                open={lockDialogOpen}
                onClose={() => setLockDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'white',
                        borderRadius: '6px',
                        border: `1px solid ${alpha(GREEN_COLOR, 0.1)}`,
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: `1px solid ${alpha(GREEN_COLOR, 0.1)}`,
                    pb: 1.5,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(GREEN_COLOR, 0.1),
                            color: GREEN_COLOR,
                        }}>
                            <Lock size={18} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{
                                color: TEXT_COLOR,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}>
                                Lock Reports
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: GRAY_COLOR,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                            }}>
                                Lock selected reports to prevent editing
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2.5, pb: 1.5 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: TEXT_COLOR,
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            mb: 2,
                        }}
                    >
                        Are you sure you want to lock <strong>{selectedForLock.size} report(s)</strong>?
                    </Typography>
                    <Box sx={{
                        p: 1.5,
                        borderRadius: '6px',
                        backgroundColor: alpha(GREEN_COLOR, 0.05),
                        border: `1px solid ${alpha(GREEN_COLOR, 0.1)}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                    }}>
                        <Lock size={18} color={GREEN_COLOR} />
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: GREEN_COLOR,
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    mb: 0.5,
                                }}
                            >
                                Note
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: TEXT_COLOR,
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                }}
                            >
                                Locked reports cannot be edited until they are unlocked. This action can be reversed.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        onClick={() => setLockDialogOpen(false)}
                        sx={{
                            textTransform: 'none',
                            color: TEXT_COLOR,
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            px: 2,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={executeLock}
                        variant="contained"
                        color="success"
                        startIcon={<Lock size={16} />}
                        sx={{
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            px: 2,
                            bgcolor: GREEN_COLOR,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: alpha(GREEN_COLOR, 0.9),
                                boxShadow: 'none',
                            },
                        }}
                    >
                        Lock Reports
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    iconMapping={{
                        success: <CheckCircle size={20} />,
                        error: <AlertCircle size={20} />,
                        warning: <AlertTriangle size={20} />,
                        info: <AlertCircle size={20} />,
                    }}
                    sx={{
                        width: '100%',
                        borderRadius: '6px',
                        backgroundColor: snackbar.severity === 'success'
                            ? alpha(GREEN_COLOR, 0.05)
                            : snackbar.severity === 'error'
                                ? alpha(RED_COLOR, 0.05)
                                : alpha(ORANGE_COLOR, 0.05),
                        borderLeft: `4px solid ${snackbar.severity === 'success' ? GREEN_COLOR : snackbar.severity === 'error' ? RED_COLOR : ORANGE_COLOR}`,
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' ? GREEN_COLOR : snackbar.severity === 'error' ? RED_COLOR : ORANGE_COLOR,
                        },
                        '& .MuiAlert-message': {
                            py: 0.5,
                        }
                    }}
                    elevation={6}
                >
                    <Typography
                        sx={{
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: TEXT_COLOR,
                        }}
                    >
                        {snackbar.message}
                    </Typography>
                </Alert>
            </Snackbar>
        </Box>
    );
};

const Section = ({
    title,
    color,
    count,
    selectedCount,
    onDelete,
    children,
    showTimer = false,
    additionalActions = null,
}) => (
    <Paper
        elevation={0}
        sx={{
            mb: 4,
            borderRadius: '6px',
            overflow: 'hidden',
            border: `1px solid ${alpha(color, 0.15)}`,
            bgcolor: 'white'
        }}
    >
        <Box
            sx={{
                p: 1.5,
                bgcolor: 'white',
                borderBottom: `1px solid ${alpha(color, 0.1)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        color: TEXT_COLOR,
                        fontWeight: 600,
                    }}
                >
                    {title}
                    <Chip
                        size="small"
                        label={count}
                        sx={{
                            ml: 1,
                            bgcolor: alpha(color, 0.08),
                            color: TEXT_COLOR,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            height: '22px',
                            '& .MuiChip-label': {
                                px: 1,
                            },
                        }}
                    />
                </Typography>
                {showTimer && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer size={16} color={GRAY_COLOR} />
                        <Typography
                            variant="body2"
                            sx={{
                                color: GRAY_COLOR,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                            }}
                        >
                            Real-time countdown active
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {additionalActions}
                {selectedCount > 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={onDelete}
                        startIcon={<Trash2 size={14} />}
                        sx={{
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            height: '30px',
                            px: 1.5,
                        }}
                    >
                        Delete ({selectedCount})
                    </Button>
                )}
            </Box>
        </Box>
        {children}
    </Paper>
);

const RMETable = ({
    items,
    selected,
    onToggleSelect,
    onToggleAll,
    color,
    showActions = false,
    totalCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const allSelectedOnPage = items.length > 0 && items.every(item => selected.has(item.id));
    const someSelectedOnPage = items.length > 0 && items.some(item => selected.has(item.id));

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{
                        bgcolor: alpha(color, 0.04),
                        '& th': {
                            borderBottom: `2px solid ${alpha(color, 0.1)}`,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: TEXT_COLOR,
                            py: 1.5,
                        }
                    }}>
                        <TableCell
                            padding="checkbox"
                            width={50}
                        >
                            <Checkbox
                                size="small"
                                checked={allSelectedOnPage}
                                indeterminate={someSelectedOnPage && !allSelectedOnPage}
                                onChange={onToggleAll}
                                sx={{
                                    color: TEXT_COLOR,
                                    padding: '4px',
                                }}
                            />
                        </TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Technician</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell align="center">Last Report</TableCell>
                        <TableCell align="center">Unlocked Report</TableCell>
                        <TableCell align="center">RME Completed</TableCell>
                        {showActions && (
                            <TableCell align="center" width={150}>Actions</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showActions ? 8 : 7} align="center" sx={{ py: 6 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}>
                                    <AlertCircle size={32} color={alpha(TEXT_COLOR, 0.2)} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: TEXT_COLOR,
                                            opacity: 0.6,
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        No records found
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map(item => {
                            const isSelected = selected.has(item.id);

                            return (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{
                                        bgcolor: isSelected ? alpha(color, 0.1) : 'white',
                                        '&:hover': {
                                            backgroundColor: alpha(color, 0.05),
                                        },
                                        '&:last-child td': {
                                            borderBottom: 'none',
                                        },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(item.id)}
                                            size="small"
                                            sx={{
                                                color: TEXT_COLOR,
                                                padding: '4px',
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: TEXT_COLOR,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    mb: 0.25,
                                                }}
                                            >
                                                {item.date}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: item.elapsedColor,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.elapsedTime}
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Avatar sx={{
                                                width: 28,
                                                height: 28,
                                                bgcolor: color,
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                            }}>
                                                {item.technicianInitial}
                                            </Avatar>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: TEXT_COLOR,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                {item.technician}
                                            </Typography>
                                        </Stack>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: TEXT_COLOR,
                                                fontSize: '0.85rem',
                                                fontWeight: 400,
                                                mb: 0.25,
                                            }}
                                        >
                                            {item.street}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: GRAY_COLOR,
                                                fontSize: '0.75rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            {[item.city, item.state, item.zip].filter(Boolean).join(', ')}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="center">
                                        {item.lastReport ? (
                                            <Tooltip title="View Last Report">
                                                <IconButton size="small" color="primary">
                                                    <FileText size={18} />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: GRAY_COLOR,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                —
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {item.unlockedReport ? (
                                            <Tooltip title="Edit Unlocked Report">
                                                <IconButton size="small" color="secondary">
                                                    <File size={18} />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Create Report">
                                                <IconButton size="small" color="default">
                                                    <Edit size={18} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {item.rmeCompleted ? (
                                            <CheckCircle size={20} color={GREEN_COLOR} />
                                        ) : (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: RED_COLOR,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Pending
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {showActions && (
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={0.5} justifyContent="center">
                                                <Tooltip title="View Report">
                                                    <IconButton size="small" color="primary">
                                                        <Eye size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Lock Report">
                                                    <IconButton size="small" color="success">
                                                        <Lock size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Report">
                                                    <IconButton size="small" color="error">
                                                        <Trash2 size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            {totalCount > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    sx={{
                        borderTop: `1px solid ${alpha(color, 0.1)}`,
                        '& .MuiTablePagination-toolbar': {
                            minHeight: '52px',
                            padding: '0 16px',
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.8rem',
                            color: TEXT_COLOR,
                            fontWeight: 400,
                        },
                        '& .MuiTablePagination-actions': {
                            marginLeft: '8px',
                        },
                        '& .MuiIconButton-root': {
                            padding: '6px',
                        },
                    }}
                />
            )}
        </TableContainer>
    );
};

const HistoryTable = ({
    items,
    selected,
    onToggleSelect,
    onToggleAll,
    color,
    totalCount,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}) => {
    const allSelectedOnPage = items.length > 0 && items.every(item => selected.has(item.id));
    const someSelectedOnPage = items.length > 0 && items.some(item => selected.has(item.id));

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{
                        bgcolor: alpha(color, 0.04),
                        '& th': {
                            borderBottom: `2px solid ${alpha(color, 0.1)}`,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: TEXT_COLOR,
                            py: 1.5,
                        }
                    }}>
                        <TableCell
                            padding="checkbox"
                            width={50}
                        >
                            <Checkbox
                                size="small"
                                checked={allSelectedOnPage}
                                indeterminate={someSelectedOnPage && !allSelectedOnPage}
                                onChange={onToggleAll}
                                sx={{
                                    color: TEXT_COLOR,
                                    padding: '4px',
                                }}
                            />
                        </TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>By</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}>
                                    <History size={32} color={alpha(TEXT_COLOR, 0.2)} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: TEXT_COLOR,
                                            opacity: 0.6,
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        No history records found
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map(item => {
                            const isSelected = selected.has(item.id);

                            return (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{
                                        bgcolor: isSelected ? alpha(color, 0.1) : 'white',
                                        '&:hover': {
                                            backgroundColor: alpha(color, 0.05),
                                        },
                                        '&:last-child td': {
                                            borderBottom: 'none',
                                        },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(item.id)}
                                            size="small"
                                            sx={{
                                                color: TEXT_COLOR,
                                                padding: '4px',
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            size="small"
                                            sx={{
                                                fontSize: '0.7rem',
                                                height: '20px',
                                                backgroundColor: alpha(item.statusColor, 0.1),
                                                color: item.statusColor,
                                                border: `1px solid ${alpha(item.statusColor, 0.2)}`,
                                                fontWeight: 500,
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: TEXT_COLOR,
                                                fontSize: '0.85rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            {item.date}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: TEXT_COLOR,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.by}
                                            </Typography>
                                            {item.byEmail && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: GRAY_COLOR,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 400,
                                                    }}
                                                >
                                                    {item.byEmail}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>

            {totalCount > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    sx={{
                        borderTop: `1px solid ${alpha(color, 0.1)}`,
                        '& .MuiTablePagination-toolbar': {
                            minHeight: '52px',
                            padding: '0 16px',
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.8rem',
                            color: TEXT_COLOR,
                            fontWeight: 400,
                        },
                        '& .MuiTablePagination-actions': {
                            marginLeft: '8px',
                        },
                        '& .MuiIconButton-root': {
                            padding: '6px',
                        },
                    }}
                />
            )}
        </TableContainer>
    );
};

export default RMEReports;