import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Axios } from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { Store } from '../Store';
import { useEffect } from 'react';

export default function SigningScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data)); //Guarda la info del usuario en el localStorage
      navigate(redirect || '/');
    } catch (err) {
      alert('Email o contraseña invalidos');
    }
  };

  useEffect(() => {
    if (userInfo) {
      //si ya esta logueado, redirige
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container classname="small-container">
      <Helmet>
        <title>Iniciar Sesión</title>
      </Helmet>
      <h1 classname="my-3">Iniciar Sesión</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group classname="mb-3" controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group classname="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div classname="mb-3">
          <Button type="submit">Iniciar Sesión</Button>
        </div>
        <div classname="mb-3">
          ¿No está registrado?{' '}
          <Link to={`signup?redirect=${redirect}`}>Crear una cuenta nueva</Link>
        </div>
      </Form>
    </Container>
  );
}
