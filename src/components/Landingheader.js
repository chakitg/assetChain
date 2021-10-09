import React, { useState } from 'react';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Drawer, Button, Typography} from 'antd';
import Login from './Login';
import 'antd/dist/antd.css';
import './Landingheader.css';
import {LoginOutlined} from '@ant-design/icons';
import Typewriter from 'typewriter-effect';

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
               <div className="typing-animation">
                <Typewriter 
                    onInit={(type)=>{
                        type
                        .typeString("Digital Marketplace for all!")
                        .pauseFor(1500)
                        .deleteAll()
                        .typeString("Sel Assets")
                        .pauseFor(1500)
                        .deleteAll()
                        .typeString("Buy Assets")
                        .pauseFor(1500)
                        .deleteAll()
                        .typeString("Hassle-free Login :)")
                        .pauseFor(1500)
                        .deleteAll()
                        .typeString("It's Super secure")
                        .pauseFor(1500)
                        .deleteAll()
                        .start()

                    }}
                />
            </div>
                <Button type="primary" className="button" onClick={showDrawer}>Login<span icon={<LoginOutlined />}></span>
                </Button>
            </div>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,144C672,117,768,75,864,90.7C960,107,1056,181,1152,213.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,288L48,288C96,288,192,288,288,288C384,288,480,288,576,256C672,224,768,160,864,122.7C960,85,1056,75,1152,90.7C1248,107,1344,149,1392,170.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
                <Drawer title="Login" placement="right" onClose={onClose} visible={visible} width={600}>
                    <Login />
                </Drawer>
        </div>
    )
}

export default Landingheader
