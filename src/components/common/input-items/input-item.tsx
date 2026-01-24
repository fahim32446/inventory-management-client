import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  type ColProps,
  type FormItemProps,
  type InputNumberProps,
  type InputProps,
  type SelectProps,
  type UploadFile,
} from 'antd';
import type { DatePickerProps, UploadProps } from 'antd';
import { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { BaseInputWrapper } from './baseInput-wrapper';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { TextAreaProps } from 'antd/es/input';

interface CommonRangeInputProps extends RangePickerProps {
  formItemProps?: FormItemProps;
  colProps?: ColProps;
}

export const CommonRangeInput: React.FC<CommonRangeInputProps> = ({
  // value,
  // onChange,
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <DatePicker.RangePicker {...rest} style={{ width: '100%' }} />
    </BaseInputWrapper>
  );
};
interface CommonDateInputProps extends DatePickerProps {
  value?: Dayjs | Dayjs[] | null;
  onChange?: (value: Dayjs | Dayjs[] | null) => void;
  formItemProps?: FormItemProps;
  colProps?: ColProps;
  [key: string]: any;
}

export const CommonDateInput: React.FC<CommonDateInputProps> = ({
  value,
  onChange,
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <DatePicker
        {...rest}
        value={value}
        onChange={(date) => onChange?.(date as any)}
        style={{ width: '100%' }}
      />
    </BaseInputWrapper>
  );
};

interface CommonTextInputProps extends InputProps {
  formItemProps?: FormItemProps;
  colProps?: ColProps;
}

export const CommonTextInput: React.FC<CommonTextInputProps> = ({
  // value,
  // onChange,
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <Input {...rest} />
    </BaseInputWrapper>
  );
};

interface CommonTextAreaProps extends TextAreaProps {
  formItemProps?: FormItemProps;
  colProps?: ColProps;
}

export const CommonTextArea: React.FC<CommonTextAreaProps> = ({
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <Input.TextArea {...rest} />
    </BaseInputWrapper>
  );
};

interface CommonNumberInputProps extends InputNumberProps<any> {
  value?: number;
  onChange?: (value: number | null) => void;
  formItemProps?: FormItemProps;
  colProps?: ColProps;
  [key: string]: any;
}

export const CommonNumberInput: React.FC<CommonNumberInputProps> = ({
  value,
  onChange,
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <InputNumber
        {...rest}
        value={value}
        onChange={(val) => onChange?.(val)}
        style={{ width: '100%' }}
      />
    </BaseInputWrapper>
  );
};

type OptionType = { label: string; value: string | number };

interface CommonSelectInputProps extends SelectProps<any> {
  options: OptionType[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  formItemProps?: FormItemProps;
  colProps?: ColProps;
  [key: string]: any;
}

export const CommonSelectInput: React.FC<CommonSelectInputProps> = ({
  options,
  value,
  onChange,
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <Select {...rest} value={value} onChange={(val) => onChange?.(val)} options={options} />
    </BaseInputWrapper>
  );
};

interface CommonSwitchInputProps {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  formItemProps?: FormItemProps;
  colProps?: ColProps;
  [key: string]: any;
}

export const CommonSwitchInput: React.FC<CommonSwitchInputProps> = ({
  value,
  onChange,
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <Switch {...rest} checked={value} onChange={(checked) => onChange?.(checked)} />
    </BaseInputWrapper>
  );
};

interface CommonPasswordInputProps extends InputProps {
  formItemProps?: FormItemProps;
  colProps?: ColProps;
}

export const CommonPasswordInput: React.FC<CommonPasswordInputProps> = ({
  formItemProps,
  colProps,
  ...rest
}) => {
  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      <Input.Password {...rest} />
    </BaseInputWrapper>
  );
};

const { Dragger } = Upload;

interface CommonUploadInputProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  formItemProps?: FormItemProps;
  colProps?: ColProps;
  dragger?: boolean;
  listType?: 'text' | 'picture' | 'picture-card';
  maxCount?: number;
}

export const CommonUploadInput: React.FC<CommonUploadInputProps> = ({
  value = [],
  onChange,
  formItemProps,
  colProps,
  dragger = false,
  listType = 'picture-card',
  maxCount = 5,
  ...rest
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(value);

  const handleChange: UploadProps['onChange'] = ({ fileList: newList }) => {
    setFileList(newList);
    onChange?.(newList);
  };

  const uploadButton =
    listType === 'picture-card' ? (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    ) : (
      <button type='button'>Upload</button>
    );

  const UploadComponent = dragger ? (
    <Dragger
      {...rest}
      fileList={fileList}
      listType={listType}
      maxCount={maxCount}
      onChange={handleChange}
    >
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text'>Click or drag file to this area</p>
      <p className='ant-upload-hint'>Supports single or bulk upload</p>
    </Dragger>
  ) : (
    <Upload
      {...rest}
      fileList={fileList}
      listType={listType}
      maxCount={maxCount}
      onChange={handleChange}
    >
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  );

  return (
    <BaseInputWrapper formItemProps={formItemProps} colProps={colProps}>
      {UploadComponent}
    </BaseInputWrapper>
  );
};
