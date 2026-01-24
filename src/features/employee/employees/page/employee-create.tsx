import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Flex, Form, Row, Typography, Upload } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommonDateInput,
  CommonTextArea,
  CommonTextInput,
} from '../../../../components/common/input-items/input-item';
import SubmitButton from '../../../../components/common/submit-button';
import { Topbar } from '../../../../components/common/topbar/topbar';
import { createFormData, formateDatePost } from '../../../../utils/helper';
import { useCreateEmployeeMutation } from '../employee-api';

const { Text, Title } = Typography;

interface ISubmit {
  photo: File[];
  name: string;
  birth_date: string;
  phone_number: string;
  email: string;
  alternate_number: string;
  alternate_email: string;
  hire_date: string;
  address: string;
}

const EmployeeCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleImageChange = ({ fileList }: any) => {
    setFileList(fileList);

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const [create, { isLoading }] = useCreateEmployeeMutation();

  const onFinished = (values: ISubmit) => {
    const { photo, ...rest } = values;

    const formData = new FormData();

    const photoFile = (photo as any)?.[0]?.originFileObj;
    if (photoFile instanceof File) {
      formData.append('photo', photoFile);
    }

    const body = {
      ...rest,
      birth_date: formateDatePost(rest.birth_date),
      hire_date: formateDatePost(rest.hire_date),
    };

    createFormData(body, formData);

    create(formData)
      .unwrap()
      .then(() => navigate('/employee/employees'));
  };

  return (
    <div>
      <Topbar
        title='Add New Employee'
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Employees', href: '/employee/employees' },
          { label: 'Create', href: '/employee/employees/create' },
        ]}
        hideFilter
      />

      <Card>
        <Title level={5}>Employee Information</Title>
        <Text type='secondary'>
          Fill in the employee details carefully. Fields marked are required.
        </Text>

        <Divider />

        <Form form={form} {...layout} onFinish={onFinished}>
          <Row gutter={[24, 24]}>
            <Col lg={10}>
              <Form.Item
                label='Profile Photo'
                name='photo'
                rules={[{ required: true, message: 'Please upload a photo' }]}
                valuePropName='fileList'
                getValueFromEvent={(e) => e?.fileList}
              >
                <Upload
                  accept='image/*'
                  listType='text'
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleImageChange}
                >
                  <div className='flex flex-col items-center gap-3'>
                    <Avatar size={120} src={imageUrl} icon={<UserOutlined />} className='border' />
                    <span className='cursor-pointer text-blue-500'>
                      <UploadOutlined /> Upload Photo
                    </span>
                  </div>
                </Upload>
              </Form.Item>

              <CommonTextInput
                formItemProps={{
                  name: 'name',
                  label: 'Employee Name',
                  rules: [{ required: true }],
                }}
                placeholder='Provide employee name'
              />

              <CommonDateInput
                formItemProps={{
                  name: 'birth_date',
                  label: 'Date of Birth',
                  rules: [{ required: true }],
                }}
                placeholder='Provide date of birth'
              />

              <CommonTextInput
                formItemProps={{
                  name: 'phone_number',
                  label: 'Primary Phone No',
                  rules: [{ required: true }],
                }}
                placeholder='Provide primary phone number'
              />
            </Col>
            <Col lg={14}>
              <CommonTextInput
                formItemProps={{
                  name: 'email',
                  label: 'Primary Email',
                  rules: [{ type: 'email', required: true }],
                }}
                placeholder='Provide primary email'
              />
              <CommonTextInput
                formItemProps={{ name: 'alternate_number', label: 'Secondary Phone No' }}
                placeholder='Provide alternate phone number'
              />

              <CommonTextInput
                formItemProps={{
                  name: 'alternate_email',
                  label: 'Secondary Email',
                  rules: [{ type: 'email' }],
                }}
                placeholder='Provide alternate email'
              />

              <CommonDateInput
                formItemProps={{ name: 'hire_date', label: 'Join Date' }}
                placeholder='Provide join date'
              />

              <CommonTextArea
                formItemProps={{ name: 'address', label: 'Address' }}
                placeholder='Provide address'
              />
            </Col>
          </Row>

          <Flex>
            <SubmitButton loading={isLoading} />
          </Flex>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeCreate;
