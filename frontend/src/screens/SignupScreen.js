import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import { Store } from '../Store';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('¡Las contraseñas no son iguales, verifícalas!'); //Valida que los pass sean iguales antes de registrar
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:5000/signup.php', {
        name,
        email,
        password,
      });
      console.log(data);
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data)); //Guarda la info del usuario en el localStorage
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err)); //Jala el error directo de php
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
        <title>Registro</title>
      </Helmet>
      <h1 classname="my-3">Registrarse</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group classname="mb-3" controlId="name">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control required onChange={(e) => setName(e.target.value)} />
        </Form.Group>

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
        <Form.Group classname="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div classname="mb-3">
          <Button type="submit">¡Registrarse!</Button>
        </div>
        <div classname="mb-3">
          ¿Ya tienes una cuenta?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Iniciar Sesión</Link>
        </div>
      </Form>
    </Container>
  );
}
