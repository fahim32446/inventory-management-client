import { HTTPResponse } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import type {
  ICreateRole,
  IPermission,
  IRoleDetails,
  IRoleList,
} from "../administration.interface";

export const administrationApiEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPermissions: build.query<HTTPResponse<IPermission[]>, void>({
      query: () => {
        return {
          url: `/administration/permissions`,
          method: "GET",
        };
      },
      providesTags: () => ["ADMINISTRATION"],
    }),

    createRole: build.mutation<HTTPResponse<void>, ICreateRole>({
      query: (createRole) => {
        return {
          url: `/administration/role`,
          method: "POST",
          body: createRole,
        };
      },
      invalidatesTags: () => ["ADMINISTRATION"],
    }),
    updateRole: build.mutation<HTTPResponse<void>, { body: ICreateRole; id: any }>({
      query: ({ body, id }) => {
        return {
          url: `/administration/role/${id}`,
          method: "PUT",
          body: body,
        };
      },
      invalidatesTags: () => ["ADMINISTRATION"],
    }),

    getRoleList: build.query<HTTPResponse<IRoleList[]>, void>({
      query: () => {
        return {
          url: `/administration/role`,
          method: "GET",
        };
      },
      providesTags: () => ["ADMINISTRATION"],
    }),
    getRoleDetails: build.query<HTTPResponse<IRoleDetails>, { roleId?: string }>({
      query: ({ roleId }) => {
        return {
          url: `/administration/role/details/${roleId}`,
          method: "GET",
        };
      },
      providesTags: () => ["ADMINISTRATION"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetRoleListQuery,
  useGetRoleDetailsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = administrationApiEndpoints;
