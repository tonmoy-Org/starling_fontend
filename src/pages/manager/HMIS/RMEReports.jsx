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
    TablePagination,
    Modal,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
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
    CheckCheck,
    Eye,
    Lock,
    Printer,
    History,
    Edit,
    FileText,
    File,
    FileSpreadsheet,
    AlertOctagon,
    FolderOpen,
    FolderCheck,
    Archive,
    Download,
    Upload,
    MoreVertical,
    Filter,
    Calendar,
    MapPin,
    User,
    Shield,
    ShieldOff,
    Save,
} from 'lucide-react';

const TEXT_COLOR = '#0F1115';
const BLUE_COLOR = '#1976d2';
const GREEN_COLOR = '#10b981';
const RED_COLOR = '#ef4444';
const ORANGE_COLOR = '#ed6c02';
const GRAY_COLOR = '#6b7280';
const PURPLE_COLOR = '#8b5cf6';

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
    const [currentTime] = useState(new Date());
    const [currentUser] = useState({ name: 'John Manager', email: 'john@company.com' });

    // State for each table's selection
    const [selectedUnverified, setSelectedUnverified] = useState(new Set());
    const [selectedHolding, setSelectedHolding] = useState(new Set());
    const [selectedFinalized, setSelectedFinalized] = useState(new Set());

    // State for actions checkboxes in stage 1
    const [techReportSubmitted, setTechReportSubmitted] = useState(new Set());
    const [lockedAction, setLockedAction] = useState(new Set());
    const [waitToLockAction, setWaitToLockAction] = useState(new Set());
    const [deleteAction, setDeleteAction] = useState(new Set());

    // State for action details (for wait to lock)
    const [waitToLockDetails, setWaitToLockDetails] = useState({});

    // State for actions checkboxes in stage 2
    const [holdingLockedAction, setHoldingLockedAction] = useState(new Set());
    const [holdingDeleteAction, setHoldingDeleteAction] = useState(new Set());

    // Pagination for each table
    const [pageUnverified, setPageUnverified] = useState(0);
    const [rowsPerPageUnverified, setRowsPerPageUnverified] = useState(10);
    const [pageHolding, setPageHolding] = useState(0);
    const [rowsPerPageHolding, setRowsPerPageHolding] = useState(10);
    const [pageFinalized, setPageFinalized] = useState(0);
    const [rowsPerPageFinalized, setRowsPerPageFinalized] = useState(10);

    // Modals and dialogs
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
    const [deletionSection, setDeletionSection] = useState('');

    const [lockDialogOpen, setLockDialogOpen] = useState(false);
    const [selectedForLock, setSelectedForLock] = useState(new Set());

    const [waitToLockDialogOpen, setWaitToLockDialogOpen] = useState(false);
    const [selectedForWaitLock, setSelectedForWaitLock] = useState(new Set());
    const [waitLockReason, setWaitLockReason] = useState('');
    const [waitLockNotes, setWaitLockNotes] = useState('');

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const [historyPage, setHistoryPage] = useState(0);
    const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
    const [selectedHistoryItems, setSelectedHistoryItems] = useState(new Set());

    // Search for each section
    const [searchUnverified, setSearchUnverified] = useState('');
    const [searchHolding, setSearchHolding] = useState('');
    const [searchFinalized, setSearchFinalized] = useState('');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Simulated data for Unverified (Stage 1)
    const unverifiedReports = useMemo(() => [
        {
            id: 'uv1',
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
            techReportSubmitted: false,
            priority: 'Standard',
            status: 'Unverified',
            createdAt: '2025-12-22T08:00:00',
            timeCompleted: '08:00 AM',
        },
        {
            id: 'uv2',
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
            techReportSubmitted: true,
            priority: 'High',
            status: 'Unverified',
            createdAt: '2026-01-21T09:00:00',
            timeCompleted: '09:00 AM',
        },
        {
            id: 'uv3',
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
            techReportSubmitted: true,
            priority: 'Emergency',
            status: 'Unverified',
            createdAt: '2025-11-15T10:00:00',
            timeCompleted: '10:00 AM',
        },
        {
            id: 'uv4',
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
            techReportSubmitted: false,
            priority: 'Standard',
            status: 'Unverified',
            createdAt: '2025-12-18T11:00:00',
            timeCompleted: '11:00 AM',
        },
        {
            id: 'uv5',
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
            techReportSubmitted: true,
            priority: 'Medium',
            status: 'Unverified',
            createdAt: '2026-01-14T08:30:00',
            timeCompleted: '08:30 AM',
        },
        {
            id: 'uv6',
            date: '01/20/2026',
            elapsedTime: '18 HOURS',
            elapsedColor: GREEN_COLOR,
            technician: 'Eric',
            technicianInitial: 'E',
            address: '456 PINE RD - Seattle WA 98101',
            street: '456 PINE RD',
            city: 'Seattle',
            state: 'WA',
            zip: '98101',
            lastReport: true,
            unlockedReport: true,
            techReportSubmitted: true,
            priority: 'High',
            status: 'Unverified',
            createdAt: '2026-01-20T14:00:00',
            timeCompleted: '02:00 PM',
        },
        {
            id: 'uv7',
            date: '01/19/2026',
            elapsedTime: '30 HOURS',
            elapsedColor: ORANGE_COLOR,
            technician: 'Cameron',
            technicianInitial: 'C',
            address: '789 ELM ST - Bellevue WA 98004',
            street: '789 ELM ST',
            city: 'Bellevue',
            state: 'WA',
            zip: '98004',
            lastReport: false,
            unlockedReport: false,
            techReportSubmitted: false,
            priority: 'Standard',
            status: 'Unverified',
            createdAt: '2026-01-19T12:30:00',
            timeCompleted: '12:30 PM',
        },
    ], []);

    // Simulated data for Holding (Stage 2)
    const holdingReports = useMemo(() => [
        {
            id: 'hld1',
            date: '01/15/2026',
            elapsedTime: '120 HOURS',
            elapsedColor: RED_COLOR,
            technician: 'Jason',
            technicianInitial: 'J',
            address: '999 MAPLE AVE - Renton WA 98057',
            street: '999 MAPLE AVE',
            city: 'Renton',
            state: 'WA',
            zip: '98057',
            priorLockedReport: true,
            unlockedReportLink: true,
            reason: 'Additional Reports Needed',
            notes: 'Waiting for customer verification photos',
            status: 'Holding',
            movedToHoldingDate: '2026-01-16T10:00:00',
            createdBy: 'Office Manager',
        },
        {
            id: 'hld2',
            date: '01/18/2026',
            elapsedTime: '72 HOURS',
            elapsedColor: RED_COLOR,
            technician: 'Josh',
            technicianInitial: 'J',
            address: '777 42ND AVE - Puyallup WA 98372',
            street: '777 42ND AVE',
            city: 'Puyallup',
            state: 'WA',
            zip: '98372',
            priorLockedReport: true,
            unlockedReportLink: true,
            reason: 'Verifying Information',
            notes: 'Customer provided conflicting address information',
            status: 'Holding',
            movedToHoldingDate: '2026-01-19T09:30:00',
            createdBy: 'Quality Control',
        },
        {
            id: 'hld3',
            date: '01/17/2026',
            elapsedTime: '96 HOURS',
            elapsedColor: RED_COLOR,
            technician: 'Billy',
            technicianInitial: 'B',
            address: '333 BIRCH LN - Federal Way WA 98023',
            street: '333 BIRCH LN',
            city: 'Federal Way',
            state: 'WA',
            zip: '98023',
            priorLockedReport: false,
            unlockedReportLink: true,
            reason: 'Pending Supervisor Review',
            notes: 'Unusual incident report requires supervisor approval',
            status: 'Holding',
            movedToHoldingDate: '2026-01-18T14:15:00',
            createdBy: 'Team Lead',
        },
    ], []);

    // Simulated data for Finalized (Stage 3)
    const finalizedReports = useMemo(() => [
        {
            id: 'fin1',
            status: 'LOCKED',
            statusColor: GREEN_COLOR,
            date: '01/14/2026',
            by: 'Damon',
            byEmail: 'damon@company.com',
            reportId: 'RME-2026-001',
            address: '123 MAIN ST - Kent WA 98032',
            action: 'locked',
            actionTime: '2026-01-14T14:30:00',
            technician: 'Jason',
            originalDate: '12/22/2025',
        },
        {
            id: 'fin2',
            status: 'DELETED',
            statusColor: RED_COLOR,
            date: '01/18/2026',
            by: 'Eric',
            byEmail: 'eric@company.com',
            reportId: 'RME-2026-002',
            address: '777 42ND AVE - Puyallup WA 98372',
            action: 'deleted',
            actionTime: '2026-01-18T16:45:00',
            technician: 'Josh',
            originalDate: '01/21/2026',
        },
        {
            id: 'fin3',
            status: 'DELETED',
            statusColor: RED_COLOR,
            date: '04/21/2025',
            by: 'Cameron',
            byEmail: 'cameron@company.com',
            reportId: 'RME-2025-045',
            address: '555 12TH ST - Graham WA 98338',
            action: 'deleted',
            actionTime: '2025-04-21T11:20:00',
            technician: 'Billy',
            originalDate: '11/15/2025',
        },
        {
            id: 'fin4',
            status: 'LOCKED',
            statusColor: GREEN_COLOR,
            date: '10/22/2025',
            by: 'Eric',
            byEmail: 'eric@company.com',
            reportId: 'RME-2025-089',
            address: '111 44TH DR - Eatonville WA 98328',
            action: 'locked',
            actionTime: '2025-10-22T09:15:00',
            technician: 'Jason',
            originalDate: '12/18/2025',
        },
        {
            id: 'fin5',
            status: 'LOCKED',
            statusColor: GREEN_COLOR,
            date: '01/16/2026',
            by: 'Damon',
            byEmail: 'damon@company.com',
            reportId: 'RME-2026-003',
            address: '888 OAK ST - Tacoma WA 98409',
            action: 'locked',
            actionTime: '2026-01-16T11:20:00',
            technician: 'Damon',
            originalDate: '01/14/2026',
        },
    ], []);

    // History data
    const historyReports = useMemo(() => [
        {
            id: 'hist1',
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
            id: 'hist2',
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
            id: 'hist3',
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
            id: 'hist4',
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
    ], []);

    // Filter functions for each table
    const filteredUnverifiedReports = useMemo(() => {
        if (!searchUnverified) return unverifiedReports;
        const searchLower = searchUnverified.toLowerCase();
        return unverifiedReports.filter(report =>
            report.technician.toLowerCase().includes(searchLower) ||
            report.address.toLowerCase().includes(searchLower) ||
            report.street.toLowerCase().includes(searchLower) ||
            report.city.toLowerCase().includes(searchLower)
        );
    }, [unverifiedReports, searchUnverified]);

    const filteredHoldingReports = useMemo(() => {
        if (!searchHolding) return holdingReports;
        const searchLower = searchHolding.toLowerCase();
        return holdingReports.filter(report =>
            report.technician.toLowerCase().includes(searchLower) ||
            report.address.toLowerCase().includes(searchLower) ||
            report.reason.toLowerCase().includes(searchLower) ||
            report.notes.toLowerCase().includes(searchLower)
        );
    }, [holdingReports, searchHolding]);

    const filteredFinalizedReports = useMemo(() => {
        if (!searchFinalized) return finalizedReports;
        const searchLower = searchFinalized.toLowerCase();
        return finalizedReports.filter(report =>
            report.by.toLowerCase().includes(searchLower) ||
            report.address.toLowerCase().includes(searchLower) ||
            report.technician.toLowerCase().includes(searchLower) ||
            report.status.toLowerCase().includes(searchLower)
        );
    }, [finalizedReports, searchFinalized]);

    // Pagination handlers
    const handleChangePageUnverified = (event, newPage) => {
        setPageUnverified(newPage);
    };

    const handleChangeRowsPerPageUnverified = (event) => {
        setRowsPerPageUnverified(parseInt(event.target.value, 10));
        setPageUnverified(0);
    };

    const handleChangePageHolding = (event, newPage) => {
        setPageHolding(newPage);
    };

    const handleChangeRowsPerPageHolding = (event) => {
        setRowsPerPageHolding(parseInt(event.target.value, 10));
        setPageHolding(0);
    };

    const handleChangePageFinalized = (event, newPage) => {
        setPageFinalized(newPage);
    };

    const handleChangeRowsPerPageFinalized = (event) => {
        setRowsPerPageFinalized(parseInt(event.target.value, 10));
        setPageFinalized(0);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Selection toggle functions
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

    // Handle checkbox logic for stage 1
    const handleTechReportToggle = (id) => {
        const newSet = new Set(techReportSubmitted);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
            // Uncheck Wait to Lock if checking Tech Report
            const waitToLockSet = new Set(waitToLockAction);
            waitToLockSet.delete(id);
            setWaitToLockAction(waitToLockSet);

            // Uncheck Delete if checking Tech Report
            const deleteSet = new Set(deleteAction);
            deleteSet.delete(id);
            setDeleteAction(deleteSet);
        }
        setTechReportSubmitted(newSet);
    };

    const handleLockedToggle = (id) => {
        const newSet = new Set(lockedAction);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
            // Uncheck Wait to Lock if checking Locked
            const waitToLockSet = new Set(waitToLockAction);
            waitToLockSet.delete(id);
            setWaitToLockAction(waitToLockSet);

            // Uncheck Delete if checking Locked
            const deleteSet = new Set(deleteAction);
            deleteSet.delete(id);
            setDeleteAction(deleteSet);
        }
        setLockedAction(newSet);
    };

    const handleWaitToLockToggle = (id) => {
        const newSet = new Set(waitToLockAction);
        if (newSet.has(id)) {
            newSet.delete(id);
            // Clear wait to lock details when unchecking
            const newDetails = { ...waitToLockDetails };
            delete newDetails[id];
            setWaitToLockDetails(newDetails);
        } else {
            newSet.add(id);
            // Uncheck Tech Report if checking Wait to Lock
            const techReportSet = new Set(techReportSubmitted);
            techReportSet.delete(id);
            setTechReportSubmitted(techReportSet);

            // Uncheck Locked if checking Wait to Lock
            const lockedSet = new Set(lockedAction);
            lockedSet.delete(id);
            setLockedAction(lockedSet);

            // Uncheck Delete if checking Wait to Lock
            const deleteSet = new Set(deleteAction);
            deleteSet.delete(id);
            setDeleteAction(deleteSet);

            // Initialize details for this item
            setWaitToLockDetails(prev => ({
                ...prev,
                [id]: { reason: '', notes: '' }
            }));
        }
        setWaitToLockAction(newSet);
    };

    const handleDeleteToggle = (id) => {
        const newSet = new Set(deleteAction);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
            // Uncheck Tech Report if checking Delete
            const techReportSet = new Set(techReportSubmitted);
            techReportSet.delete(id);
            setTechReportSubmitted(techReportSet);

            // Uncheck Locked if checking Delete
            const lockedSet = new Set(lockedAction);
            lockedSet.delete(id);
            setLockedAction(lockedSet);

            // Uncheck Wait to Lock if checking Delete
            const waitToLockSet = new Set(waitToLockAction);
            waitToLockSet.delete(id);
            setWaitToLockAction(waitToLockSet);
        }
        setDeleteAction(newSet);
    };

    const handleWaitToLockReasonChange = (id, reason) => {
        setWaitToLockDetails(prev => ({
            ...prev,
            [id]: { ...prev[id], reason }
        }));
    };

    const handleWaitToLockNotesChange = (id, notes) => {
        setWaitToLockDetails(prev => ({
            ...prev,
            [id]: { ...prev[id], notes }
        }));
    };

    // Action handlers
    const handleLock = (selectionSet) => {
        if (selectionSet.size === 0) return;
        setSelectedForLock(selectionSet);
        setLockDialogOpen(true);
    };

    const handleWaitToLock = (selectionSet) => {
        if (selectionSet.size === 0) return;
        setSelectedForWaitLock(selectionSet);
        setWaitToLockDialogOpen(true);
    };

    const executeLock = () => {
        console.log('Locking items:', Array.from(selectedForLock));
        showSnackbar(`${selectedForLock.size} report(s) locked and moved to Finalized`, 'success');
        setSelectedUnverified(new Set());
        setLockDialogOpen(false);
        setSelectedForLock(new Set());
    };

    const executeWaitLock = () => {
        console.log('Moving to Holding:', Array.from(selectedForWaitLock), 'Reason:', waitLockReason, 'Notes:', waitLockNotes);
        showSnackbar(`${selectedForWaitLock.size} report(s) moved to Holding`, 'success');
        setSelectedUnverified(new Set());
        setWaitToLockDialogOpen(false);
        setSelectedForWaitLock(new Set());
        setWaitLockReason('');
        setWaitLockNotes('');
    };

    const executeDelete = () => {
        console.log('Deleting items:', Array.from(selectedForDeletion));
        showSnackbar(`${selectedForDeletion.size} report(s) deleted and moved to Finalized`, 'success');
        setSelectedUnverified(new Set());
        setDeleteDialogOpen(false);
        setSelectedForDeletion(new Set());
    };

    // Handle save changes for stage 1 with checkbox logic
    const handleSaveStage1Changes = () => {
        const selectedItems = unverifiedPageItems.filter(item =>
            techReportSubmitted.has(item.id) ||
            lockedAction.has(item.id) ||
            waitToLockAction.has(item.id) ||
            deleteAction.has(item.id)
        );

        const actions = {
            lockedAndCompleted: [],
            waitToLock: [],
            deleted: [],
            invalidCombinations: []
        };

        selectedItems.forEach(item => {
            const hasTechReport = techReportSubmitted.has(item.id);
            const hasLocked = lockedAction.has(item.id);
            const hasWaitToLock = waitToLockAction.has(item.id);
            const hasDelete = deleteAction.has(item.id);

            // Check combination 1: Tech Report Submitted & Locked
            if (hasTechReport && hasLocked && !hasWaitToLock && !hasDelete) {
                actions.lockedAndCompleted.push({
                    id: item.id,
                    reportId: `RME-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    address: item.address,
                    technician: item.technician,
                    date: new Date().toLocaleDateString('en-US'),
                    by: currentUser.name,
                    byEmail: currentUser.email,
                    originalDate: item.date
                });
            }
            // Check combination 2: Tech Report Submitted & Wait to Lock
            else if (hasTechReport && hasWaitToLock && !hasLocked && !hasDelete) {
                const details = waitToLockDetails[item.id] || { reason: '', notes: '' };
                if (details.reason) {
                    actions.waitToLock.push({
                        id: item.id,
                        address: item.address,
                        technician: item.technician,
                        reason: details.reason,
                        notes: details.notes,
                        date: item.date,
                        movedToHoldingDate: new Date().toISOString(),
                        createdBy: currentUser.name
                    });
                } else {
                    actions.invalidCombinations.push({
                        id: item.id,
                        address: item.address,
                        error: 'Missing reason for Wait to Lock'
                    });
                }
            }
            // Check combination 3: Delete
            else if (hasDelete && !hasTechReport && !hasLocked && !hasWaitToLock) {
                actions.deleted.push({
                    id: item.id,
                    reportId: `RME-${new Date().getFullYear()}-DEL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                    address: item.address,
                    technician: item.technician,
                    date: new Date().toLocaleDateString('en-US'),
                    by: currentUser.name,
                    byEmail: currentUser.email,
                    originalDate: item.date
                });
            }
            // Invalid combinations
            else {
                actions.invalidCombinations.push({
                    id: item.id,
                    address: item.address,
                    error: 'Invalid checkbox combination'
                });
            }
        });

        console.log('Processing Stage 1 actions:', actions);

        // Show summary of actions
        let message = '';
        if (actions.lockedAndCompleted.length > 0) {
            message += `${actions.lockedAndCompleted.length} report(s) sent to Finalized as "completed" by ${currentUser.name}. `;
        }
        if (actions.waitToLock.length > 0) {
            message += `${actions.waitToLock.length} report(s) moved to Holding. `;
        }
        if (actions.deleted.length > 0) {
            message += `${actions.deleted.length} report(s) sent to Finalized as "Deleted" by ${currentUser.name}. `;
        }
        if (actions.invalidCombinations.length > 0) {
            message += `${actions.invalidCombinations.length} report(s) have invalid checkbox combinations.`;
        }

        if (message) {
            showSnackbar(message, actions.invalidCombinations.length > 0 ? 'warning' : 'success');
        } else {
            showSnackbar('No changes to save', 'info');
        }

        // Clear checkboxes after processing
        setTechReportSubmitted(new Set());
        setLockedAction(new Set());
        setWaitToLockAction(new Set());
        setDeleteAction(new Set());
        setWaitToLockDetails({});
    };

    // Handle save changes for stage 2
    const handleSaveStage2Changes = () => {
        const selectedIds = Array.from(selectedHolding);
        const lockedIds = Array.from(holdingLockedAction);
        const deleteIds = Array.from(holdingDeleteAction);

        console.log('Saving Stage 2 changes:', {
            selectedIds,
            lockedIds,
            deleteIds
        });

        showSnackbar('Stage 2 changes saved successfully', 'success');

        // Clear checkboxes after processing
        setHoldingLockedAction(new Set());
        setHoldingDeleteAction(new Set());
    };

    // Paginated items
    const unverifiedPageItems = filteredUnverifiedReports.slice(
        pageUnverified * rowsPerPageUnverified,
        pageUnverified * rowsPerPageUnverified + rowsPerPageUnverified
    );

    const holdingPageItems = filteredHoldingReports.slice(
        pageHolding * rowsPerPageHolding,
        pageHolding * rowsPerPageHolding + rowsPerPageHolding
    );

    const finalizedPageItems = filteredFinalizedReports.slice(
        pageFinalized * rowsPerPageFinalized,
        pageFinalized * rowsPerPageFinalized + rowsPerPageFinalized
    );

    const historyModalPageItems = historyReports.slice(
        historyPage * historyRowsPerPage,
        historyPage * historyRowsPerPage + historyRowsPerPage
    );

    return (
        <Box sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
                        RME Report Tracking
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: GRAY_COLOR,
                            fontSize: '0.8rem',
                            fontWeight: 400,
                        }}
                    >
                        Track RME reports through 3 stages: Unverified → Holding → Finalized. Manage workflow efficiently.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<History size={18} />}
                    onClick={() => setHistoryModalOpen(true)}
                    sx={{
                        textTransform: 'none',
                        fontSize: '0.9rem',
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

            {/* Legend for checkboxes */}
            <Box sx={{ mb: 3, p: 2, bgcolor: alpha(BLUE_COLOR, 0.05), borderRadius: '8px', border: `1px solid ${alpha(BLUE_COLOR, 0.2)}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: BLUE_COLOR }}>
                    Checkbox Legend (Stage 1)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox size="small" checked readOnly sx={{ padding: 0 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>TECH REPORT SUBMITTED</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox size="small" checked readOnly sx={{ padding: 0 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>LOCKED</Typography>
                        <Typography variant="caption" sx={{ color: GRAY_COLOR, ml: 1 }}>
                            → Send to Finalized as "completed" by manager
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox size="small" checked readOnly sx={{ padding: 0 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>WAIT TO LOCK</Typography>
                        <Typography variant="caption" sx={{ color: GRAY_COLOR, ml: 1 }}>
                            → Move to Holding with reason
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox size="small" checked readOnly sx={{ padding: 0 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>DELETE</Typography>
                        <Typography variant="caption" sx={{ color: GRAY_COLOR, ml: 1 }}>
                            → Send to Finalized as "Deleted"
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="caption" sx={{ color: RED_COLOR, mt: 1, display: 'block', fontWeight: 500 }}>
                    Note: Only one checkbox per row can be selected (except Tech Report + Locked combination)
                </Typography>
            </Box>

            {/* Stage 1: Unverified Reports */}
            <Section
                title="Stage 1: Unverified"
                color={BLUE_COLOR}
                count={filteredUnverifiedReports.length}
                selectedCount={selectedUnverified.size}
                icon={<FileSpreadsheet size={20} />}
                subtitle="New reports awaiting verification"
                additionalActions={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SearchInput
                            value={searchUnverified}
                            onChange={setSearchUnverified}
                            placeholder="Search unverified..."
                        />
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={handleSaveStage1Changes}
                            startIcon={<Save size={16} />}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.8rem',
                                height: '32px',
                                px: 1.5,
                                backgroundColor: ORANGE_COLOR,
                                '&:hover': {
                                    backgroundColor: alpha(ORANGE_COLOR, 0.9),
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                }
            >
                <UnverifiedTable
                    items={unverifiedPageItems}
                    selected={selectedUnverified}
                    onToggleSelect={(id) => toggleSelection(setSelectedUnverified, id)}
                    onToggleAll={() => setSelectedUnverified(toggleAllSelection(selectedUnverified, filteredUnverifiedReports, unverifiedPageItems))}
                    techReportSubmitted={techReportSubmitted}
                    onTechReportToggle={handleTechReportToggle}
                    lockedAction={lockedAction}
                    onLockedToggle={handleLockedToggle}
                    waitToLockAction={waitToLockAction}
                    onWaitToLockToggle={handleWaitToLockToggle}
                    deleteAction={deleteAction}
                    onDeleteToggle={handleDeleteToggle}
                    waitToLockDetails={waitToLockDetails}
                    onWaitToLockReasonChange={handleWaitToLockReasonChange}
                    onWaitToLockNotesChange={handleWaitToLockNotesChange}
                    color={BLUE_COLOR}
                    totalCount={filteredUnverifiedReports.length}
                    page={pageUnverified}
                    rowsPerPage={rowsPerPageUnverified}
                    onPageChange={handleChangePageUnverified}
                    onRowsPerPageChange={handleChangeRowsPerPageUnverified}
                />
            </Section>

            {/* Stage 2: Holding Reports */}
            <Section
                title="Stage 2: Holding"
                color={ORANGE_COLOR}
                count={filteredHoldingReports.length}
                selectedCount={selectedHolding.size}
                icon={<AlertOctagon size={20} />}
                subtitle="Reports on hold pending additional information"
                additionalActions={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SearchInput
                            value={searchHolding}
                            onChange={setSearchHolding}
                            placeholder="Search holding..."
                        />
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={handleSaveStage2Changes}
                            startIcon={<Save size={16} />}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.8rem',
                                height: '32px',
                                px: 1.5,
                                backgroundColor: ORANGE_COLOR,
                                '&:hover': {
                                    backgroundColor: alpha(ORANGE_COLOR, 0.9),
                                },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Stack>
                }
            >
                <HoldingTable
                    items={holdingPageItems}
                    selected={selectedHolding}
                    onToggleSelect={(id) => toggleSelection(setSelectedHolding, id)}
                    onToggleAll={() => setSelectedHolding(toggleAllSelection(selectedHolding, filteredHoldingReports, holdingPageItems))}
                    lockedAction={holdingLockedAction}
                    onLockedToggle={(id) => toggleSelection(setHoldingLockedAction, id)}
                    deleteAction={holdingDeleteAction}
                    onDeleteToggle={(id) => toggleSelection(setHoldingDeleteAction, id)}
                    color={ORANGE_COLOR}
                    totalCount={filteredHoldingReports.length}
                    page={pageHolding}
                    rowsPerPage={rowsPerPageHolding}
                    onPageChange={handleChangePageHolding}
                    onRowsPerPageChange={handleChangeRowsPerPageHolding}
                />
            </Section>

            {/* Stage 3: Finalized Reports */}
            <Section
                title="Stage 3: Finalized"
                color={GREEN_COLOR}
                count={filteredFinalizedReports.length}
                selectedCount={selectedFinalized.size}
                icon={<CheckCircle size={20} />}
                subtitle="Completed reports - Locked or Deleted"
                additionalActions={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SearchInput
                            value={searchFinalized}
                            onChange={setSearchFinalized}
                            placeholder="Search finalized..."
                        />
                    </Stack>
                }
            >
                <FinalizedTable
                    items={finalizedPageItems}
                    selected={selectedFinalized}
                    onToggleSelect={(id) => toggleSelection(setSelectedFinalized, id)}
                    onToggleAll={() => setSelectedFinalized(toggleAllSelection(selectedFinalized, filteredFinalizedReports, finalizedPageItems))}
                    color={GREEN_COLOR}
                    totalCount={filteredFinalizedReports.length}
                    page={pageFinalized}
                    rowsPerPage={rowsPerPageFinalized}
                    onPageChange={handleChangePageFinalized}
                    onRowsPerPageChange={handleChangeRowsPerPageFinalized}
                />
            </Section>

            {/* History Modal */}
            <HistoryModal
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                historySearch={historySearch}
                setHistorySearch={setHistorySearch}
                historyReports={historyReports}
                filteredHistoryReports={historyReports}
                historyPage={historyPage}
                historyRowsPerPage={historyRowsPerPage}
                onPageChange={(event, newPage) => setHistoryPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setHistoryRowsPerPage(parseInt(event.target.value, 10));
                    setHistoryPage(0);
                }}
                selectedHistoryItems={selectedHistoryItems}
                toggleHistorySelection={(id) => {
                    setSelectedHistoryItems(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(id)) newSet.delete(id);
                        else newSet.add(id);
                        return newSet;
                    });
                }}
                toggleAllHistorySelection={() => {
                    const currentPageItems = historyModalPageItems;
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
                }}
            />

            {/* Wait to Lock Dialog */}
            <Dialog
                open={waitToLockDialogOpen}
                onClose={() => setWaitToLockDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Clock size={24} color={ORANGE_COLOR} />
                        <Typography variant="h6">Wait to Lock Reports</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Moving {selectedForWaitLock.size} report(s) to Holding stage.
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Reason for Holding</InputLabel>
                        <Select
                            value={waitLockReason}
                            onChange={(e) => setWaitLockReason(e.target.value)}
                            label="Reason for Holding"
                        >
                            <MenuItem value="Additional Reports Needed">Additional Reports Needed</MenuItem>
                            <MenuItem value="Verifying Information">Verifying Information</MenuItem>
                            <MenuItem value="Pending Supervisor Review">Pending Supervisor Review</MenuItem>
                            <MenuItem value="Customer Follow-up Required">Customer Follow-up Required</MenuItem>
                            <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Additional Notes"
                        value={waitLockNotes}
                        onChange={(e) => setWaitLockNotes(e.target.value)}
                        placeholder="Enter specific details about why the RME will not be locked today..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWaitToLockDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={executeWaitLock}
                        disabled={!waitLockReason}
                        sx={{ bgcolor: ORANGE_COLOR }}
                    >
                        Move to Holding
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Lock Confirmation Dialog */}
            <Dialog
                open={lockDialogOpen}
                onClose={() => setLockDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Lock size={24} color={GREEN_COLOR} />
                        <Typography variant="h6">Lock Reports</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Are you sure you want to lock {selectedForLock.size} report(s) and move them to Finalized?
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Locked reports cannot be edited until they are unlocked by a manager.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLockDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={executeLock} sx={{ bgcolor: GREEN_COLOR }}>
                        Lock Reports
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Trash2 size={24} color={RED_COLOR} />
                        <Typography variant="h6">Delete Reports</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Are you sure you want to delete {selectedForDeletion.size} report(s) from {deletionSection}?
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Deleted reports will be moved to Finalized as "Deleted" and cannot be recovered.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={executeDelete} sx={{ bgcolor: RED_COLOR }}>
                        Delete Reports
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Section Component
const Section = ({
    title,
    color,
    count,
    selectedCount,
    children,
    icon,
    subtitle,
    additionalActions = null,
}) => (
    <Paper
        elevation={0}
        sx={{
            mb: 4,
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${alpha(color, 0.2)}`,
            bgcolor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
    >
        <Box
            sx={{
                p: 2,
                bgcolor: alpha(color, 0.05),
                borderBottom: `1px solid ${alpha(color, 0.1)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(color, 0.1),
                    color: color,
                }}>
                    {icon}
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                color: TEXT_COLOR,
                                fontWeight: 600,
                            }}
                        >
                            {title}
                        </Typography>
                        <Chip
                            size="small"
                            label={count}
                            sx={{
                                bgcolor: alpha(color, 0.15),
                                color: color,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                height: '22px',
                            }}
                        />
                    </Box>
                    {subtitle && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: GRAY_COLOR,
                                fontSize: '0.8rem',
                                mt: 0.25,
                                display: 'block',
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {selectedCount > 0 && (
                    <Typography variant="caption" sx={{ color: color, fontWeight: 500 }}>
                        {selectedCount} selected
                    </Typography>
                )}
                {additionalActions}
            </Box>
        </Box>
        {children}
    </Paper>
);

// Search Input Component
const SearchInput = ({ value, onChange, placeholder }) => (
    <Box sx={{ position: 'relative', width: 200 }}>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '0.85rem',
                border: `1px solid ${alpha(GRAY_COLOR, 0.3)}`,
                borderRadius: '6px',
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
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: GRAY_COLOR,
            }}
        />
        {value && (
            <IconButton
                size="small"
                onClick={() => onChange('')}
                sx={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px',
                }}
            >
                <X size={14} />
            </IconButton>
        )}
    </Box>
);

// Unverified Table Component
const UnverifiedTable = ({
    items,
    selected,
    onToggleSelect,
    onToggleAll,
    techReportSubmitted,
    onTechReportToggle,
    lockedAction,
    onLockedToggle,
    waitToLockAction,
    onWaitToLockToggle,
    deleteAction,
    onDeleteToggle,
    waitToLockDetails,
    onWaitToLockReasonChange,
    onWaitToLockNotesChange,
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
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{
                            bgcolor: alpha(color, 0.05),
                            '& th': {
                                borderBottom: `2px solid ${alpha(color, 0.2)}`,
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: TEXT_COLOR,
                                py: 1.5,
                            }
                        }}>
                            <TableCell padding="checkbox" width={50}>
                                <Checkbox
                                    size="small"
                                    checked={allSelectedOnPage}
                                    indeterminate={someSelectedOnPage && !allSelectedOnPage}
                                    onChange={onToggleAll}
                                    sx={{ padding: '6px' }}
                                />
                            </TableCell>
                            <TableCell>W.O Date & Elapsed Time</TableCell>
                            <TableCell>Technician</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell align="center">Last Report</TableCell>
                            <TableCell align="center">Unlocked Report</TableCell>
                            <TableCell align="center">TECH REPORT SUBMITTED</TableCell>
                            <TableCell align="center">LOCKED</TableCell>
                            <TableCell align="center">WAIT TO LOCK</TableCell>
                            <TableCell align="center">DELETE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <FileSpreadsheet size={40} color={alpha(TEXT_COLOR, 0.2)} />
                                        <Typography variant="body2" sx={{ color: GRAY_COLOR }}>
                                            No unverified reports found
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => {
                                const isSelected = selected.has(item.id);
                                const isTechReportSubmitted = techReportSubmitted.has(item.id);
                                const isLocked = lockedAction.has(item.id);
                                const isWaitToLock = waitToLockAction.has(item.id);
                                const isDelete = deleteAction.has(item.id);
                                const details = waitToLockDetails[item.id] || { reason: '', notes: '' };

                                return (
                                    <React.Fragment key={item.id}>
                                        <TableRow
                                            hover
                                            sx={{
                                                bgcolor: isSelected ? alpha(color, 0.08) : 'white',
                                                '&:hover': { backgroundColor: alpha(color, 0.05) },
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    size="small"
                                                    checked={isSelected}
                                                    onChange={() => onToggleSelect(item.id)}
                                                    sx={{ padding: '6px' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_COLOR }}>
                                                        {item.date}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        color: item.elapsedColor,
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5
                                                    }}>
                                                        <Timer size={12} />
                                                        {item.elapsedTime}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: color,
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600
                                                    }}>
                                                        {item.technicianInitial}
                                                    </Avatar>
                                                    <Typography variant="body2">{item.technician}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {item.street}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: GRAY_COLOR }}>
                                                    {item.city}, {item.state} {item.zip}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.lastReport ? (
                                                    <Tooltip title="View Last Locked Report">
                                                        <IconButton size="small" color="primary">
                                                            <FileText size={20} />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography variant="caption" sx={{ color: GRAY_COLOR }}>—</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.unlockedReport ? (
                                                    <Tooltip title="Edit Unlocked Report">
                                                        <IconButton size="small" color="secondary">
                                                            <File size={20} />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="No Unlocked Report">
                                                        <Typography variant="caption" sx={{ color: GRAY_COLOR }}>—</Typography>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    size="small"
                                                    checked={isTechReportSubmitted}
                                                    onChange={() => onTechReportToggle(item.id)}
                                                    disabled={isWaitToLock || isDelete}
                                                    sx={{ padding: '6px' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    size="small"
                                                    checked={isLocked}
                                                    onChange={() => onLockedToggle(item.id)}
                                                    disabled={isWaitToLock || isDelete || !isTechReportSubmitted}
                                                    sx={{ padding: '6px' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    size="small"
                                                    checked={isWaitToLock}
                                                    onChange={() => onWaitToLockToggle(item.id)}
                                                    disabled={isLocked || isDelete}
                                                    sx={{ padding: '6px' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    size="small"
                                                    checked={isDelete}
                                                    onChange={() => onDeleteToggle(item.id)}
                                                    disabled={isTechReportSubmitted || isLocked || isWaitToLock}
                                                    sx={{ padding: '6px' }}
                                                />
                                            </TableCell>
                                        </TableRow>

                                        {/* Wait to Lock Details Row */}
                                        {isWaitToLock && (
                                            <TableRow sx={{ bgcolor: alpha('#ff9800', 0.05) }}>
                                                <TableCell colSpan={10} sx={{ p: 2 }}>
                                                    <Box sx={{ pl: 6 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1, color: '#ff9800' }}>
                                                            Additional Information Required:
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                                                <InputLabel>Reason in Holding</InputLabel>
                                                                <Select
                                                                    value={details.reason}
                                                                    onChange={(e) => onWaitToLockReasonChange(item.id, e.target.value)}
                                                                    label="Reason in Holding"
                                                                >
                                                                    <MenuItem value="Additional Reports Needed">Additional Reports Needed</MenuItem>
                                                                    <MenuItem value="Verifying Information">Verifying Information</MenuItem>
                                                                    <MenuItem value="Pending Supervisor Review">Pending Supervisor Review</MenuItem>
                                                                    <MenuItem value="Customer Follow-up Required">Customer Follow-up Required</MenuItem>
                                                                    <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                                                                    <MenuItem value="Other">Other</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <TextField
                                                                size="small"
                                                                multiline
                                                                rows={2}
                                                                label="Notes"
                                                                value={details.notes}
                                                                onChange={(e) => onWaitToLockNotesChange(item.id, e.target.value)}
                                                                placeholder="Enter specific details about why the RME will not be locked today..."
                                                                sx={{ flex: 1 }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
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
                            '& .MuiTablePagination-toolbar': { minHeight: '52px' },
                        }}
                    />
                )}
            </TableContainer>
            {items.length > 0 && (
                <Box sx={{
                    p: 2,
                    bgcolor: alpha('#ff9800', 0.1),
                    borderTop: `1px solid ${alpha('#ff9800', 0.2)}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <AlertTriangle size={18} color="#ff9800" />
                    <Typography variant="caption" sx={{ color: '#ff9800', fontWeight: 500 }}>
                        Warning: Please save your changes before leaving this page
                    </Typography>
                </Box>
            )}
        </>
    );
};

// Holding Table Component
const HoldingTable = ({
    items,
    selected,
    onToggleSelect,
    onToggleAll,
    lockedAction,
    onLockedToggle,
    deleteAction,
    onDeleteToggle,
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
                        bgcolor: alpha(color, 0.05),
                        '& th': {
                            borderBottom: `2px solid ${alpha(color, 0.2)}`,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: TEXT_COLOR,
                            py: 1.5,
                        }
                    }}>
                        <TableCell padding="checkbox" width={50}>
                            <Checkbox
                                size="small"
                                checked={allSelectedOnPage}
                                indeterminate={someSelectedOnPage && !allSelectedOnPage}
                                onChange={onToggleAll}
                                sx={{ padding: '6px' }}
                            />
                        </TableCell>
                        <TableCell>W.O Date & Elapsed Time</TableCell>
                        <TableCell>Technician</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell align="center">Prior Locked Report</TableCell>
                        <TableCell align="center">Unlocked Report Link</TableCell>
                        <TableCell>Reason in Holding</TableCell>
                        <TableCell align="center">LOCKED</TableCell>
                        <TableCell align="center">DELETE</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <AlertOctagon size={40} color={alpha(TEXT_COLOR, 0.2)} />
                                    <Typography variant="body2" sx={{ color: GRAY_COLOR }}>
                                        No reports in holding
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const isSelected = selected.has(item.id);
                            const isLocked = lockedAction.has(item.id);
                            const isDelete = deleteAction.has(item.id);

                            return (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{
                                        bgcolor: isSelected ? alpha(color, 0.08) : 'white',
                                        '&:hover': { backgroundColor: alpha(color, 0.05) },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            size="small"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(item.id)}
                                            sx={{ padding: '6px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: TEXT_COLOR }}>
                                                {item.date}
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                color: item.elapsedColor,
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5
                                            }}>
                                                <Clock size={12} />
                                                {item.elapsedTime}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Avatar sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: color,
                                                fontSize: '0.85rem',
                                                fontWeight: 600
                                            }}>
                                                {item.technicianInitial}
                                            </Avatar>
                                            <Typography variant="body2">{item.technician}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {item.street}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: GRAY_COLOR }}>
                                            {item.city}, {item.state} {item.zip}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.priorLockedReport ? (
                                            <Tooltip title="View Prior Locked Report">
                                                <IconButton size="small" color="primary">
                                                    <FileText size={20} />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: GRAY_COLOR }}>—</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {item.unlockedReportLink ? (
                                            <Tooltip title="Edit Unlocked Report">
                                                <IconButton size="small" color="secondary">
                                                    <Edit size={20} />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: GRAY_COLOR }}>—</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.reason}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha(color, 0.1),
                                                color: color,
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            checked={isLocked}
                                            onChange={() => onLockedToggle(item.id)}
                                            disabled={isDelete}
                                            sx={{ padding: '6px' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            size="small"
                                            checked={isDelete}
                                            onChange={() => onDeleteToggle(item.id)}
                                            disabled={isLocked}
                                            sx={{ padding: '6px' }}
                                        />
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
                        '& .MuiTablePagination-toolbar': { minHeight: '52px' },
                    }}
                />
            )}
        </TableContainer>
    );
};

// Finalized Table Component
const FinalizedTable = ({
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
                        bgcolor: alpha(color, 0.05),
                        '& th': {
                            borderBottom: `2px solid ${alpha(color, 0.2)}`,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: TEXT_COLOR,
                            py: 1.5,
                        }
                    }}>
                        <TableCell padding="checkbox" width={50}>
                            <Checkbox
                                size="small"
                                checked={allSelectedOnPage}
                                indeterminate={someSelectedOnPage && !allSelectedOnPage}
                                onChange={onToggleAll}
                                sx={{ padding: '6px' }}
                            />
                        </TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>By Manager</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle size={40} color={alpha(TEXT_COLOR, 0.2)} />
                                    <Typography variant="body2" sx={{ color: GRAY_COLOR }}>
                                        No finalized reports
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const isSelected = selected.has(item.id);

                            return (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{
                                        bgcolor: isSelected ? alpha(color, 0.08) : 'white',
                                        '&:hover': { backgroundColor: alpha(color, 0.05) },
                                    }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            size="small"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(item.id)}
                                            sx={{ padding: '6px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha(item.statusColor, 0.1),
                                                color: item.statusColor,
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {item.date}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {item.by}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: GRAY_COLOR }}>
                                                {item.byEmail}
                                            </Typography>
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
                        '& .MuiTablePagination-toolbar': { minHeight: '52px' },
                    }}
                />
            )}
        </TableContainer>
    );
};

// History Modal Component
const HistoryModal = ({
    open,
    onClose,
    historySearch,
    setHistorySearch,
    historyReports,
    filteredHistoryReports,
    historyPage,
    historyRowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    selectedHistoryItems,
    toggleHistorySelection,
    toggleAllHistorySelection,
}) => {
    const historyModalPageItems = filteredHistoryReports.slice(
        historyPage * historyRowsPerPage,
        historyPage * historyRowsPerPage + historyRowsPerPage
    );

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 1200,
                maxHeight: '90vh',
                bgcolor: 'white',
                borderRadius: '8px',
                boxShadow: 24,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{
                    p: 3,
                    borderBottom: `1px solid ${alpha(PURPLE_COLOR, 0.1)}`,
                    bgcolor: alpha(PURPLE_COLOR, 0.03),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <History size={24} color={PURPLE_COLOR} />
                        <Box>
                            <Typography variant="h6">RME History</Typography>
                            <Typography variant="body2" sx={{ color: GRAY_COLOR }}>
                                View all lock/delete history
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>

                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(PURPLE_COLOR, 0.1)}` }}>
                    <SearchInput
                        value={historySearch}
                        onChange={setHistorySearch}
                        placeholder="Search history..."
                    />
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha(PURPLE_COLOR, 0.05) }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            size="small"
                                            checked={historyModalPageItems.length > 0 &&
                                                historyModalPageItems.every(item => selectedHistoryItems.has(item.id))}
                                            indeterminate={historyModalPageItems.length > 0 &&
                                                historyModalPageItems.some(item => selectedHistoryItems.has(item.id)) &&
                                                !historyModalPageItems.every(item => selectedHistoryItems.has(item.id))}
                                            onChange={toggleAllHistorySelection}
                                        />
                                    </TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>By Manager</TableCell>
                                    <TableCell>Report ID</TableCell>
                                    <TableCell>Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyModalPageItems.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                size="small"
                                                checked={selectedHistoryItems.has(item.id)}
                                                onChange={() => toggleHistorySelection(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha(item.statusColor, 0.1),
                                                    color: item.statusColor,
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">{item.by}</Typography>
                                                <Typography variant="caption" sx={{ color: GRAY_COLOR }}>
                                                    {item.byEmail}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{item.reportId}</TableCell>
                                        <TableCell>{item.address}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredHistoryReports.length}
                    rowsPerPage={historyRowsPerPage}
                    page={historyPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    sx={{ borderTop: `1px solid ${alpha(PURPLE_COLOR, 0.1)}` }}
                />
            </Box>
        </Modal>
    );
};

export default RMEReports;