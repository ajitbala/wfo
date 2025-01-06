import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { updateVersion } from "./constants";

export default function UpdatesModal(props) {
    const [modalShow, setModalShow] = useState(props.show);
    useEffect(() => {
        if (modalShow) {
            localStorage.setItem("updateVersion", updateVersion);
        }
    }, [modalShow]);

    return (
        <Modal
            show={modalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setModalShow(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Updates
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    <li>
                        2025 Holiday list for India, VIC and NSW has been
                        updated.
                    </li>
                </ul>
            </Modal.Body>
        </Modal>
    );
}

// function App() {
//     const [modalShow, setModalShow] = React.useState(false);

//     return (
//         <>
//             <Button variant="primary" onClick={() => setModalShow(true)}>
//                 Launch vertically centered modal
//             </Button>

//             <MyVerticallyCenteredModal
//                 show={modalShow}
//                 onHide={() => setModalShow(false)}
//             />
//         </>
//     );
// }
