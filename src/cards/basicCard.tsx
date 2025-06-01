import Card from 'react-bootstrap/Card';

type CardParams = {
  title: string;
  body: string;
  img: string;
}

export default function InfoCard({ title, body, img }: CardParams) {
  return (
    <Card className="info-card cardShadow hover-effect">
      <Card.Img variant="top" className="info-card-img" src={img} />
      <Card.Body className="info-card-body">
        <Card.Title className="textColor">{title}</Card.Title>
        <Card.Text className="info-card-text textColor">
          {body}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}