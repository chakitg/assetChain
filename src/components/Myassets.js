import React, {useState, useEffect} from 'react';
import { ethers } from 'ethers'
import { Layout, Menu, Modal, Button, Divider } from 'antd';
import {useHistory, NavLink} from 'react-router-dom';
import axios from 'axios'
import Web3Modal from "web3modal"
import {
  FormatPainterOutlined,
  HomeOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './Mainlayout.css';
import {
  nftmarketaddress, nftaddress
} from '../config/config';

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

const { Header, Sider, Content } = Layout;

const Myassets = () =>{
  const [collapsed, setCollapsed] = useState(false);

   //Web monetization
    useEffect(()=>{
    const appPaymentPointer = "$ilp.uphold.com/YmrnAiDHZY3Y";
    var metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "monetization");
    metaTag.content = appPaymentPointer;
    document.getElementsByTagName("head")[0].appendChild(metaTag);
  }, []);
 
 
  //creating instance of history hook (this will be used for logout)
  let history = new useHistory();

  const logout = () => {
    history.push('/');
  };
  
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }



    return (
    // <div className="container">  
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {/* <div className="logo" /> */}
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} >
            <NavLink exact to="/dashboard" className="navlink" styl={{textDecoration: "none"}}>
                <Menu.Item key="1" icon={<HomeOutlined />} className="menu-item">
                  Home
                </Menu.Item>
            </NavLink>
            <NavLink exact to="/sellAssets" className="navlink">
                <Menu.Item key="2" icon={<ShoppingCartOutlined />} className="menu-item">
                  Sell Assets
                </Menu.Item>
            </NavLink>
            <NavLink exact to="/myAssets" className="navlink">
                <Menu.Item key="3" icon={<WalletOutlined />} className="menu-item">
                  My Assets 
                </Menu.Item>
            </NavLink>
            <NavLink exact to="/creatorDashboard" className="navlink">
                <Menu.Item key="3" icon={<FormatPainterOutlined />} className="menu-item">
                  Creator Dashboard
                </Menu.Item>
            </NavLink>
            <Divider />
                <Menu.Item key="4" icon={<LogoutOutlined />} onClick={logout}>
                  Logout
                </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              height: "100vh",
            }}
          >
            {loadingState ==='loaded' && !nfts.length && (
              <h1 className="py-10 px-20 text-3xl">You own Nothing currently.</h1>
            )}
            {
               <div className="flex justify-center">
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                      {
                        nfts.map((nft, i) => (
                          <div key={i} className="border shadow rounded-xl overflow-hidden">
                            <img src={nft.image} className="rounded" />
                            <div className="p-4 bg-black">
                              <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
            }

          </Content>
        </Layout>
      </Layout>
    // </div>
    );
  }

export default Myassets
