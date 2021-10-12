import React, {useState, useEffect} from 'react';
import Web3Modal from "web3modal";
import axios from 'axios';
import { ethers } from 'ethers';
import { Layout, Menu, Modal, Button, Divider } from 'antd';
import {useHistory, NavLink} from 'react-router-dom';
import {
  FormatPainterOutlined,
  HomeOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {
  nftaddress, 
  nftmarketaddress,
} from '../config/config';
import './Mainlayout.css';


//ABI
//JSON representation of smart contracts
//Allows to interact with smart contracts from client side app.

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';


const { Header, Sider, Content } = Layout;

const Mainlayout = () =>{
  const [collapsed, setCollapsed] = useState(false);

  //creating instance of history hook (this will be used for logout)
  let history = new useHistory();

 
  const logout = () => {
    history.push('/');
  };
  // const redirectme = () => {
  //   history.push('/dashboard');
  // };

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('non-loaded');

  useEffect(() => {
      loadNfts();
  }, []);


  const loadNfts = async ()=>{
    const provider = new ethers.providers.JsonRpcProvider();
    // const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        name: meta.data.name,
        description: meta.data.description,
        image: meta.data.image
      }
      return item;
    }));

    setNfts(items);
    setLoadingState('loaded');
  };

  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNfts();
  };

  //Web monetization
  useEffect(()=>{
    const appPaymentPointer = "$ilp.uphold.com/YmrnAiDHZY3Y";
    var metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "monetization");
    metaTag.content = appPaymentPointer;
    document.getElementsByTagName("head")[0].appendChild(metaTag);
  }, []);

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
            {loadingState === 'loaded' && !nfts.length && (
                  <h1 className="px-20 py-10 text-3xl">Marketplace Empty!</h1>
            )}
            {
            <div className="flex justify-center">
              <div className="px-4" style={{ maxWidth: '1600px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  {
                    nfts.map((nft, i) => (
                      <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <img src={nft.image} />
                        <div className="p-4">
                          <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                          <div style={{ height: '70px', overflow: 'hidden' }}>
                            <p className="text-gray-400">{nft.description}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-black">
                          <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                          <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
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


export default Mainlayout