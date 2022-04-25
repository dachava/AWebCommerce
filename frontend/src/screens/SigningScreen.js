import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function SigningScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  return (
    <Container classname="small-container">
      <Helmet>
        <title>Iniciar Sesión</title>
      </Helmet>
      <h1 classname="my-3">Iniciar Sesión</h1>

      <Form>
        <Form.Group classname="mb-3" controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" required />
        </Form.Group>
        <Form.Group classname="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" required />
        </Form.Group>
        <div classname="mb-3">
          <Button type="submit">Iniciar Sesión></Button>
        </div>
        <div classname="mb-3">
          ¿No está registrado?{' '}
          <Link to={`signup?redirect=${redirect}`}>Crear una cuenta nueva</Link>
        </div>
      </Form>
    </Container>
  );
}
