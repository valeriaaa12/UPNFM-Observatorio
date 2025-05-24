import Card from 'react-bootstrap/Card';

type InfoCardParams = {
  title: string;
  body: string;
  img: string;
}

export default function InfoCard({ title, body, img }: InfoCardParams) {
  return (
    <>
      <Card className="cardShadow mb-5" style={{ width: '20rem', height: '20rem' }}>
        <Card.Img variant="top" className="imgBorder" style={{ height: '50%' }} src={img} />
        <Card.Body>
          <b><Card.Title className="textColor">{title}</Card.Title></b>
          <Card.Text className="textColor">
            {body}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}