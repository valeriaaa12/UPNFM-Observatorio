import Card from 'react-bootstrap/Card';

interface ImgParams {
  image: string;
  text: string;
}

export default function ImgOverlay({ image, text }: ImgParams) {
  return (
    <Card className="bg-dark text-white no-border-rounded">
      <Card.Img src={image} alt="Card image" className='imageContainer2' />
      <Card.ImgOverlay className='darkOverlay'>
        <Card.Title className='bigTitle2 fw-bold font text-bottom-left'>{text}</Card.Title>
      </Card.ImgOverlay>
    </Card>
  );
}