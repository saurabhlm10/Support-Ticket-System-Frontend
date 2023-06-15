import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Tab, Tabs, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

axios.defaults.baseURL = process.env.SERVER_URL

function Chat() {
  const [username, setUsername] = useState('')
  const [messages, setMessages] = useState([]);


  const messageInputRef = useRef();

  useEffect(() => {

    const user = "Hello" || (prompt('Enter your username:'));
    setUsername(user)
    socket.emit('register', user);

    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    socket.on('message', data => {
      console.log('Received message:', data);
      setMessages(messages => [...messages, data]);
    });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const text = messageInputRef.current.value.trim();
    if (text) {
      socket.emit('message', { text });
      messageInputRef.current.value = '';
    }
  }

  return (


    <div className="w-full px-5 flex flex-col justify-between">
      <div className="flex flex-col mt-5">
        <div className="flex justify-end mb-4">
          <div
            className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
          >
            Welcome to group everyone !
          </div>
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
        </div>
        <div className="flex justify-start mb-4">
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
          <div
            className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
            at praesentium, aut ullam delectus odio error sit rem. Architecto
            nulla doloribus laborum illo rem enim dolor odio saepe,
            consequatur quas?
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <div>
            <div
              className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Magnam, repudiandae.
            </div>

            <div
              className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Debitis, reiciendis!
            </div>
          </div>
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
        </div>
        <div className="flex justify-start mb-4">
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
          <div
            className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
          >
            happy holiday guys!
          </div>
        </div>
      </div>
      <div className="py-2">
        <input
          className="w-full bg-gray-300 py-2 px-3 rounded"
          type="text"
          placeholder="type your message here..."
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [value, setValue] = useState(0);
  const [openItems, setOpenItems] = useState([])
  const [requestItems, setRequestItems] = useState([])
  const [closedItems, setClosedItems] = useState([])

  const [activeChat, setActiveChat] = useState({})

  const getUserOpenChats = async () => {
    try {
      const response = await axios.get('/api/issue/chats/open/64344332393b1bc04864070f')

      return response.data.openIssues;

    } catch (error) {
      console.log(error)
    }
  }

  const getUserRequestedChats = async () => {
    try {
      const response = await axios.get('/api/issue/chats/requested/64344332393b1bc04864070f')

      return response.data.requestedIssues;

    } catch (error) {
      console.log(error)
    }
  }


  const getUserClosedChats = async () => {
    try {
      const response = await axios.get('/api/issue/chats/closed/64344332393b1bc04864070f')

      setClosedItems([...response.data.closedIssues])
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    Promise.all([getUserOpenChats(), getUserRequestedChats()])
      .then(([openIssues, requestedIssues]) => {
        console.log(openIssues)
        console.log(requestedIssues)
        openIssues && openIssues.length !== 0 && setOpenItems([...openIssues])

        requestedIssues && requestedIssues !== 0 && setRequestItems([...requestedIssues])
      })
  }, [])


  return (
    <>
      <Head>
        <title>Support Ticket System</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
      <Toaster position="top-right" />
        {/* <Chat /> */}
        <div className='grid grid-cols-5 h-screen '>
          <div className='col-span-1 overflow-y-scroll'>
            <div className='px-3 pt-2'>
              <TextField className='w-full' sx={{ paddingY: 0 }} />
            </div>

            <div>
              <Tabs value={value} onChange={(event, newValue) => {
                newValue === 2 && getUserClosedChats();
                setValue(newValue)
              }}>
                <Tab label={`OPEN(${openItems.length})`} />
                <Tab label={`REQUESTS(${requestItems.length})`} />
                <Tab label={`CLOSED(${closedItems.length})`} />
              </Tabs>

              {value === 0 && (
                <div className='my-2 space-y-1'>
                  {openItems.map((item, id) => (
                    <div
                      key={id}
                      className='mx-1 px-2 py-1 border-2 bg-red-100 border-dotted rounded h-24 cursor-pointer'
                      onClick={() => setActiveChat(openItems[id])}
                    >
                      <div>
                        <p className='text-lg'>#{item.tokenId}</p>
                        <p className=''>{item.studentEmail}</p>
                      </div>
                      <div className='flex justify-between'>
                        <p className='text-xl'>Saurabh</p>
                        <p className='bg-red-300 w-8 aspect-square grid place-content-center rounded-full '>{item.type.slice(0, 1).toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>

              )}
              {value === 1 && (
                <div className='my-2 space-y-1'>
                  {requestItems.map((item, id) => (
                    <div
                      key={id}
                      className='mx-1 px-2 py-1 border-2 bg-red-100 border-dotted rounded h-24 cursor-pointer'
                      onClick={() => setActiveChat(requestItems[id])}
                    >

                      <div>
                        <p className='text-lg'>#{item.tokenId}</p>
                        <p className=''>{item.studentEmail}</p>
                      </div>
                      <div className='flex justify-between'>
                        <p className='text-xl'>Saurabh</p>
                        <p className='bg-red-300 w-8 aspect-square grid place-content-center rounded-full '>{item.type.slice(0, 1).toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {value === 2 && (
                <div className='my-2 space-y-1'>
                  {closedItems.map((item, id) => (
                    <div
                      key={id}
                      className='mx-1 px-2 py-1 border-2 bg-red-100 border-dotted rounded h-24 cursor-pointer'
                      onClick={() => setActiveChat(closedItems[id])}
                    >
                      <div>
                        <p className='text-lg'>#{item.tokenId}</p>
                        <p className=''>{item.studentEmail}</p>
                      </div>
                      <div className='flex justify-between'>
                        <p className='text-xl'>Saurabh</p>
                        <p className='bg-red-300 w-8 aspect-square grid place-content-center rounded-full '>{item.type.slice(0, 1).toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* <div className='col-span-1'>
              <Tabs className='' aria-label="icon label tabs example">
                <Tab label="OPEN" />
                <Tab label="REQUESTS" />
                <Tab label="CLOSED" />
              </Tabs>

              <div className='px-3'>
                <TextField className='w-full' sx={{ paddingY: 0 }} />
              </div>

              <div className='my-2 space-y-1'>
                <div className='mx-1 px-2 py-1 border-2 bg-red-100 border-dotted rounded h-24'>
                  <div>
                    <p className='text-lg'>#1d222</p>
                    <p className=''>shubhamvscode@gmail.com</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-xl'>Saurabh</p>
                    <p className='bg-red-300 w-8 aspect-square grid place-content-center rounded-full '>A</p>
                  </div>
                </div>

                <div className='mx-1 px-2 py-1 border-2 bg-red-100 border-dotted rounded h-24'>
                  <div>
                    <p className='text-lg'>#4dwe2</p>
                    <p className=''>shubhamvscode@gmail.com</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-xl'>Saurabh</p>
                    <p className='bg-red-300 w-8 aspect-square grid place-content-center rounded-full '>A</p>
                  </div>
                </div>

                <div className='mx-1 px-2 py-1 border-2 bg-red-100 border-dotted rounded h-24'>
                  <div>
                    <p className='text-lg'>#sf55s</p>
                    <p className=''>shubhamvscode@gmail.com</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-xl'>Saurabh</p>
                    <p className='bg-red-300 w-8 aspect-square grid place-content-center rounded-full '>A</p>
                  </div>
                </div>
              </div>
            </div> */}
          <div className='bg-pink-100 col-span-3 h-screen'>
            {Object.keys(activeChat).length === 0 ? (
              <div>
                Nothing
              </div>
            ) : (

              <div>
                <div className='bg-red-200 grid grid-cols-3 px-6 py-4 sticky top-0'>
                  <h1>{activeChat.handler.name}</h1>
                  <div className='text-center'>
                    {activeChat.type.toUpperCase()} &nbsp;
                    <span>#{activeChat.tokenId}</span>
                  </div>
                  <p className='text-right'>{activeChat.studentEmail}</p>
                </div>
              </div>

            )}



            <div className='h-(calc(100vh-56px))'>
              {/* <Chat /> */}
            </div>
          </div>


          <div className='col-span-1'>
            {Object.keys(activeChat).length !== 0 &&
              <>
                <h1>{activeChat.studentEmail}</h1>
                <h1>{activeChat.studentPhone}</h1>

                {/* <h1>{JSON.stringify(activeChat.info)}</h1> */}

                {activeChat.type == 'no-access' && (
                  <>
                    <h1>NO-ACCESS</h1>
                    <h1>{activeChat.courseName}</h1>
                    <img src={`${activeChat.myCoursesScreenshot}`} />
                    <img src={`${activeChat.paymentReceiptScreenshot}`} />
                  </>


                )}
                {activeChat.type == 'assignment' && (
                  <>
                    <h1> assignment</h1>
                    {/* <h1>{JSON.stringify(activeChat)}</h1> */}
                  </>

                )}
                {activeChat.type == 'batch-change' && (
                  <>
                    <h1>batch-change</h1>
                    <h1>{activeChat.oldCourseName}</h1>
                    <h1>{activeChat.newCourseName}</h1>
                    <img src={`${activeChat.paymentReceiptScreenshot}`} />
                  </>
                )}
                {activeChat.type == 'other' && (
                  <h1>other</h1>
                )}
              </>
            }
          </div>
        </div>
      </div>
    </>
  )
}
