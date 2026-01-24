import type { HTTPResponse } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import type { ICreateUser, IUser } from "../administration.interface";

export const usersApiEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<HTTPResponse<IUser[]>, void>({
      query: () => {
        return {
          url: `/administration/user/list`,
          method: "GET",
        };
      },
      providesTags: () => ["ADMINISTRATION"],
    }),

    createUser: build.mutation<HTTPResponse<void>, ICreateUser>({
      query: (createUser) => {
        return {
          url: `/administration/user`,
          method: "POST",
          body: createUser,
        };
      },
      invalidatesTags: () => ["ADMINISTRATION"],
    }),
    updateUser: build.mutation<HTTPResponse<void>, { body: ICreateUser; id: any }>({
      query: ({ body, id }) => {
        return {
          url: `/administration/user/${id}`,
          method: "PUT",
          body: body,
        };
      },
      invalidatesTags: () => ["ADMINISTRATION"],
    }),
    deleteUser: build.mutation<HTTPResponse<void>, { id: any }>({
      query: ({ id }) => {
        return {
          url: `/administration/user/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: () => ["ADMINISTRATION"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApiEndpoints;
