import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./App.css";
import CalendarApp from "./Calendar";
import {
    month,
    publicHolidaysInd,
    returnPHCountry,
    tootlTipText,
} from "./constants";
import { useEffect, useRef, useState } from "react";
import {
    getCountry,
    getMonthData,
    resetData,
    saveCountry,
    saveData,
} from "./db";
import { Nav, Overlay, Tooltip } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

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
    const [wfoDays, setWfoDays] = useState("");
    const [remDays, setRemDays] = useState("");
    const [leaves, setLeaves] = useState("");
    const [country, setCountry] = useState("0");
    const [percentReconcileToggle, setPercentReconcileToggle] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [percentageReconcile, setPercentageReconcile] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showToolTip, setShowToolTip] = useState(false);
    const [localDBData, setLocalDBData] = useState({});
    const targetToolTip = useRef(null);
    const loadCount = useRef(0);

    const handleClose = () => setShowModal(false);
    const handleShow = () => {
        setShowModal(true);
        setPercentageReconcile(percentage);
    };

    const fetchMonthData = () => {
        let data = getMonthData(
            `${month[dateObj.getMonth()]}${dateObj.getFullYear()}`
        );
        return data;
    };

    useEffect(() => {
        if (data) {
            setLeaves(data.leaves);
            setLocalDBData(data);
            // setPercentReconcileToggle(!!data.percentReconcileToggle);
        }
    }, []);

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
        console.log("conole");
    }, [country]);

    useEffect(() => {
        let wfoMasterNew = getCurrentWorkingDays(
            dateObj.getMonth(),

            dateObj.getFullYear(),
            country
        );
        setWfoMaster(wfoMasterNew);
    }, [dateObj]);

    useEffect(() => {
        const leavesTaken = parseInt(leaves);
        if (leavesTaken >= 0) {
            let officeDays = returnWFODays(wfoMaster - leavesTaken);
            setWfoDays(officeDays >= 0 ? officeDays : 0);
        } else {
            setWfoDays(returnWFODays(wfoMaster));
        }
    }, [leaves, wfoMaster]);

    useEffect(() => {
        if (percentReconcileToggle) {
            createData();
            setPercentReconcileToggle(false);
        }
        handleClose();
    }, [percentReconcileToggle]);

    useEffect(() => {
        const calcRemDays = wfoDays - presentDates.length;
        const attendancePercent = parseInt(
            (parseInt(presentDates.length) / parseInt(wfoMaster - leaves)) * 100
        );
        setRemDays(calcRemDays < 0 ? 0 : calcRemDays);
        if (!!localDBData.percentReconcileToggle && loadCount.current === 0) {
            setPercentage(parseInt(localDBData.percentReconcile));
            loadCount.current++;
        } else {
            setPercentage(attendancePercent);
        }
        //setPercentage(attendancePercent);
    }, [presentDates, wfoDays]);

    useEffect(() => {
        console.log("percent", localDBData.percentReconcile);
        if (!!localDBData.percentReconcileToggle) {
            setPercentage(localDBData.percentReconcile);
        }
    }, [localDBData]);

    const createData = () => {
        let data = {};
        data.month = `${month[dateObj.getMonth()]}${dateObj.getFullYear()}`;
        data.leaves = leaves;
        data.presentDates = presentDates;
        data.percentReconcile = percentReconcileToggle
            ? parseInt(percentageReconcile)
            : percentage;
        data.percentReconcileToggle = percentReconcileToggle;
        saveData(data);
        alert("Data Saved Successfully");
    };

    const resetMothData = (monthDate) => {
        console.log(monthDate);
        setDateObj(monthDate);
    };

    // const attendancePercent = parseInt(
    //     (parseInt(presentDates.length) / parseInt(wfoMaster - leaves)) * 100
    // );

    useEffect(() => {
        console.log("s", percentage);
    }, [percentage]);

    const resetAllData = () => {
        let text = "Are you sure?";
        if (window.confirm(text) === true) {
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

    const savePercentReconcile = () => {
        setPercentReconcileToggle(true);
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
                            <Form.Label>
                                Attendance %{" "}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-info-circle-fill ms-1"
                                    viewBox="0 0 16 16"
                                    onClick={() => setShowToolTip(!showToolTip)}
                                    ref={targetToolTip}
                                >
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                </svg>
                                <Overlay
                                    target={targetToolTip.current}
                                    show={showToolTip}
                                    placement="left"
                                >
                                    {(props) => (
                                        <Tooltip
                                            id="overlay-example"
                                            {...props}
                                        >
                                            {tootlTipText}
                                        </Tooltip>
                                    )}
                                </Overlay>
                            </Form.Label>
                            <div class="d-flex flex-row">
                                <h1
                                    className={
                                        localDBData.percentReconcileToggle
                                            ? "text-secondary display-4 fw-bold d-inline-flex"
                                            : "display-4 fw-bold d-inline-flex"
                                    }
                                >
                                    {percentage}%
                                </h1>
                                <h1 className="ms-3">
                                    <button
                                        className="btn"
                                        onClick={() => handleShow()}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-pencil-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                        </svg>
                                    </button>
                                </h1>
                            </div>
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
                            from menu till <b>2024</b>. default country is{" "}
                            <b>India</b>
                        </small>
                    </Col>
                </Row>
            </Container>
            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <Form.Label
                                htmlFor="percentage"
                                className="font-weight-bold"
                            >
                                <b>Reconcile attendance %</b>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="percentage"
                                min={0}
                                max={100}
                                onChange={(e) =>
                                    setPercentageReconcile(e.target.value)
                                }
                                value={percentageReconcile}
                                className="mb-2"
                            />
                        </Col>
                        <Col xs={12} className="d-flex justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                className="me-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={savePercentReconcile}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default App;
