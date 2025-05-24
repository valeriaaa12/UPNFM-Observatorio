import Card from 'react-bootstrap/Card';

interface ImgParams {
  image: string;
  text: string;
  center?: boolean;
  bottom?: boolean;
}

export default function ImgOverlay({ image, text, center, bottom }: ImgParams) {
  return (
    <>
      <Card className="bg-dark text-white no-border-rounded">
        <Card.Img src={image} alt="Card image" className='imageContainer' />
        <Card.ImgOverlay className='overlay'>
          {bottom && (
            <Card.Title className='bigTitle2 fw-bold font text-bottom-left'>{text}</Card.Title>
          )}
          {center && (
            <Card.Title className='bigTitle fw-bold font'>{text}</Card.Title>
          )}
        </Card.ImgOverlay>
      </Card>
      <div className="orange" style={{ height: "0.5rem" }} />
    </>
  );
}