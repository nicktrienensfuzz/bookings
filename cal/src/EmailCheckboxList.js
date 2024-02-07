import React, { useState,useEffect } from 'react';
// import { Form, Button } from 'react-bootstrap';
import { Checkbox, Button, Form, Typography, Flex, DatePicker, Layout } from 'antd';
import axios from 'axios';
import type { CheckboxProps } from 'antd';


const { Text, Title } = Typography;
const { Header, Sider, Content } = Layout;

const EmailCheckboxList = ({ selectedDateRange , updatedEvents}) => {
  const emails = [
    "camilo.alvarez@monstar-lab.com",
    "cesar.aguilar@monstar-lab.com",
    "juliana.loaiza@monstar-lab.com",
    "luis.ruiz@monstar-lab.com",
    "matthew.knuti@monstar-lab.com",
    "nick.trienens@monstar-lab.com",
  ];

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
const emailColorMap = {};

emails.forEach((email, index) => {
  emailColorMap[email] = colors[index % colors.length];
});

  const [selectedEmails, setSelectedEmails] = useState([
    "nick.trienens@monstar-lab.com",
    "matthew.knuti@monstar-lab.com"
  ]);

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

useEffect(() => {
  handleSubmit();
}, []);

  const convertEvents = (cals) => {
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
                  colorEvento: emailColorMap[email] //colors[eventIndex % colors.length] // Cycle through the colors
              });
          });
          eventIndex++;
      });
      return convertedEvents;
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/calendar/6598b4acd3a33c6d27a1b395`, {
        selectedEmails: selectedEmails.sort(),
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
 
        <Checkbox.Group style={{ width: '100%' }} defaultValue={selectedEmails} onChange={setSelectedEmails}>
          <Flex align="start" wrap="wrap" gap="small">
            {emails.map((email, index) => (
              <Checkbox
                value={email}
                key={index}
                checked={selectedEmails.includes(email) || true} // Add checked state
              >
                <div style={{ backgroundColor: emailColorMap[email] , width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block', marginLeft: '2px', marginRight: '4px', paddingTop: '4px' }}></div>
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
