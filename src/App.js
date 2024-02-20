import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./App.css";
import CalendarApp from "./Calendar";
import { month, publicHolidaysInd, returnPHCountry } from "./constants";
import { useEffect, useState } from "react";
import {
    getCountry,
    getMonthData,
    resetData,
    saveCountry,
    saveData,
} from "./db";
import { Nav } from "react-bootstrap";

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function isWeekday(year, month, day) {
    let returnday = new Date(year, month, day).getDay();
    return returnday !== 0 && returnday !== 6;
}

function getCurrentWorkingDays(month, year, country) {
    let days = daysInMonth(month, year);
    let weekdays = 0;
    for (var i = 0; i < days; i++) {
        if (isWeekday(year, month, i + 1)) weekdays++;
    }

    return weekdays - publicHolidays(month, country);
}

function publicHolidays(month, country) {
    let ph = returnPHCountry(country);
    return ph[month].length;
}

const returnWFODays = (days) => Math.ceil(days * 0.5);

function App() {
    const [dateObj, setDateObj] = useState(new Date());
    const [presentDates, setPresentDates] = useState([]);
    const [wfoMaster, setWfoMaster] = useState(0);
    // let wfoMaster = getCurrentWorkingDays(
    //     dateObj.getMonth(),
    //     dateObj.getFullYear(),
    //     "0"
    // );
    const [wfoDays, setWfoDays] = useState("");
    const [remDays, setRemDays] = useState("");
    const [leaves, setLeaves] = useState("");
    const [country, setCountry] = useState("0");

    useEffect(() => {
        let country = getCountry();
        if (country) {
            setCountry(country);
            setWfoMaster(
                getCurrentWorkingDays(
                    dateObj.getMonth(),
                    dateObj.getFullYear(),
                    country
                )
            );
        } else {
            setWfoMaster(
                getCurrentWorkingDays(
                    dateObj.getMonth(),
                    dateObj.getFullYear(),
                    "0"
                )
            );
        }
        console.log("con");
    }, [country]);

    const createData = () => {
        let data = {};
        data.month = `${month[dateObj.getMonth()]}${dateObj.getFullYear()}`;
        data.leaves = leaves;
        data.presentDates = presentDates;
        saveData(data);
        alert("Data Saved Successfully");
    };

    useEffect(() => {
        let data = getMonthData(
            `${month[dateObj.getMonth()]}${dateObj.getFullYear()}`
        );
        if (data) {
            setLeaves(data.leaves);
        }
    }, []);

    useEffect(() => {
        const calcRemDays = wfoDays - presentDates.length;
        setRemDays(calcRemDays < 0 ? 0 : calcRemDays);
    }, [presentDates, wfoDays]);

    useEffect(() => {
        const leavesTaken = parseInt(leaves);
        if (leavesTaken >= 0) {
            let officeDays = returnWFODays(wfoMaster - leavesTaken);
            setWfoDays(officeDays >= 0 ? officeDays : 0);
        } else {
            setWfoDays(returnWFODays(wfoMaster));
        }
    }, [leaves, wfoMaster]);

    const resetMothData = (monthDate) => {
        console.log(monthDate);
        setDateObj(monthDate);
    };

    useEffect(() => {
        let wfoMasterNew = getCurrentWorkingDays(
            dateObj.getMonth(),
            dateObj.getFullYear(),
            country
        );
        setWfoMaster(wfoMasterNew);
        setWfoDays(returnWFODays(wfoMaster));
    }, [dateObj]);

    const attendancePercent = parseInt(
        (parseInt(presentDates.length) / parseInt(wfoMaster - leaves)) * 100
    );

    const resetAllData = () => {
        let text = "Are you sure?";
        if (window.confirm(text) == true) {
            resetData();
            window.location.reload();
        } else {
            return;
        }
    };

    const savePHCountry = (country) => {
        setCountry(country);
        saveCountry(country);
        let countryText = "";
        switch (country) {
            case "0":
                countryText = "IND";
                break;
            case "1":
                countryText = "AUS-VIC";
                break;
            case "2":
                countryText = "AUS-NSW";
                break;
            default:
                countryText = "IND";
                break;
        }
        alert(`Country set as ${countryText}`);
    };

    return (
        <>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#">Attendance Calc</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Form.Group as={Row} className="">
                            <Col sm="ms-auto">
                                <button
                                    style={{ color: "#dee2e6" }}
                                    className="btn"
                                    onClick={resetAllData}
                                >
                                    Reset all data
                                </button>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="">
                            <Form.Label
                                column
                                className="ps-4"
                                xs="6"
                                md="auto"
                            >
                                <span style={{ color: "#dee2e6" }}>
                                    Country
                                </span>
                            </Form.Label>
                            <Col xs="auto" md="auto" className="ms-auto">
                                <Form.Select
                                    aria-label="country"
                                    value={country}
                                    onChange={(e) =>
                                        savePHCountry(e.target.value)
                                    }
                                >
                                    <option value="0" selected>
                                        IND
                                    </option>
                                    <option value="1">AUS - VIC</option>
                                    <option value="2">AUS - NSW</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Row>
                    <Col xs={6}>
                        <Form.Group className="mb-3 mt-3">
                            <Form.Label>
                                {month[dateObj.getMonth()]} Leaves
                            </Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                onChange={(e) => setLeaves(e.target.value)}
                                value={leaves}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3 mt-3">
                            <Form.Label>
                                {month[dateObj.getMonth()]} Working Days
                            </Form.Label>
                            <h1 class="display-4 fw-bold">{wfoMaster}</h1>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>WFO Days</Form.Label>
                            <h1 class="display-4 fw-bold">{wfoDays}</h1>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Present Days</Form.Label>
                            <h1 class="display-4 fw-bold">
                                {presentDates.length}
                            </h1>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Remaining Days</Form.Label>
                            <h1 class="display-4 fw-bold">{remDays}</h1>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Attendance %</Form.Label>
                            <h1 class="display-4 fw-bold">
                                {attendancePercent}%
                            </h1>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Select present days</Form.Label>
                            <CalendarApp
                                setPresentDates={setPresentDates}
                                resetMothData={resetMothData}
                                presentDates={presentDates}
                                dateObj={dateObj}
                                setLeaves={setLeaves}
                                country={country}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col className="mb-2">
                        <Button
                            variant="primary"
                            className="w-100"
                            onClick={createData}
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col className="mb-5">
                        <small class="text-body-secondary">
                            ** All data are stored in browsers localstorage, no
                            Server no Db.
                            <br />
                            ** Public holidays are based on country selection
                            from menu. default country is <b>India</b>
                        </small>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
