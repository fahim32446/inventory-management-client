import {
  EditOutlined,
  EyeOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Pagination,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import usePagination from '../../../../components/common/hooks/usePagination';
import { Topbar } from '../../../../components/common/topbar/topbar';
import { useAppDispatch } from '../../../../hooks/hooks';
import { showModal } from '../../../../redux/slice/modalSlice';
import { getImageLink } from '../../../../utils/request';
import EmployeeDetails from '../components/employee-details';
import { useGetEmployeeQuery } from '../employee-api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const EmployeeDirectory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { limit, skip, changePagination } = usePagination();
  const { data, isLoading } = useGetEmployeeQuery({ limit, skip });

  return (
    <div>
      <div className='mx-auto'>
        <Topbar
          title='LIST OF EMPLOYEES'
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Employees' }]}
          popOverProps={{ hideDateRange: true }}
          onCreateClick={() => navigate('/employee/employees/create')}
        />

        <Row gutter={[24, 24]}>
          {data?.data?.map((emp) => (
            <Col xs={24} sm={12} lg={8} key={emp.id}>
              <Card
                loading={isLoading}
                className='group transition-all duration-300 relative overflow-hidden'
              >
                <div className='absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 opacity-50' />

                <div className='relative z-10'>
                  <div className='flex justify-between items-start mb-6'>
                    <Badge dot status={emp.status ? 'success' : 'default'} offset={[-5, 75]}>
                      <Avatar
                        size={80}
                        src={getImageLink(emp.photo)}
                        className='shadow-lg border-2 border-white'
                      />
                    </Badge>
                  </div>

                  <div className='mb-6'>
                    <Title level={4} className='m-0! font-bold! text-slate-800'>
                      {emp.name}
                    </Title>
                  </div>

                  <div className='space-y-3 mb-6'>
                    <div className='flex items-center gap-3 text-slate-500'>
                      <MailOutlined className='text-[16px]' />
                      <Text className='text-sm truncate'>{emp.email}</Text>
                    </div>
                    <div className='flex items-center gap-3 text-slate-500'>
                      <PhoneOutlined className='text-[16px]' />
                      <Text className='text-sm'>{emp.phone_number}</Text>
                    </div>
                    <div className='flex items-center gap-3 text-slate-500'>
                      <IdcardOutlined className='text-[16px]' />
                      <Text className='text-sm'>{emp.employee_id}</Text>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Space>
                      <Tooltip title='View Profile'>
                        <Button
                          shape='circle'
                          icon={<EyeOutlined />}
                          onClick={() => {
                            dispatch(
                              showModal({
                                content: <EmployeeDetails details={emp} />,
                                width: 700,
                                contentPadding: 0,
                              }),
                            );
                          }}
                          className='hover:text-indigo-600 hover:bg-indigo-50 border-none shadow-none'
                        />
                      </Tooltip>
                      <Tooltip title='Edit Profile'>
                        <Button
                          shape='circle'
                          icon={<EditOutlined />}
                          className='hover:text-orange-600 hover:bg-orange-50 border-none shadow-none'
                        />
                      </Tooltip>
                    </Space>
                    <Tag
                      color={emp.two_fa ? 'green' : 'default'}
                      className='rounded-full px-3 border-none font-medium'
                    >
                      {emp.two_fa ? 'SECURE' : 'UNSECURE'}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className='mt-12 flex justify-center'>
          <Pagination
            onChange={changePagination(data?.total)}
            current={skip}
            pageSize={limit}
            total={data?.total}
            showSizeChanger
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDirectory;
