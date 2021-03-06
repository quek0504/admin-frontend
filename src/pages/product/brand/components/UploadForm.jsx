import React, { useState } from 'react';
import { connect } from 'umi';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

const UploadForm = (props) => {
    const { setLogoField , dispatch } = props;

    const [loading, setLoading] = useState(false);
    const [defaultFileList, setDefaultFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState(undefined);

    const handlePreview = (file) => {
        // console.log(file);
        window.open(imageUrl);
    }

    // check ant deisgn official API document
    // the function will be called when uploading is in progress, completed or failed
    // return { file : {/* ... */}, fileList: [/* ... */], event: {/* ... */}} }
    const handleChange = ({ file, fileList, event }) => {
        setDefaultFileList(fileList);
        if (file.status == "removed") {
            setImageUrl(undefined);
            setLogoField(undefined);
            setDefaultFileList([]);
        }
    };

    // custom request
    // https://github.com/react-component/upload#customrequest
    const uploadImage = (options) => {
        const { onSuccess, onError, file } = options;

        setLoading(true);

        dispatch({
            type: 'productBrand/getPreSigned',
            payload: file.name
        }).then((response) => {
            if (response.msg === "success") {
                const { url, endPointUrl } = response.data;
                dispatch({
                    type: 'productBrand/upload',
                    payload: {
                        url,
                        image: file
                    }
                }).then((uploadResponse) => {
                    if (uploadResponse.msg === "success") {
                        setLoading(false);
                        setImageUrl(endPointUrl);
                        setLogoField(endPointUrl);
                        message.success("Upload successful!");
                        onSuccess();
                    } else {
                        message.error("Upload to bucket unsuccessful!");
                        onError();
                    }
                })
            } 
            // get presigned url failed
            else {
                message.error("Service not available at this moment, please try again later!");
                onError();
            }
        });
    }

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            onPreview={handlePreview}
            onChange={handleChange}
            customRequest={uploadImage}
        >
            {defaultFileList.length == 0 ? uploadButton : null}
        </Upload>
    );
};

export default connect(({ productBrand }) => ({
    productBrand,
}))(UploadForm);
