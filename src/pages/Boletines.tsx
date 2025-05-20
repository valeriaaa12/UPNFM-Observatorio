
export default function Boletines() {
  return (
    <>
       <div>
        <div className="card" style={{width: '18rem'}}>
          <embed 
            src="/Boletin_1_Observatorio_educativo_UPNFM.pdf" 
            type="application/pdf" 
            width="100%" 
            height="200px" 
          />
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
       </div>
    </>
    );
};