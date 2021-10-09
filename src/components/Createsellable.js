import React, {useState} from 'react';
import { Layout, Menu, Modal, Button, Divider } from 'antd';
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {useHistory, NavLink} from 'react-router-dom';
import Web3Modal from 'web3modal'
import {
  FormatPainterOutlined,
  HomeOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {
  nftaddress, nftmarketaddress
} from '../config/config';
import './Mainlayout.css';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


const { Header, Sider, Content } = Layout;
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Createsellable = () =>{
  const [collapsed, setCollapsed] = useState(false);

  //creating instance of history hook (this will be used for logout)
  let history = new useHistory();

 
  const logout = () => {
    history.push('/');
  };

  // const CreateItem = () => {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  // const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    history.push('/dashboard');
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
            {
              <div className="flex justify-center">
                <div className="w-1/2 flex flex-col pb-12">
                  <input 
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                  />
                  <textarea
                    placeholder="Asset Description"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                  />
                  <input
                    placeholder="Asset Price in Eth"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                  />
                  <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                  />
                  {
                    fileUrl && (
                      <img className="rounded mt-4" width="350" src={fileUrl} />
                    )
                  }
                  <button onClick={createMarket} className="font-bold mt-4 bg-blue-700 text-white rounded p-4 shadow-lg">
                    Create Digital Asset
                  </button>
                </div>
              </div>
            }
            


          </Content>
        </Layout>
      </Layout>
    // </div>
    );
  }

export default Createsellable
