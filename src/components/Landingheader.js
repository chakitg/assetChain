import React, { useState } from 'react';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Drawer, Button, Typography} from 'antd';
import Login from './Login';
import 'antd/dist/antd.css';
import './Landingheader.css';
import {LoginOutlined} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const Landingheader = () => {
    const [visible, setVisible] = useState(false);
        const showDrawer = () => {
            setVisible(true);
        };
        const onClose = () => {
            setVisible(false);
    };
    
    return (
        <div className="container">
            
            <div className="container-content">
                <Title className="main-title" strong>assetChain</Title>
                <Button type="primary" className="button" onClick={showDrawer}>Login<span icon={<LoginOutlined />}></span>
                </Button>
            </div>
                <Drawer title="Login" placement="right" onClose={onClose} visible={visible} width={600}>
                    <Login />
                </Drawer>
        </div>
    )
}

export default Landingheader
