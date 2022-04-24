import Spinner from 'react-bootstrap/Spinner';
//Muestra una animacion de carga en lugar de solo text
export default function LoadingBox() {
  return (
    <Spinner animation="border" role="statux">
      <span className="visually-hidden">Cargando...</span>
    </Spinner>
  );
}
