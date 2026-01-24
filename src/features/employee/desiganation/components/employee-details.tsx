import {
  CalendarOutlined,
  EditOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Divider, Tag, Typography } from 'antd';
import { getImageLink } from '../../../../utils/request';
import { IEmployee } from '../employee.interface';
import { useAppDispatch } from '../../../../hooks/hooks';
import { closeModal } from '../../../../redux/slice/modalSlice';

const { Title, Text } = Typography;
type Props = {
  details: IEmployee;
};

const EmployeeDetails = ({ details }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div className='flex flex-col'>
      <div className='h-32 bg-linear-to-r from-indigo-600 to-blue-500 relative'>
        <div className='absolute -bottom-12 left-8'>
          <Avatar
            size={100}
            src={getImageLink(details?.photo)}
            className='border-4 border-white shadow-xl'
          />
        </div>
      </div>

      <div className='pt-16 px-8 pb-8'>
        <div className='flex justify-between items-start mb-8'>
          <div>
            <Title level={3} className='m-0!'>
              {details?.name}
            </Title>
            <Text className='text-indigo-500 font-medium'>@{details?.username}</Text>
          </div>
          <Tag color='green-inverse' className='rounded-full border-none px-4 py-1'>
            Active Member
          </Tag>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <section>
            <Text className='text-[10px] font-bold text-gray-400 uppercase tracking-[2px] block mb-4'>
              Contact Information
            </Text>
            <div className='space-y-4'>
              <div className='flex gap-4'>
                <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600'>
                  <MailOutlined />
                </div>
                <div>
                  <Text type='secondary' className='text-xs block'>
                    Email Address
                  </Text>
                  <Text className='font-semibold'>{details?.email}</Text>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600'>
                  <PhoneOutlined />
                </div>
                <div>
                  <Text type='secondary' className='text-xs block'>
                    Phone Number
                  </Text>
                  <Text className='font-semibold'>{details?.phone_number}</Text>
                </div>
              </div>
            </div>
          </section>

          <section>
            <Text className='text-[10px] font-bold text-gray-400 uppercase tracking-[2px] block mb-4'>
              Employment Details
            </Text>
            <div className='space-y-4'>
              <div className='flex gap-4'>
                <div className='w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600'>
                  <CalendarOutlined />
                </div>
                <div>
                  <Text type='secondary' className='text-xs block'>
                    Hire Date
                  </Text>
                  <Text className='font-semibold'>{details?.hire_date}</Text>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600'>
                  <GlobalOutlined />
                </div>
                <div>
                  <Text type='secondary' className='text-xs block'>
                    Location
                  </Text>
                  <Text className='font-semibold'>{details?.address}</Text>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Divider />
        <div className='pt-0 flex justify-end gap-3'>
          <Button
            onClick={() => dispatch(closeModal())}
            className='rounded-xl border-none bg-gray-100 text-gray-600 px-8 font-bold'
          >
            Close
          </Button>
          <Button
            type='primary'
            icon={<EditOutlined />}
            className='rounded-xl bg-indigo-600 px-8 font-bold shadow-lg shadow-indigo-200'
          >
            Edit Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
