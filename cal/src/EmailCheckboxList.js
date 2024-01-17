import React, { useState } from 'react';
// import { Form, Button } from 'react-bootstrap';
import { Checkbox, Button, Form, Typography, Flex, DatePicker, Layout } from 'antd';
import axios from 'axios';

const { Text, Title } = Typography;
const { Header, Sider, Content } = Layout;

const EmailCheckboxList = ({ selectedDateRange , updatedEvents}) => {
  const emails = [
    "cesar.aguilar@monstar-lab.com",
    "matthew.knuti@monstar-lab.com",
    "nick.trienens@monstar-lab.com",
    "luis.ruiz@monstar-lab.com",
    "juliana.loaiza@monstar-lab.com",
    "camilo.alvarez@monstar-lab.com"
  ];

  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleCheckboxChange = (email) => {
    setSelectedEmails(selectedEmails.includes(email)
      ? selectedEmails.filter((e) => e !== email)
      : [...selectedEmails, email]);
  };


  const emailToName = (email) => {
    let [namePart] = email.split('@'); // Get the part before the '@'
    let nameParts = namePart.split('.'); // Split into first and last names

    // Capitalize each part and join them with a space
    return nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};


  const convertEvents = (cals) => {
    const colors = [
        'rgba(255, 255, 0, 0.3)',   // yellow
        // 'rgba(0, 0, 255, 0.3)',     // blue
        'rgba(0, 128, 0, 0.3)',     // green
        'rgba(255, 0, 0, 0.3)',     // red
        'rgba(255, 165, 0, 0.3)',   // orange
        'rgba(128, 0, 128, 0.3)',   // purple
        'rgba(255, 192, 203, 0.3)', // pink
        'rgba(165, 42, 42, 0.3)',   // brown
        'rgba(128, 128, 128, 0.3)', // grey
        'rgba(0, 255, 255, 0.3)'    // cyan
    ];
    
      let convertedEvents = [];
      let eventIndex = 0;
  
      Object.keys(cals).forEach((email) => {
          cals[email].busy.forEach((busyInterval) => {
              convertedEvents.push({
                  id: eventIndex,
                  start: new Date(busyInterval.start),
                  end: new Date(busyInterval.end),
                  title: 'Busy',
                  resourceId: eventIndex,
                  colorEvento: colors[eventIndex % colors.length] // Cycle through the colors
              });
          });
          eventIndex++;
      });
      return convertedEvents;
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`https://book-with-monstar-rfzisaddoa-uc.a.run.app/api/calendar/6598b4acd3a33c6d27a1b395`, {
        selectedEmails: selectedEmails,
        selectedDateRange: selectedDateRange
      });
      updatedEvents(convertEvents(response.data.cals));
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  const layoutStyle = {
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100% ',
    backgroundColor: '#fff',
  };
  const contentStyle = {
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100% ',
    backgroundColor: '#fff',
    padding: '24px',
  };

  return (    
    <Form>
      <Title level={2} >Calendar</Title>
      <Layout style={layoutStyle}>
      <Layout style={layoutStyle}>
        <Content style={contentStyle} >
 
        <Checkbox.Group style={{ width: '100%' }} onChange={setSelectedEmails}>
            <Flex align="start" wrap="wrap" gap="small" >
              { emails.map((email, index) => (
                <Checkbox value={email} key={index} checked={true} >
                  <Text>{emailToName(email)}</Text>
                </Checkbox>
              ))}
            </Flex>
          </Checkbox.Group>

        </Content>
        <Sider width="50%" style={layoutStyle}>
         
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: '16px', marginBottom: '8px' }}>
            Submit
          </Button>
        </Sider>
      </Layout>
    </Layout>
  </Form>
  
  );
};

export default EmailCheckboxList;
