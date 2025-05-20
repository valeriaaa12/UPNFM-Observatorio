
export default function Boletines() {
  return (
    <>
       <div>
        <h2>Boletines</h2>
        <div className="card" style={{width: '18rem'}}>
          <img src="/images/boletin 1.png" 
               className="card-img-top" 
               alt="..." 
               width="100" 
               height="300"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <a href="/Boletin_1_Observatorio_educativo_UPNFM.pdf" className="btn btn-primary">Go somewhere</a>
            <a href="#" className="btn btn-primary">texto 2</a>
          </div>
        </div>
       </div>
    </>
    );
};