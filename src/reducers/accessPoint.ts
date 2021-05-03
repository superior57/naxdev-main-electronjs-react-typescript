import { createSlice } from '@reduxjs/toolkit';
import { AccessPoint, NodeStatus } from '@/type';
import { fetchAccessPointList as fetchListApi, selectAccessPoint as selectApi } from '@/api';

type AccessPointState = {
  loading: boolean;
  list: AccessPoint[];
};
export const accessPointSlice = createSlice({
  name: 'accessPoint',
  initialState: {
    loading: false,
    list: [],
  } as AccessPointState,
  reducers: {
    request: (state) => {
      state.loading = true;
    },
    response: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    refreshResponse: (state, action) => {
      state.loading = false;
      action.payload.forEach((node: AccessPoint) => {
        const index = state.list.findIndex(item => item.id === node.id && item.type && node.type);
        if (index >= 0) {
          state.list[index] = {
            ...node,
            avgMs: state.list[index].avgMs,
            alive: state.list[index].alive,
          };
        } else {
          state.list = [...state.list, node];
        }
      });
    },
    select: (state, action) => {
      state.list = state.list.map(item => {
        if (item.id === action.payload.id && item.type === action.payload.type) {
          return {
            ...item,
            selected: true,
          };
        }
        return {
          ...item,
          selected: false,
        }
      });
    },
    status: (state, action) => {
      state.list = state.list.map(item => {
        const exist = action.payload.find((nodeStatus: NodeStatus) => nodeStatus.id === item.id && nodeStatus.type === item.type);
        if (exist) {
          return {
            ...item,
            alive: exist.alive,
            avgMs: exist.avgMs,
          };
        }
        return item;
      });
    },
  },
});

const { request, response, refreshResponse, select, status } = accessPointSlice.actions;

export const fetchAccessPoints = () => async (dispatch: any): Promise<AccessPoint[]> => {
  dispatch(request());
  const list = await fetchListApi();
  dispatch(response(list));
  return list;
};

export const refreshAccessPoints = () => async (dispatch: any): Promise<AccessPoint[]> => {
  dispatch(request());
  const list = await fetchListApi();
  dispatch(refreshResponse(list));
  return list;
};

export const chooseAccessPoint = (id: number, type: string) => async (dispatch: any) => {
  dispatch(select({id, type}));
  await selectApi(id, type);
};

export const receiveNodeStatus = (nodes: NodeStatus[]) => (dispatch: any) => {
  dispatch(status(nodes));
};

export const selectAccessPoints = (state: { accessPoint: AccessPointState }) => {
  return state.accessPoint.list;
};

export const selectLoading = (state: { accessPoint: AccessPointState }) => state.accessPoint.loading;

export default accessPointSlice.reducer;
