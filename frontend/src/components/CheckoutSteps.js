import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Este componente muestra la barra de estado cuando se va a procesar la orden
export default function CheckoutSteps(props) {
  //Condicionales para ver si hay pasos activos con props.step
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Inicia Sesión</Col>
      <Col className={props.step2 ? 'active' : ''}>Envío</Col>
      <Col className={props.step3 ? 'active' : ''}>Pago</Col>
      <Col className={props.step4 ? 'active' : ''}>Confirma Orden</Col>
    </Row>
  );
}
