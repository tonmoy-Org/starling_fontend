import React, { useState, useMemo, useEffect } from 'react';
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
    DialogContentText,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alpha } from '@mui/material/styles';
import axiosInstance from '../../../api/axios';
import {
    format,
    addBusinessDays,
    addHours,
    isBefore,
    isWeekend,
    addDays,
} from 'date-fns';
import StyledTextField from '../../../components/ui/StyledTextField';
import GradientButton from '../../../components/ui/GradientButton';
import OutlineButton from '../../../components/ui/OutlineButton';

// Import Lucide React icons
import {
    RefreshCw,
    CheckCircle,
    Clock,
    Timer,
    Mail,
    User,
    Tag,
    X,
    Trash2,
    Search,
    AlertCircle,
    Phone,
    Calendar,
    MapPin,
    ChevronRight,
    UserCog,
    Shield,
    PhoneCall,
    AlertTriangle,
} from 'lucide-react';

// ── Constants ──
const TEXT_COLOR = '#0F1115';
const BLUE_COLOR = '#1976d2';
const GREEN_COLOR = '#10b981';
const RED_COLOR = '#ef4444';
const ORANGE_COLOR = '#ed6c02';
const GRAY_COLOR = '#6b7280';

// ── Utility function ──
const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
        console.warn('Invalid date format:', dateString);
        return '—';
    }
};

// Format emergency countdown
const formatEmergencyCountdown = (remainingMs) => {
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};

// Calculate business days remaining
const getBusinessDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);

    if (now >= end) return { days: 0, expired: true };

    let current = new Date(now);
    let businessDays = 0;

    // Move to next day if we're past business hours (5 PM)
    if (current.getHours() >= 17) {
        current = addDays(current, 1);
    }

    // Set to start of next business day
    current.setHours(8, 0, 0, 0);

    while (current < end) {
        if (!isWeekend(current)) {
            businessDays++;
        }
        current = addDays(current, 1);
    }

    return { days: businessDays, expired: false };
};

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

// Function to get user data from localStorage
const getUserDataFromStorage = () => {
    try {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            return {
                name: parsed.name || parsed.fullName || parsed.displayName || '',
                email: parsed.email || '',
            };
        }
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
    }
    return { name: '', email: '' };
};

const Locates = () => {
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Get user data from localStorage
    const userData = getUserDataFromStorage();

    const [selectedExcavator, setSelectedExcavator] = useState(new Set());
    const [selectedInProgress, setSelectedInProgress] = useState(new Set());
    const [selectedCompleted, setSelectedCompleted] = useState(new Set());

    // Dialogs
    const [tagDialogOpen, setTagDialogOpen] = useState(false);
    const [bulkTagDialogOpen, setBulkTagDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
    const [deletionSection, setDeletionSection] = useState('');
    const [selectedForTagging, setSelectedForTagging] = useState([]);
    const [tagForm, setTagForm] = useState({
        name: userData.name,
        email: userData.email,
        tags: 'Locates Needed',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyUntagged, setShowOnlyUntagged] = useState(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Update current time every second for countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // ── Data Fetching ──
    const { data: rawData = [], isLoading, refetch } = useQuery({
        queryKey: ['locates-all'],
        queryFn: async () => {
            const res = await axiosInstance.get('/locates/all-locates');
            return Array.isArray(res.data) ? res.data : res.data?.data || [];
        },
        staleTime: 3 * 60 * 1000,
    });
    

    // ── Mutations ──
    const invalidateAndRefetch = () => {
        queryClient.invalidateQueries({ queryKey: ['locates-all'] });
        queryClient.refetchQueries({ queryKey: ['locates-all'] });
    };

    const syncMutation = useMutation({
        mutationFn: () => axiosInstance.get('/locates/sync-dashboard'),
        onSuccess: () => {
            invalidateAndRefetch();
            showSnackbar('Sync completed successfully', 'success');
        },
        onError: (err) => showSnackbar(err?.response?.data?.message || 'Sync failed', 'error'),
    });

    const markCalledMutation = useMutation({
        mutationFn: async ({ id, callType }) => {
            console.log('=== FRONTEND DEBUG ===');
            console.log('Marking as called:', { id, callType });

            const response = await axiosInstance.patch(
                `/locates/work-order/${id}/update-call-status`,
                {
                    locatesCalled: true,
                    callType,
                    calledAt: new Date().toISOString(),
                }
            );

            console.log('Response received:', response.data);
            return response;
        },
        onSuccess: (response) => {
            console.log('Mutation success:', response.data);
            invalidateAndRefetch();
            showSnackbar('Locate call status updated', 'success');
        },
        onError: (err) => {
            console.error('Mutation error:', err);
            console.error('Error response:', err.response?.data);
            showSnackbar(err?.response?.data?.message || 'Update failed', 'error');
        },
    });

    const deleteBulkMutation = useMutation({
        mutationFn: (ids) =>
            axiosInstance.delete('/locates/work-order/bulk-delete', { data: { ids: Array.from(ids) } }),
        onSuccess: () => {
            invalidateAndRefetch();
            setSelectedExcavator(new Set());
            setSelectedInProgress(new Set());
            setSelectedCompleted(new Set());
            showSnackbar('Selected items deleted', 'success');
        },
        onError: (err) => showSnackbar(err?.response?.data?.message || 'Delete failed', 'error'),
    });

    // ── Tagging Mutations ──
    const tagLocatesNeededMutation = useMutation({
        mutationFn: async ({ workOrderNumber, name, email, tags }) => {
            const response = await axiosInstance.post('/locates/tag-locates-needed', {
                workOrderNumber,
                name,
                email,
                tags,
            });
            return response.data;
        },
        onSuccess: (data) => {
            invalidateAndRefetch();
            setTagDialogOpen(false);
            setTagForm({
                name: userData.name,
                email: userData.email,
                tags: 'Locates Needed',
            });
            showSnackbar(data.message || 'Work order tagged successfully', 'success');
        },
        onError: (err) => {
            showSnackbar(err?.response?.data?.message || 'Tagging failed', 'error');
        },
    });

    const bulkTagLocatesNeededMutation = useMutation({
        mutationFn: async ({ workOrderNumbers, name, email, tags }) => {
            const response = await axiosInstance.post('/locates/bulk-tag-locates-needed', {
                workOrderNumbers,
                name,
                email,
                tags,
            });
            return response.data;
        },
        onSuccess: (data) => {
            invalidateAndRefetch();
            setBulkTagDialogOpen(false);
            setSelectedExcavator(new Set());
            setTagForm({
                name: userData.name,
                email: userData.email,
                tags: 'Locates Needed',
            });
            showSnackbar(data.message || 'Bulk tagging completed', 'success');
        },
        onError: (err) => {
            showSnackbar(err?.response?.data?.message || 'Bulk tagging failed', 'error');
        },
    });

    // ── Data Processing ──
    const processed = useMemo(() => {
        return rawData
            .flatMap(item => item.workOrders || [])
            .map(wo => {
                const addr = parseDashboardAddress(wo.customerAddress || '');
                const isEmergency = (wo.type || wo.priorityName || '').toUpperCase().includes('EMERGENCY');
                const type = isEmergency ? 'EMERGENCY' : 'STANDARD';

                let completionDate = null;
                let timeRemainingText = '';
                let timeRemainingDetail = '';
                let timeRemainingColor = TEXT_COLOR;
                let isExpired = false;

                // Extract called by information
                const calledByName = wo.calledBy || wo.metadata?.updatedBy || '';
                const calledByEmail = wo.calledByEmail || '';
                const taggedByName = wo.taggedBy || '';
                const taggedByEmail = wo.taggedByEmail || '';

                if (wo.locatesCalled && wo.calledAt && wo.callType) {
                    const called = new Date(wo.calledAt);
                    completionDate = wo.completionDate ? new Date(wo.completionDate) :
                        (wo.callType === 'EMERGENCY' ? addHours(called, 4) : addBusinessDays(called, 2));

                    const now = currentTime;
                    isExpired = isBefore(completionDate, now);

                    if (!isExpired) {
                        if (wo.callType === 'EMERGENCY') {
                            // Emergency: 4 hours from called time
                            const totalMs = 4 * 60 * 60 * 1000;
                            const elapsedMs = now.getTime() - called.getTime();
                            const remainingMs = Math.max(0, totalMs - elapsedMs);

                            timeRemainingText = formatEmergencyCountdown(remainingMs);
                            timeRemainingDetail = `Expires at: ${format(completionDate, 'MMM dd, HH:mm:ss')}`;

                            // Color coding for emergency
                            if (remainingMs <= 30 * 60 * 1000) {
                                timeRemainingColor = RED_COLOR;
                            } else if (remainingMs <= 60 * 60 * 1000) {
                                timeRemainingColor = ORANGE_COLOR;
                            } else {
                                timeRemainingColor = BLUE_COLOR;
                            }
                        } else {
                            // Standard: 2 business days
                            const businessInfo = getBusinessDaysRemaining(completionDate);

                            // Check if it's a business day
                            const now = new Date();
                            const isBusinessDay = !isWeekend(now);

                            if (businessInfo.days === 0 && isBusinessDay) {
                                const businessHoursRemaining = Math.max(0, 17 - now.getHours());
                                timeRemainingText = `${businessHoursRemaining}h remaining today`;
                            } else if (businessInfo.days === 1) {
                                timeRemainingText = `1 business day`;
                            } else {
                                timeRemainingText = `${businessInfo.days} business days`;
                            }

                            timeRemainingDetail = `Expires: ${format(completionDate, 'MMM dd, yyyy')}`;

                            // Color coding for standard
                            if (businessInfo.days === 0) {
                                timeRemainingColor = ORANGE_COLOR;
                            } else if (businessInfo.days <= 1) {
                                timeRemainingColor = ORANGE_COLOR;
                            } else {
                                timeRemainingColor = BLUE_COLOR;
                            }
                        }
                    } else {
                        timeRemainingText = 'EXPIRED';
                        timeRemainingDetail = `Expired on: ${format(completionDate, 'MMM dd, yyyy HH:mm')}`;
                        timeRemainingColor = RED_COLOR;
                    }
                }

                return {
                    id: wo._id || `ext-${wo.workOrderNumber || Math.random().toString(36).slice(2, 9)}`,
                    jobId: wo.workOrderNumber || 'N/A',
                    workOrderNumber: wo.workOrderNumber || '',
                    customerName: wo.customerName || 'Unknown',
                    ...addr,
                    type,
                    techName: wo.techName || wo.technician || 'Unassigned',
                    requestedDate: wo.createdDate || wo.requestedDate,
                    completedAt: wo.completedDate,
                    locatesCalled: !!wo.locatesCalled,
                    callType: wo.callType || null,
                    calledByName,
                    calledByEmail,
                    taggedByName,
                    taggedByEmail,
                    calledAt: wo.calledAt,
                    completionDate: completionDate,
                    priorityName: wo.priorityName || 'Standard',
                    priorityColor: wo.priorityColor,
                    needsCall: (wo.priorityName || '').toUpperCase() === 'EXCAVATOR',
                    isExpired,
                    timeRemainingText,
                    timeRemainingDetail,
                    timeRemainingColor,
                    tags: wo.tags || '',
                    manuallyTagged: wo.manuallyTagged || false,
                };
            });
    }, [rawData, currentTime]);

    const excavatorPending = useMemo(() => {
        let filtered = processed.filter(l => l.needsCall && !l.locatesCalled);

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(l =>
                l.workOrderNumber?.toLowerCase().includes(searchLower) ||
                l.customerName?.toLowerCase().includes(searchLower) ||
                l.street?.toLowerCase().includes(searchLower) ||
                l.city?.toLowerCase().includes(searchLower) ||
                l.techName?.toLowerCase().includes(searchLower)
            );
        }

        // Apply "Show Only Untagged" filter
        if (showOnlyUntagged) {
            filtered = filtered.filter(l => !l.manuallyTagged);
        }

        return filtered;
    }, [processed, searchTerm, showOnlyUntagged]);

    const inProgress = useMemo(() =>
        processed.filter(l => l.locatesCalled && !l.isExpired), [processed]);

    const completed = useMemo(() =>
        processed.filter(l => l.locatesCalled && l.isExpired), [processed]);

    // ── Helpers ──
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleMarkCalled = (id, callType) => {
        markCalledMutation.mutate({ id, callType });
    };

    const confirmBulkDelete = (selectionSet, section) => {
        if (selectionSet.size === 0) return;

        setSelectedForDeletion(selectionSet);
        setDeletionSection(section);
        setDeleteDialogOpen(true);
    };

    const executeBulkDelete = () => {
        deleteBulkMutation.mutate(selectedForDeletion);
        setDeleteDialogOpen(false);
        setSelectedForDeletion(new Set());
    };

    const toggleSelection = (setState, id) => {
        setState(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    // Tagging functions
    const openTagDialog = (item) => {
        setSelectedForTagging([item]);
        setTagForm({
            name: userData.name,
            email: userData.email,
            tags: item.tags || 'Locates Needed',
        });
        setTagDialogOpen(true);
    };

    const openBulkTagDialog = () => {
        const selectedItems = Array.from(selectedExcavator)
            .map(id => excavatorPending.find(item => item.id === id))
            .filter(Boolean);

        if (selectedItems.length === 0) {
            showSnackbar('Please select items to tag', 'warning');
            return;
        }

        setSelectedForTagging(selectedItems);
        setTagForm({
            name: userData.name,
            email: userData.email,
            tags: 'Locates Needed',
        });
        setBulkTagDialogOpen(true);
    };

    const handleTagSubmit = () => {
        if (!tagForm.name.trim() || !tagForm.email.trim()) {
            showSnackbar('Name and email are required', 'error');
            return;
        }

        if (bulkTagDialogOpen) {
            // Bulk tagging
            const workOrderNumbers = selectedForTagging.map(item => item.workOrderNumber).filter(Boolean);
            if (workOrderNumbers.length === 0) {
                showSnackbar('No valid work order numbers found', 'error');
                return;
            }

            bulkTagLocatesNeededMutation.mutate({
                workOrderNumbers,
                name: tagForm.name,
                email: tagForm.email,
                tags: tagForm.tags,
            });
        } else {
            // Single tagging
            const item = selectedForTagging[0];
            if (!item?.workOrderNumber) {
                showSnackbar('Invalid work order', 'error');
                return;
            }

            tagLocatesNeededMutation.mutate({
                workOrderNumber: item.workOrderNumber,
                name: tagForm.name,
                email: tagForm.email,
                tags: tagForm.tags,
            });
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress 
                    sx={{ 
                        color: BLUE_COLOR,
                        width: '32px !important',
                        height: '32px !important',
                    }} 
                />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
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
                        Locate Management
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: GRAY_COLOR,
                            fontSize: '0.8rem',
                            fontWeight: 400,
                        }}
                    >
                        Dispatch and monitor locate requests efficiently
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<RefreshCw size={16} />}
                        onClick={() => syncMutation.mutate()}
                        disabled={syncMutation.isPending}
                        sx={{ 
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            height: '36px',
                            px: 2,
                        }}
                    >
                        {syncMutation.isPending ? 'Syncing...' : 'Sync Dashboard'}
                    </Button>
                </Box>
            </Box>

            {/* Excavator - Call Needed */}
            <Section
                title="Call Needed "
                color={ORANGE_COLOR}
                count={excavatorPending.length}
                selectedCount={selectedExcavator.size}
                onDelete={() => confirmBulkDelete(selectedExcavator, 'Call Needed')}
                additionalActions={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <StyledTextField
                            size="small"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ 
                                width: 200,
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
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearchTerm('')}
                                            edge="end"
                                            sx={{ p: 0.5 }}
                                        >
                                            <X size={16} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {selectedExcavator.size > 0 && (
                            <Button
                                variant="contained"
                                onClick={openBulkTagDialog}
                                size="small"
                                startIcon={<Tag size={14} />}
                                sx={{ 
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    height: '30px',
                                    px: 1.5,
                                }}
                            >
                                Tag ({selectedExcavator.size})
                            </Button>
                        )}
                    </Stack>
                }
            >
                <LocateTable
                    items={excavatorPending}
                    selected={selectedExcavator}
                    onToggleSelect={(id) => toggleSelection(setSelectedExcavator, id)}
                    onMarkCalled={handleMarkCalled}
                    onTag={openTagDialog}
                    color={ORANGE_COLOR}
                    showCallAction
                    showTagAction
                    showTaggedBy
                />
            </Section>

            {/* In Progress */}
            <Section
                title="In Progress"
                color={BLUE_COLOR}
                count={inProgress.length}
                selectedCount={selectedInProgress.size}
                onDelete={() => confirmBulkDelete(selectedInProgress, 'In Progress')}
                showTimer
            >
                <LocateTable
                    items={inProgress}
                    selected={selectedInProgress}
                    onToggleSelect={(id) => toggleSelection(setSelectedInProgress, id)}
                    color={BLUE_COLOR}
                    showTimerColumn
                    showCalledBy
                    currentTime={currentTime}
                />
            </Section>

            {/* Completed */}
            <Section
                title="Completed"
                color={GREEN_COLOR}
                count={completed.length}
                selectedCount={selectedCompleted.size}
                onDelete={() => confirmBulkDelete(selectedCompleted, 'Completed')}
            >
                <LocateTable
                    items={completed}
                    selected={selectedCompleted}
                    onToggleSelect={(id) => toggleSelection(setSelectedCompleted, id)}
                    color={GREEN_COLOR}
                    showCalledBy
                    showTimerColumn={false}
                />
            </Section>

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
                                Confirm Deletion
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                color: GRAY_COLOR,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                            }}>
                                This action cannot be undone
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
                        Are you sure you want to delete <strong>{selectedForDeletion.size} item(s)</strong> from the <strong>{deletionSection}</strong> section?
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
                                Warning
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: TEXT_COLOR,
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                }}
                            >
                                All selected work orders will be permanently removed from the system.
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
                        onClick={executeBulkDelete}
                        variant="contained"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                        disabled={deleteBulkMutation.isPending}
                        sx={{ 
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            px: 2,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {deleteBulkMutation.isPending ? 'Deleting...' : 'Delete Selected'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Tag Dialog */}
            <Dialog
                open={tagDialogOpen}
                onClose={() => setTagDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'white',
                        borderRadius: '6px',
                        border: `1px solid ${alpha(BLUE_COLOR, 0.1)}`,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: `1px solid ${alpha(BLUE_COLOR, 0.1)}`,
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
                            backgroundColor: alpha(BLUE_COLOR, 0.1),
                            color: BLUE_COLOR,
                        }}>
                            <Tag size={18} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}>
                                Tag as Locates Needed
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                color: GRAY_COLOR,
                                fontSize: '0.75rem',
                                fontWeight: 400,
                            }}>
                                Add tags to work order
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 2 }}>
                        <Box>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    color: TEXT_COLOR,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    mb: 1,
                                }}
                            >
                                Work Order
                            </Typography>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '6px',
                                backgroundColor: alpha(BLUE_COLOR, 0.05),
                                border: `1px solid ${alpha(BLUE_COLOR, 0.1)}`,
                            }}>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: TEXT_COLOR,
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    {selectedForTagging[0]?.workOrderNumber || 'N/A'}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: GRAY_COLOR,
                                        fontSize: '0.75rem',
                                        fontWeight: 400,
                                    }}
                                >
                                    {selectedForTagging[0]?.customerName} • {selectedForTagging[0]?.street}
                                </Typography>
                            </Box>
                        </Box>

                        <StyledTextField
                            label="Your Name"
                            value={tagForm.name}
                            onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                            fullWidth
                            required
                            size="small"
                            helperText="Auto-filled from your account"
                            InputProps={{
                                readOnly: !!userData.name,
                                sx: { fontSize: '0.85rem' }
                            }}
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        <StyledTextField
                            label="Your Email"
                            value={tagForm.email}
                            onChange={(e) => setTagForm({ ...tagForm, email: e.target.value })}
                            fullWidth
                            required
                            size="small"
                            type="email"
                            helperText="Auto-filled from your account"
                            InputProps={{
                                readOnly: !!userData.email,
                                sx: { fontSize: '0.85rem' }
                            }}
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        <StyledTextField
                            label="Tags"
                            value={tagForm.tags}
                            onChange={(e) => setTagForm({ ...tagForm, tags: e.target.value })}
                            fullWidth
                            size="small"
                            placeholder="Locates Needed, Additional notes..."
                            helperText="Separate multiple tags with commas"
                            InputProps={{
                                sx: { fontSize: '0.85rem' }
                            }}
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <OutlineButton
                        onClick={() => setTagDialogOpen(false)}
                        sx={{
                            fontSize: '0.85rem',
                            height: '36px',
                            px: 2,
                        }}
                    >
                        Cancel
                    </OutlineButton>
                    <GradientButton
                        onClick={handleTagSubmit}
                        disabled={!tagForm.name.trim() || !tagForm.email.trim() || tagLocatesNeededMutation.isPending}
                        sx={{
                            fontSize: '0.85rem',
                            height: '36px',
                            px: 2,
                        }}
                    >
                        {tagLocatesNeededMutation.isPending ? 'Tagging...' : 'Tag Work Order'}
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Bulk Tag Dialog */}
            <Dialog
                open={bulkTagDialogOpen}
                onClose={() => setBulkTagDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'white',
                        borderRadius: '6px',
                        border: `1px solid ${alpha(BLUE_COLOR, 0.1)}`,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: `1px solid ${alpha(BLUE_COLOR, 0.1)}`,
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
                            backgroundColor: alpha(BLUE_COLOR, 0.1),
                            color: BLUE_COLOR,
                        }}>
                            <Tag size={18} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                            }}>
                                Bulk Tag as Locates Needed
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip 
                                    label={`${selectedForTagging.length} items`} 
                                    size="small" 
                                    sx={{
                                        height: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                        backgroundColor: alpha(BLUE_COLOR, 0.1),
                                        color: BLUE_COLOR,
                                    }}
                                />
                                <Typography variant="caption" sx={{ 
                                    color: GRAY_COLOR,
                                    fontSize: '0.75rem',
                                    fontWeight: 400,
                                }}>
                                    Multiple work orders selected
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 2 }}>
                        <Box>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    color: TEXT_COLOR,
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    mb: 1,
                                }}
                            >
                                Selected Work Orders
                            </Typography>
                            <Box sx={{
                                maxHeight: 120,
                                overflow: 'auto',
                                border: `1px solid ${alpha(TEXT_COLOR, 0.1)}`,
                                p: 1.5,
                                borderRadius: '6px',
                                bgcolor: alpha(BLUE_COLOR, 0.02),
                            }}>
                                {selectedForTagging.map((item, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            py: 0.75,
                                            borderBottom: index < selectedForTagging.length - 1 ? `1px solid ${alpha(TEXT_COLOR, 0.05)}` : 'none',
                                        }}
                                    >
                                        <ChevronRight size={14} color={GRAY_COLOR} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: TEXT_COLOR,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.workOrderNumber}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: GRAY_COLOR,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                {item.customerName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <StyledTextField
                            label="Your Name"
                            value={tagForm.name}
                            onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                            fullWidth
                            required
                            size="small"
                            helperText="Auto-filled from your account"
                            InputProps={{
                                readOnly: !!userData.name,
                                sx: { fontSize: '0.85rem' }
                            }}
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        <StyledTextField
                            label="Your Email"
                            value={tagForm.email}
                            onChange={(e) => setTagForm({ ...tagForm, email: e.target.value })}
                            fullWidth
                            required
                            size="small"
                            type="email"
                            helperText="Auto-filled from your account"
                            InputProps={{
                                readOnly: !!userData.email,
                                sx: { fontSize: '0.85rem' }
                            }}
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        <StyledTextField
                            label="Tags"
                            value={tagForm.tags}
                            onChange={(e) => setTagForm({ ...tagForm, tags: e.target.value })}
                            fullWidth
                            size="small"
                            placeholder="Locates Needed, Additional notes..."
                            helperText="Separate multiple tags with commas"
                            InputProps={{
                                sx: { fontSize: '0.85rem' }
                            }}
                            sx={{
                                '& .MuiFormLabel-root': {
                                    fontSize: '0.85rem',
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '0.75rem',
                                }
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1.5 }}>
                    <Button
                        onClick={() => setBulkTagDialogOpen(false)}
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
                    <GradientButton
                        onClick={handleTagSubmit}
                        disabled={!tagForm.name.trim() || !tagForm.email.trim() || bulkTagLocatesNeededMutation.isPending}
                        startIcon={<Tag size={16} />}
                        sx={{
                            fontSize: '0.85rem',
                            height: '36px',
                            px: 2,
                        }}
                    >
                        {bulkTagLocatesNeededMutation.isPending ? 'Tagging...' : `Tag ${selectedForTagging.length} Items`}
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Snackbar (MUI Alert) */}
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
                            : alpha(RED_COLOR, 0.05),
                        borderLeft: `4px solid ${snackbar.severity === 'success' ? GREEN_COLOR : RED_COLOR}`,
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success' ? GREEN_COLOR : RED_COLOR,
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

// ── Section Component ──
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

// ── LocateTable Component ──
const LocateTable = ({
    items,
    selected,
    onToggleSelect,
    onMarkCalled,
    onTag,
    color,
    showCallAction = false,
    showTagAction = false,
    showCalledBy = false,
    showTaggedBy = false,
    showTimerColumn = false,
    currentTime,
}) => (
    <TableContainer>
        <Table size="small">
            <TableHead>
                <TableRow sx={{ 
                    bgcolor: alpha(color, 0.04),
                    '& th': {
                        borderBottom: `2px solid ${alpha(color, 0.1)}`,
                    }
                }}>
                    <TableCell 
                        padding="checkbox" 
                        width={50} 
                        sx={{ 
                            color: TEXT_COLOR,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            py: 1.5,
                            pl: 2.5,
                        }}
                    >
                        Select
                    </TableCell>
                    {showCallAction && (
                        <TableCell 
                            width={220} 
                            sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                py: 1.5,
                            }}
                        >
                            Call Action
                        </TableCell>
                    )}
                    {showTagAction && (
                        <TableCell 
                            width={100} 
                            sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                py: 1.5,
                            }}
                        >
                            Tag
                        </TableCell>
                    )}
                    {showTimerColumn && (
                        <TableCell 
                            width={180} 
                            sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                py: 1.5,
                            }}
                        >
                            Time Remaining
                        </TableCell>
                    )}
                    <TableCell sx={{ 
                        color: TEXT_COLOR,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1.5,
                    }}>
                        Customer
                    </TableCell>
                    <TableCell sx={{ 
                        color: TEXT_COLOR,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1.5,
                    }}>
                        Address
                    </TableCell>
                    <TableCell sx={{ 
                        color: TEXT_COLOR,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1.5,
                    }}>
                        Date
                    </TableCell>
                    <TableCell sx={{ 
                        color: TEXT_COLOR,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1.5,
                    }}>
                        Technician
                    </TableCell>
                    {showCalledBy && (
                        <TableCell 
                            width={200} 
                            sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                py: 1.5,
                            }}
                        >
                            Called By
                        </TableCell>
                    )}
                    {showTaggedBy && (
                        <TableCell 
                            width={200} 
                            sx={{ 
                                color: TEXT_COLOR,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                py: 1.5,
                                pr: 2.5,
                            }}
                        >
                            Tagged By
                        </TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={
                            1 + // Select
                            (showCallAction ? 1 : 0) +
                            (showTagAction ? 1 : 0) +
                            (showTimerColumn ? 1 : 0) +
                            4 + // Customer, Address, Date, Technician
                            (showCalledBy ? 1 : 0) +
                            (showTaggedBy ? 1 : 0)
                        } align="center" sx={{ py: 6 }}>
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
                        const addressLine = item.street || item.original || '—';
                        const location = [item.city, item.state, item.zip].filter(Boolean).join(', ');
                        const hasCheckmark = item.locatesCalled && item.calledByName;

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
                                <TableCell padding="checkbox" sx={{ pl: 2.5, py: 1.5 }}>
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

                                {showCallAction && (
                                    <TableCell sx={{ py: 1.5 }}>
                                        {item.locatesCalled ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <CheckCircle size={18} color={RED_COLOR} />
                                                <Chip
                                                    label={item.callType || 'Called'}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: item.callType === 'EMERGENCY' 
                                                            ? alpha(RED_COLOR, 0.1) 
                                                            : alpha(BLUE_COLOR, 0.1),
                                                        color: item.callType === 'EMERGENCY' ? RED_COLOR : BLUE_COLOR,
                                                        border: `1px solid ${item.callType === 'EMERGENCY' 
                                                            ? alpha(RED_COLOR, 0.2) 
                                                            : alpha(BLUE_COLOR, 0.2)}`,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        height: '22px',
                                                        '& .MuiChip-label': {
                                                            px: 1,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => onMarkCalled(item.id, 'STANDARD')}
                                                    startIcon={<PhoneCall size={14} />}
                                                    sx={{ 
                                                        textTransform: 'none',
                                                        fontSize: '0.75rem',
                                                        height: '30px',
                                                        px: 1.5,
                                                    }}
                                                >
                                                    Standard
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => onMarkCalled(item.id, 'EMERGENCY')}
                                                    startIcon={<AlertTriangle size={14} />}
                                                    sx={{ 
                                                        textTransform: 'none',
                                                        fontSize: '0.75rem',
                                                        height: '30px',
                                                        px: 1.5,
                                                    }}
                                                >
                                                    Emergency
                                                </Button>
                                            </Stack>
                                        )}
                                    </TableCell>
                                )}

                                {showTagAction && (
                                    <TableCell sx={{ py: 1.5 }}>
                                        {!item.manuallyTagged ? (
                                            <Tooltip title="Tag as Locates Needed">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onTag(item)}
                                                    sx={{
                                                        color: TEXT_COLOR,
                                                        padding: '4px',
                                                        '&:hover': { 
                                                            backgroundColor: alpha(color, 0.1),
                                                            color: color,
                                                        }
                                                    }}
                                                >
                                                    <Tag size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title={item.tags}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Tag size={14} color={GREEN_COLOR} />
                                                    <Typography 
                                                        sx={{ 
                                                            fontSize: '0.8rem', 
                                                            color: TEXT_COLOR,
                                                            fontWeight: 400,
                                                        }}
                                                    >
                                                        {item.tags.split(',')[0]}
                                                    </Typography>
                                                </Box>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                )}

                                {showTimerColumn && (
                                    <TableCell sx={{ py: 1.5 }}>
                                        {item.timeRemainingText ? (
                                            <Tooltip title={item.timeRemainingDetail}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Clock size={16} color={item.timeRemainingColor} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: item.timeRemainingColor,
                                                            fontSize: '0.85rem',
                                                            fontWeight: item.timeRemainingText === 'EXPIRED' ? 600 : 400,
                                                            fontFamily: item.callType === 'EMERGENCY' ? 'monospace' : 'inherit'
                                                        }}
                                                    >
                                                        {item.timeRemainingText}
                                                    </Typography>
                                                </Box>
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
                                )}

                                <TableCell sx={{ py: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                        {hasCheckmark && (
                                            <Tooltip title={`Called by ${item.calledByName}`}>
                                                <CheckCircle size={16} color={RED_COLOR} />
                                            </Tooltip>
                                        )}
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
                                                {item.customerName}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: GRAY_COLOR, 
                                                    fontSize: '0.75rem',
                                                    fontWeight: 400,
                                                    display: 'block',
                                                    mb: 0.5,
                                                }}
                                            >
                                                WO: {item.workOrderNumber}
                                            </Typography>
                                            {item.priorityName && item.priorityName !== 'Standard' && (
                                                <Chip
                                                    label={item.priorityName}
                                                    size="small"
                                                    sx={{
                                                        color: TEXT_COLOR,
                                                        fontSize: '0.7rem',
                                                        height: '20px',
                                                        fontWeight: 500,
                                                        backgroundColor: alpha(color, 0.1),
                                                        border: `1px solid ${alpha(color, 0.2)}`,
                                                        '& .MuiChip-label': {
                                                            px: 1,
                                                        },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ py: 1.5 }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: TEXT_COLOR,
                                            fontSize: '0.85rem',
                                            fontWeight: 400,
                                            mb: 0.25,
                                        }}
                                    >
                                        {addressLine}
                                    </Typography>
                                    {location && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: GRAY_COLOR,
                                                fontSize: '0.75rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            {location}
                                        </Typography>
                                    )}
                                </TableCell>

                                <TableCell sx={{ py: 1.5 }}>
                                    <Stack spacing={0.5}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: GRAY_COLOR,
                                                fontSize: '0.75rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            Requested: {formatDate(item.requestedDate)}
                                        </Typography>
                                        {item.calledAt && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: BLUE_COLOR,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Called: {formatDate(item.calledAt)}
                                            </Typography>
                                        )}
                                        {item.completionDate && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: GRAY_COLOR,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                Due: {formatDate(item.completionDate)}
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>

                                <TableCell sx={{ py: 1.5 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar sx={{ 
                                            width: 28, 
                                            height: 28, 
                                            bgcolor: color, 
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                        }}>
                                            {item.techName?.charAt(0) || '?'}
                                        </Avatar>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: TEXT_COLOR,
                                                fontSize: '0.85rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            {item.techName}
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                {showCalledBy && (
                                    <TableCell sx={{ py: 1.5 }}>
                                        {item.calledByName ? (
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <User size={14} color={TEXT_COLOR} />
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: TEXT_COLOR,
                                                            fontSize: '0.85rem',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {item.calledByName}
                                                    </Typography>
                                                </Box>
                                                {item.calledByEmail && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <Mail size={12} color={GRAY_COLOR} />
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: GRAY_COLOR,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 400,
                                                            }}
                                                        >
                                                            {item.calledByEmail}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
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
                                )}

                                {showTaggedBy && (
                                    <TableCell sx={{ py: 1.5, pr: 2.5 }}>
                                        {item.taggedByName ? (
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <User size={14} color={TEXT_COLOR} />
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: TEXT_COLOR,
                                                            fontSize: '0.85rem',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {item.taggedByName}
                                                    </Typography>
                                                </Box>
                                                {item.taggedByEmail && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <Mail size={12} color={GRAY_COLOR} />
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: GRAY_COLOR,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 400,
                                                            }}
                                                        >
                                                            {item.taggedByEmail}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
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
                                )}
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    </TableContainer>
);

export default Locates;