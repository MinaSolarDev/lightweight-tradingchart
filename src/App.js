import React, { useEffect, useState } from "react";
import ChartView from "./components/ChartView";
import IntervalView from "./components/IntervalView";
import DatetimeView from "./components/DatetimeView";
import { Nav, Modal, ButtonToolbar, Button, Placeholder, List } from 'rsuite';
import BarLineChartIcon from '@rsuite/icons/BarLineChart';

import "./App.css";

function App() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = value => {
        setOpen(true);
      };
    const handleClose = () => setOpen(false);

    const indicators = {adx:'ADK', macd:'Macd rsi', mdi:'MDI', sma:'SMA'}

    const intervals = ['1M', '5M', '15M', '30M', '1H', '1D', '1W'];
    const [chatArray, setChatArray] = useState({
        chart1: {   
            startDate: "2022-05-01T00:00:00.000Z",
            endDate: "2022-11-01T23:59:59.000Z",
            resample: "1D",
            indicators: ['adx', 'macd']
        },
        chart2: {   
            startDate: "2022-11-01T00:00:00.000Z",
            endDate: "2022-11-01T23:59:59.000Z",
            resample: "1M",
            indicators: []
        },
        chart3: {   
            startDate: "2022-11-01T00:00:00.000Z",
            endDate: "2022-11-01T23:59:59.000Z",
            resample: "5M",
            indicators: []
        },
        chart4: {   
            startDate: "2022-11-01T00:00:00.000Z",
            endDate: "2022-11-01T23:59:59.000Z",
            resample: "10M",
            indicators: []
        },
        chart5: {   
            startDate: "2022-11-01T00:00:00.000Z",
            endDate: "2022-11-01T23:59:59.000Z",
            resample: "30M",
            indicators: []
        },
        chart6: {   
            startDate: "2021-11-01T00:00:00.000Z",
            endDate: "2022-12-01T23:59:59.000Z",
            resample: "1W",
            indicators: []
        },
    })
    const [activeChart, setActiveChart] = useState('');

    const selectIndicator = (item) => {
        let temp = chatArray
        temp[activeChart].indicators.includes(item) ? temp[activeChart].indicators.splice(temp[activeChart].indicators.indexOf(item), 1) : temp[activeChart].indicators.push(item)
        setChatArray({...temp})
    };

    return (
        <div className="App">
            <Nav>
                <ButtonToolbar>
                    <Button size="xs" onClick={() => handleOpen()} disabled={activeChart == '' ? true : false}>
                        <Nav.Item icon={<BarLineChartIcon />}>Indicators</Nav.Item>
                    </Button>
                </ButtonToolbar>
            </Nav>
            <div className="chart-group">
                {
                    Object.keys(chatArray).map((key, i) => (
                        <ChartView 
                            key= {i}
                            startDate={chatArray[key].startDate} 
                            endDate={chatArray[key].endDate} 
                            resample={chatArray[key].resample} 
                            active={activeChart} 
                            viewID={key} 
                            selectChart={setActiveChart} 
                            indicators={chatArray[key].indicators}
                        />
                    ))
                }
            </div>
            <div className="time-group">
                <IntervalView 
                    intervals={intervals} 
                    chartArray={chatArray} 
                    setChartArray={setChatArray} 
                    activeChart={activeChart}
                />
                { activeChart !== '' &&
                    <DatetimeView 
                        chartArray={chatArray} 
                        setChartArray={setChatArray} 
                        active={activeChart} 
                    />
                }
            </div>
            <Modal size={'xs'} open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Indicators</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <List size="sm">
                        {Object.keys(indicators).map((key, index) => (
                            <List.Item 
                                key={key} 
                                index={index} 
                                className={activeChart != '' && chatArray[activeChart].indicators.includes(key) ? "indicators selected" : "indicators"}
                                onClick={ () => selectIndicator(key)}
                            >
                                {indicators[key]}
                            </List.Item>
                        ))}
                    </List>
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} appearance="primary">
                        Ok
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
