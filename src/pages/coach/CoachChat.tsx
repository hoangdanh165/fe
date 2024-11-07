import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  TypingIndicator,
  Avatar,
  ConversationList,
  Conversation,
  Search,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const CoachChat: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [coachProfile, setCoachProfile] = useState({});
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/users/info/");
        const profileData = response.data.profile || {};
        setCoachProfile({
          id: profileData.id ?? null,
          avatar: response.data.avatar_url ?? null,
          phone: response.data.phone ?? null,
          email: response.data.email ?? null,
          email_verified: response.data.email_verified ?? false,
          first_name: profileData.first_name ?? "",
          last_name: profileData.last_name ?? "",
          address: profileData.address ?? "",
          gender: profileData.gender ?? null,
          birthday: profileData.birthday ? new Date(profileData.birthday) : null,
          height: profileData.height ?? null,
          weight: profileData.weight ?? null,
          body_fat: profileData.body_fat ?? null,
          muscle_mass: profileData.muscle_mass ?? null,
          goal_weight: profileData.workout_goal?.weight ?? null,
          goal_muscle_mass: profileData.workout_goal?.muscle_mass ?? null,
          goal_body_fat: profileData.workout_goal?.body_fat ?? null,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [axiosPrivate]);

  useEffect(() => {
    if (coachProfile.id) {
      const fetchConversations = async () => {
        try {
          const response = await axiosPrivate.get(`/nodejs/chat/getChatMenuOfCoachId/${coachProfile.id}`);
          setConversations(response.data);
          console.log(response)
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      };

      fetchConversations();
    }
  }, [coachProfile.id, axiosPrivate]);

  const fetchMessages = async (coachId, customerId) => {
    try {
      const response = await axiosPrivate.get(`/nodejs/chat/getAllChatsOfCustomerIdAndCoachId?sendFrom=coach&coachId=${coachId}&customerId=${customerId}`);
      const sortedMessages = response.data.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.coach_id_id, conversation.customer_id_id);
  };

  const handleSend = async (message) => {
    if (message) {
      const newMessage = {
        coach_id_id: coachProfile.id,
        customer_id_id: selectedConversation.customer_id_id,
        content: message,
        extra_data: {
          send_by: "coach",
        },
      };

      try {
        await axiosPrivate.post('/nodejs/chat/sendMessage', newMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            content: message,
            sent_at: new Date().toISOString(),
            extra_data: {
              send_by: "coach",
            },
            coach_id_id: selectedConversation.coach_id_id,
            customer_id_id: selectedConversation.customer_id_id,
          },
        ]);
        setTyping(false); // Reset typing state after sending the message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleInputChange = (value) => {
    if (value.includes("<br>")) {
      setTyping(value.length > 4);
    } else {
      setTyping(value.length > 0);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (selectedConversation) {
        try {
          const response = await axiosPrivate.get(`/nodejs/chat/getAllChatsOfCustomerIdAndCoachId?sendFrom=coach&coachId=${selectedConversation.coach_id_id}&customerId=${selectedConversation.customer_id_id}`);
          const sortedMessages = response.data.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
          if (sortedMessages.length !== messages.length) {
            setMessages(sortedMessages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedConversation, messages.length, axiosPrivate]);

  const handleOpenDialog = async () => {
    try {
      const response = await axiosPrivate.get('/nodejs/chat/getAllCustomerProfiles');
      setCustomers(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching customer profiles:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCustomer('');
  };

  const handleCreateConversation = () => {
    const newConversation = {
      id: Date.now(),
      coach_id_id: coachProfile.id,
      customer_id_id: selectedCustomer,
      customer_data: customers.find(customer => customer.id === selectedCustomer),
      content: '',
    };
    setConversations([...conversations, newConversation]);
    setSelectedConversation(newConversation);
    setMessages([]);
    setDialogOpen(false);
  };

  const selectedCustomerData = customers.find(customer => customer.id === selectedCustomer);

  return (
    <Box display="flex" height="85vh" bgcolor="#171821" color="white">
      {/* Sidebar with conversation list */}
      <Box width="25%" bgcolor="#1f2029" p={2} display="flex" flexDirection="column">
        <Typography variant="h6" mb={2} color="white">
          Danh sách trò chuyện
        </Typography>
        <Search placeholder="Search..." style={{ marginBottom: "16px", color: "white" }} />
        <Button variant="contained" color="primary" onClick={handleOpenDialog} style={{ marginBottom: "16px" }}>
          Thêm
        </Button>
        <ConversationList>
          {conversations.map((conv) => (
            <Conversation
              key={conv?.id}
              name={`${conv?.customer_data?.first_name} ${conv?.customer_data?.last_name}`}
              info={truncateText(conv.content, 30)}
              active={conv?.id === selectedConversation?.id}
              onClick={() => handleConversationClick(conv)}
              style={{
                backgroundColor: conv?.id === selectedConversation?.id ? "#3a3b44" : "#2a2b34",
                color: "white",
              }}
            >
              <Avatar src={conv?.customer_data?.avatar_url ? conv?.customer_data?.avatar_url : "https://i.pinimg.com/originals/23/51/bc/2351bc65b2b5d75cef146b7edddf805b.gif"} name={`${conv?.customer_data?.first_name} ${conv?.customer_data?.last_name}`} />
            </Conversation>
          ))}
        </ConversationList>
      </Box>

      {/* Main Chat Container */}
      <Box flex={1} display="flex" flexDirection="column" bgcolor="#171821">
        <MainContainer style={{ border: "3px solid rgba(0,0,0,.87)" }}>
          <ChatContainer>
            <ConversationHeader style={{ border: "0px solid #171821", backgroundColor: "#171821" }}>        
              <Avatar src={
                selectedConversation?.customer_data?.avatar_url ? 
                  selectedConversation?.customer_data?.avatar_url 
                  : selectedConversation
                  ? "https://i.pinimg.com/originals/23/51/bc/2351bc65b2b5d75cef146b7edddf805b.gif"
                  : "https://www.pngkit.com/png/full/799-7998601_profile-placeholder-person-icon.png"
              } 
                name={
                  selectedConversation?.customer_data?.first_name
                } 
              />
              <ConversationHeader.Content 
                userName={
                  selectedConversation
                  ? selectedConversation?.customer_data?.first_name + " " + selectedConversation?.customer_data?.last_name
                  : ""
                } 
                info={
                  selectedConversation
                  ? "Online"
                  : ""
                }
              />
              <ConversationHeader.Actions>
                {/* <Button variant="contained" color="primary" size="small">Call</Button>
                <Button variant="contained" color="secondary" size="small">Video</Button> */}
              </ConversationHeader.Actions>
            </ConversationHeader>

            <MessageList typingIndicator={typing ? <TypingIndicator content="Typing..." style={{ backgroundColor: "#171821", color: "white" }} /> : null} style={{ backgroundColor: "#171821", color: "white" }}>
              {messages?.map((msg) => (
                <Message
                  key={msg.id}
                  model={{
                    message: msg?.content,
                    sentTime: msg?.sent_at,
                    sender: msg?.extra_data?.send_by === "coach" ? "coach" : "customer",
                    direction: msg?.extra_data?.send_by === "coach" ? "outgoing" : "incoming",
                    position: "normal",
                  }}
                />
              ))}
            </MessageList>

            <MessageInput placeholder="Type your message here..." onSend={handleSend} onChange={handleInputChange} style={{ backgroundColor: "#2a2b34", color: "white", border: "0px solid #171821" }} />
          </ChatContainer>
        </MainContainer>
      </Box>

      {/* Dialog for creating new conversation */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm cuộc trò chuyện mới</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="customer-label">Khách hàng</InputLabel>
            <Select
              labelId="customer-label"
              id="customer-select"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              renderValue={(selected) => {
                const customer = customers.find(c => c.id === selected);
                return customer ? `${customer.first_name} ${customer.last_name}` : '';
              }}
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {`${customer.first_name} ${customer.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedCustomerData && (
            <Box mt={2}>
              <Typography variant="body1"><strong>Địa chỉ:</strong> {selectedCustomerData.address}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {selectedCustomerData.customer.email}</Typography>
              <Typography variant="body1"><strong>Mỡ:</strong> {selectedCustomerData.body_fat}</Typography>
              <Typography variant="body1"><strong>Chiều cao:</strong> {selectedCustomerData.height}</Typography>
              <Typography variant="body1"><strong>Khối lượng cơ:</strong> {selectedCustomerData.muscle_mass}</Typography>
              <Typography variant="body1"><strong>Khối lượng toàn bộ:</strong> {selectedCustomerData.weight}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateConversation} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoachChat;