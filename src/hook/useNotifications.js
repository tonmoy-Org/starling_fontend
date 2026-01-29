import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/AuthProvider';
import axiosInstance from '../api/axios';

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

export const useNotifications = () => {
    const { user } = useAuth();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['notifications-count', user?.role],
        queryFn: async () => {
            // Default empty response
            const emptyResponse = {
                locates: [],
                workOrders: [],
                latestNotifications: [],
                locatesCount: 0,
                workOrdersCount: 0,
                totalActualCount: 0,
                unseenLocateIds: [],
                unseenRmeIds: [],
                unseenIds: [],
                count: 0,
            };

            if (!user) return emptyResponse;

            const role = user.role?.toUpperCase();
            if (role !== 'SUPERADMIN' && role !== 'MANAGER') {
                return emptyResponse;
            }

            const [locatesResponse, workOrdersResponse] = await Promise.all([
                axiosInstance.get('/locates/'),
                axiosInstance.get('/work-orders-today/'),
            ]);

            const locatesData = Array.isArray(locatesResponse.data)
                ? locatesResponse.data
                : locatesResponse.data?.data || [];

            const workOrdersData = Array.isArray(workOrdersResponse.data)
                ? workOrdersResponse.data
                : workOrdersResponse.data?.data || [];

            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            let locatesCount = 0;
            let workOrdersCount = 0;

            const latestNotifications = [];
            const unseenLocateIds = [];
            const unseenRmeIds = [];

            // ---- LOCATES ----
            locatesData.forEach((locate) => {
                const createdDate = formatDate(
                    locate.created_at || locate.created_date
                );
                if (!createdDate) return;

                if (createdDate >= oneMonthAgo && locate.is_seen === false) {
                    locatesCount++;

                    const id = `locate-${locate.id}`;
                    unseenLocateIds.push(id);

                    latestNotifications.push({
                        id,
                        type: 'locate',
                        timestamp: createdDate,
                    });
                }
            });

            // ---- WORK ORDERS / RME ----
            workOrdersData.forEach((workOrder) => {
                const elapsedDate = formatDate(workOrder.elapsed_time);
                if (!elapsedDate) return;

                if (elapsedDate >= oneMonthAgo && workOrder.is_seen === false) {
                    workOrdersCount++;

                    const id = `rme-${workOrder.id}`;
                    unseenRmeIds.push(id);

                    latestNotifications.push({
                        id,
                        type: 'RME',
                        timestamp: elapsedDate,
                    });
                }
            });

            // Sort by latest
            latestNotifications.sort((a, b) => b.timestamp - a.timestamp);

            const unseenIds = [...unseenLocateIds, ...unseenRmeIds];
            const totalActualCount = locatesCount + workOrdersCount;

            return {
                locates: locatesData,
                workOrders: workOrdersData,
                latestNotifications,
                locatesCount,
                workOrdersCount,
                totalActualCount,
                unseenLocateIds,
                unseenRmeIds,
                unseenIds,
                count: totalActualCount,
            };
        },
        staleTime: 30000,
        refetchInterval: 60000,
    });

    return {
        notifications: data,
        isLoading,
        error,
        refetch,
        badgeCount: data?.count || 0,
        totalCount: data?.totalActualCount || 0,
        locatesCount: data?.locatesCount || 0,
        rmeCount: data?.workOrdersCount || 0,
        unseenLocateIds: data?.unseenLocateIds || [],
        unseenRmeIds: data?.unseenRmeIds || [],
        unseenIds: data?.unseenIds || [],
    };
};
