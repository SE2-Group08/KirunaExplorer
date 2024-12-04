import { Container, Navbar } from 'react-bootstrap';
import dayjs from 'dayjs';

export default function Footer() {
    const currentYear = dayjs().year();

    return (
        <Navbar bg='secondary' fixed="bottom">
            <Container fluid className="px-3">
                <Navbar.Text>
                    {currentYear} - Kiruna Explorer licensed under CC BY SA.
                </Navbar.Text>
            </Container>
        </Navbar>
    );
}
