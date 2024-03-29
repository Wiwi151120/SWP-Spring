
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Highlighter from 'react-highlight-words';
import * as yup from "yup"
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Radio, Space, Table, Typography, notification } from 'antd';
import moment from 'moment/moment';
import ComInput from '../../Components/ComInput/ComInput';
import { textApp } from '../../../TextContent/textApp';
import { deleteData, getData, postData } from '../../../api/api';

import ComHeader from '../../Components/ComHeader/ComHeader';


export default function TableUser() {
    const [disabled, setDisabled] = useState(false);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [dataRun, setDataRun] = useState(false);
    const [productRequestDefault, setProductRequestDefault] = useState({});
    const [api, contextHolder] = notification.useNotification();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [error, setError] = useState("");
    const [valueSelect, setValueSelect] = useState('manager');
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValueSelect(e.target.value);
    };
    console.log(productRequestDefault);
    const showModalEdit = (e) => {
        setIsModalOpen(true);
    };

    const showModalDelete = (e) => {
        setProductRequestDefault({
            id: e._id
        })
        setIsModalOpenDelete(true);
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const deleteById = () => {
        setDisabled(true)
        deleteData('user', productRequestDefault.id)
            .then((data) => {
                setDisabled(false)
                handleCancelDelete()
                api["success"]({
                    message: textApp.TableProduct.Notification.delete.message,
                    description:
                        "Đã khóa tài khoản thành công"
                });
            })
            .catch((error) => {
                console.log(error);
                setDisabled(false)
                handleCancelDelete()
                api["error"]({
                    message: textApp.TableProduct.Notification.deleteError.message,
                    description:
                        "Không thể khóa tài khoản này"
                });
            })
        setDataRun(!dataRun)

    }
    const loginMessenger = yup.object({
        username: yup.string().required(textApp.Reissue.message.username).min(6, textApp.Reissue.message.usernameMIn),
        phone: yup.string().required(textApp.Reissue.message.phone).min(10, "Số điện thoại phải lớn hơn 9 số!").max(10, "Số điện thoại phải nhỏ hơn 11 số!").matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
        // .matches(/^[0-9]+$/, 'Số điện thoại phải chứa chỉ số'),
        password: yup.string().required(textApp.Reissue.message.password).min(5, textApp.Reissue.message.passwordMIn),
        password2: yup.string().required(textApp.Reissue.message.password2).min(5, textApp.Reissue.message.passwordMIn),
        email: yup.string().email(textApp.Reissue.message.emailFormat).required(textApp.Reissue.message.email),
    })
    const LoginRequestDefault = {
        // code: "",
        password: "",
        phone: "",
        username: "",
        email: "",

    };
    const methods = useForm({
        resolver: yupResolver(loginMessenger),
        defaultValues: {
            // code: "",
            username: "",
            phone: "",
            password: "",
            email: "",
        },
        values: productRequestDefault
    })
    const { handleSubmit, register, setFocus, watch, setValue } = methods




    const onSubmit = (data) => {
        if (data.password2 !== data.password) {
            return setError(textApp.Reissue.message.passwordCheck)
        }
        setDisabled(true)
        setError("")

        postData('/reg', { ...data, role: valueSelect }, {})
            .then((data) => {
                api["success"]({
                    message: 'Thành công!',
                    description:
                        "Tạo tài khoản thành công"
                });
                setDisabled(false)
                handleCancel()
                setProductRequestDefault({}) 
            })
            .catch((error) => {
                setError(error?.response?.data?.error||'Tài khoản đã tồn tại')
                console.error("Error fetching items:", error);
                setDisabled(false)
            });
        setDataRun(!dataRun)
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex, title) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${title}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
 
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Đặt lại
                    </Button>

                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [

        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
            width: 100,
            fixed: 'left',
            ...getColumnSearchProps('name', 'tên sản phẩm'),

        },

        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 110,
            key: 'createdAt',
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            render: (_, record) => (
                <div className="text-sm text-gray-700 line-clamp-4">
                    <p>{moment(record.createdAt).format('l')}</p>
                </div>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 110,
            key: 'phone',
        
        },
        {
            title: 'Gmail',
            dataIndex: 'email',
            width: 110,
            key: 'email',
        
        },

        {
            title: <div className='flex justify-center '>Tài khoản</div>,
            dataIndex: '',
            key: '',
            width: 100,
            render: (_, record) => (
                <div >
                    <div className='flex justify-center text-lg'>{record.role}</div>
                </div>
            ),

        },

    ];

    return (
        <>
            {contextHolder}
            <ComHeader/>
           
            <div className='flex p-5 justify-center'>
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={products}
                    scroll={{
                        x: 1520,
                        y: "70vh",
                    }}
                    bordered
                    pagination={{
                        showSizeChanger: true, // Hiển thị dropdown cho phép chọn số lượng dữ liệu
                        pageSizeOptions: ['10', '20', '50', '100'], // Các tùy chọn số lượng dữ liệu
                    }}
                />
            </div>
            <Modal title='Thêm tài khoản'
                okType="primary text-black border-gray-700"
                open={isModalOpen}

                width={800}
                style={{ top: 20 }}

                onCancel={handleCancel}>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <FormProvider {...methods} >
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

                            <ComInput
                                placeholder={textApp.Reissue.placeholder.username}
                                label={textApp.Reissue.label.username}
                                type="text"
                                // search
                                maxLength={26}
                                onchange={() => { setError("") }}
                                {...register("username")}
                                required
                            />

                            <ComInput
                                placeholder={textApp.Reissue.placeholder.phone}
                                label={textApp.Reissue.label.phone}
                                type="numbers"
                                maxLength={16}
                                {...register("phone")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.email}
                                label={textApp.Reissue.label.email}
                                type="text"
                                {...register("email")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.password}
                                label={textApp.Reissue.label.password}
                                type="password"
                                maxLength={26}
                                {...register("password")}
                                required
                            />
                            <ComInput
                                placeholder={textApp.Reissue.placeholder.password2}
                                label={textApp.Reissue.label.password2}
                                type="password"
                                maxLength={26}
                                {...register("password2")}
                                required
                            />
                            <Radio.Group onChange={onChange} value={valueSelect}>
                                <Space direction="vertical">
                                    <Radio value={'manager'}>Manager</Radio>
                                    <Radio value={'staff'}>Staff</Radio>
                                </Space>
                            </Radio.Group>
                            <h1 className="text-red-500">{error}</h1>

                        </form>
                    </FormProvider>
                </div>
            </Modal>

            <Modal title='Khóa tài khoản?'
                okType="primary text-black border-gray-700"
                open={isModalOpenDelete}

                width={800}
                style={{ top: 20 }}

                onCancel={handleCancelDelete}>
                <div className='text-lg p-6'>Bạn có chắc chắn muốn Khóa người dùng này không?</div>
                <div className='flex'>
                   
                </div>
            </Modal>
        </>
    )
}
