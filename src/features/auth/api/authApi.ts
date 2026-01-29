import { HTTPResponse } from '../../../components/common/type';
import { baseApi } from '../../../redux/api/baseApi';
import { logout, setAuth, setProfileData } from '../../../redux/slice/authSlice';
import {
  IChangePasswordBody,
  ICurrentLogin,
  ILoginBody,
  ILoginResponse,
  IMatchOTPResponse,
  IMatchOTPVerificationBody,
  IProfileDataResponse,
  IResetPasswordBody,
  ISendEmailVerificationBody,
  IToggle2FABody,
  IUpdateProfileBody,
} from '../auth.interface';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginBody>({
      query: (body) => {
        return {
          url: '/public/auth/login',
          method: 'POST',
          body,
          credentials: 'include',
        };
      },
      invalidatesTags: ['USER'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success && !data?.data?.two_fa) {
            dispatch(
              setAuth({
                data: data.data,
                accessToken: data.accessToken,
                success: data.success,
                message: data.message,
              }),
            );
          }

          if (data?.data?.two_fa) {
            console.log('Two-factor auth required');
          }
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),
    refreshToken: builder.query<ILoginResponse, void>({
      query: (body) => {
        return {
          url: '/public/auth/refresh-token',
          method: 'GET',
          body,
        };
      },
      providesTags: ['USER'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success && !data?.data?.two_fa) {
            dispatch(setAuth(data));
          }

          if (data?.data?.two_fa) {
            console.log('Two-factor auth required');
          }
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),

    login2FA: builder.mutation<ILoginResponse, ILoginBody>({
      query: (body) => {
        return {
          url: '/public/auth/login/2fa',
          method: 'POST',
          body,
          credentials: 'include',
        };
      },
      invalidatesTags: ['USER'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(setAuth(data));
          }

          if (data?.data?.two_fa) {
            console.log('Two-factor auth required');
          }
        } catch (err) {
          console.error('Login failed:', err);
        }
      },
    }),

    logOut: builder.mutation<HTTPResponse<void>, void>({
      query: () => {
        return {
          url: '/public/auth/logout',
          method: 'POST',
        };
      },
      invalidatesTags: ['USER'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(logout());
            localStorage.removeItem('persist:360_erp_admin');
            dispatch(baseApi.util.resetApiState());
          }
        } catch (err) {
          dispatch(logout());
          localStorage.removeItem('persist:360_erp_admin');
          dispatch(baseApi.util.resetApiState());
          console.error('Login failed:', err);
        } finally {
          dispatch(logout());
          localStorage.removeItem('persist:360_erp_admin');
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    sendEmailVerification: builder.mutation<
      HTTPResponse<{ email: string }>,
      ISendEmailVerificationBody
    >({
      query: (body) => {
        return {
          url: '/public/auth/email-otp/send',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['USER'],
    }),
    matchOptVerification: builder.mutation<IMatchOTPResponse, IMatchOTPVerificationBody>({
      query: (body) => {
        return {
          url: '/public/auth/email-otp/match',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['USER'],
    }),
    resetPassword: builder.mutation<HTTPResponse<void>, IResetPasswordBody>({
      query: (body) => {
        return {
          url: '/public/auth/reset-password',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['USER'],
    }),
    getProfile: builder.query<IProfileDataResponse, void>({
      query: () => {
        return {
          url: '/admin/profile',
          method: 'GET',
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.success) {
            dispatch(setProfileData(data?.data));
          }

          if (data?.data?.two_fa) {
            console.log('Two-factor auth required');
          }
        } catch (_err) {
          console.error('Profile failed:');
        }
      },
      providesTags: ['USER'],
    }),
    updateProfile: builder.mutation<HTTPResponse<void>, IUpdateProfileBody>({
      query: (body) => ({
        url: '/admin/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['USER'],
    }),
    changePassword: builder.mutation<HTTPResponse<void>, IChangePasswordBody>({
      query: (body) => ({
        url: '/admin/profile/change-password',
        method: 'POST',
        body,
      }),
    }),
    toggle2FA: builder.mutation<HTTPResponse<void>, IToggle2FABody>({
      query: (body) => ({
        url: '/admin/profile',
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['USER'],
    }),
    getCurrentLogin: builder.query<HTTPResponse<ICurrentLogin[]>, void>({
      query: () => ({
        url: '/admin/profile/sessions',
        method: 'GET',
      }),
      providesTags: ['SESSIONS'],
    }),
    revokeSession: builder.mutation<HTTPResponse<void>, { sessionId: string }>({
      query: (body) => ({
        url: `/admin/profile/sessions/${body.sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SESSIONS'],
    }),
    revokeAllSessions: builder.mutation<HTTPResponse<void>, void>({
      query: () => ({
        url: '/admin/profile/sessions',
        method: 'DELETE',
      }),
      invalidatesTags: ['SESSIONS'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogin2FAMutation,
  useGetProfileQuery,
  useResetPasswordMutation,
  useSendEmailVerificationMutation,
  useMatchOptVerificationMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useToggle2FAMutation,
  useGetCurrentLoginQuery,
  useRevokeSessionMutation,
  useRefreshTokenQuery,
  useRevokeAllSessionsMutation,
  useLogOutMutation,
} = authApi;
