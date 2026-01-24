import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Form, Row } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useForm } from 'antd/es/form/Form';
import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from './hooks/useUrlParams';
import { CommonRangeInput, CommonTextInput } from './input-items/input-item';
import Reload from './reload';
import { useAppDispatch } from '../../hooks/hooks';
import { showModal } from '../../redux/slice/modalSlice';
import { formatDateRangeArray, parseDateRangeObject } from '../../utils/helper';

type Props = {
  refetch: any;
  addUrl?: string;
  breadCrumb?: ItemType[];
  state?: string;
  buttonLabel?: string;
  hideDate?: boolean;
  hideSearch?: boolean;
  extraFilter?: React.ReactNode;
  openModal?: {
    show: boolean;
    content: React.ReactNode;
    title: string;
    width?: 600 | 650 | 750 | 800 | 850 | 900 | 950 | 1024 | 1366 | 1920 | number;
  };
};

const TableFilter = ({
  refetch,
  addUrl,
  openModal,
  buttonLabel = 'Create',
  hideDate,
  hideSearch,
  extraFilter,
  breadCrumb,
}: Props) => {
  const navigate = useNavigate();
  const { setUrlParam, setUrlParamsFromObject, getAllUrlParams } = useUrlParams();

  const params_value = getAllUrlParams() as {
    search: string | null;
    from_date: string | null;
    to_date: string | null;
  };

  const [form] = useForm();
  const dispatch = useAppDispatch();

  const handelSearch = useMemo(
    () =>
      debounce((e: string) => {
        setUrlParam('search', e);
      }, 600),
    [setUrlParam]
  );

  useEffect(() => {
    form.setFieldsValue({
      search: params_value.search,
      date_range: parseDateRangeObject({
        from_date: params_value.from_date,
        to_date: params_value.to_date,
      }),
    });
  }, [params_value]);

  return (
    <>
      <Breadcrumb items={breadCrumb} />
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 10 }}
        style={{ marginBottom: '25px' }}
        justify={'space-between'}
      >
        <Col span={12}>
          <Row gutter={10} style={{ gap: '10px' }}>
            <Button
              onClick={() =>
                openModal?.show
                  ? dispatch(
                      showModal({
                        content: openModal.content,
                        title: openModal.title,
                        width: openModal.width,
                      })
                    )
                  : navigate(addUrl!, { state: location.pathname })
              }
              icon={<PlusOutlined />}
              type='primary'
            >
              {buttonLabel}
            </Button>

            <Reload
              refetch={() => {
                refetch();
              }}
            />
          </Row>
        </Col>

        <Col span={12}>
          <Form form={form}>
            <Row justify={'end'} gutter={[10, 10]}>
              {!hideDate ? (
                <CommonRangeInput
                  colProps={{ lg: 8 }}
                  formItemProps={{ noStyle: true, name: 'date_range' }}
                  allowClear
                  onChange={(e) => setUrlParamsFromObject(formatDateRangeArray(e))}
                />
              ) : undefined}
              {!hideSearch ? (
                <CommonTextInput
                  prefix={<SearchOutlined />}
                  colProps={{ lg: 6 }}
                  name={'search'}
                  formItemProps={{ noStyle: true }}
                  placeholder='Search here ...'
                  onChange={(e) => handelSearch(e.target.value)}
                />
              ) : undefined}

              {extraFilter && extraFilter}
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default TableFilter;
