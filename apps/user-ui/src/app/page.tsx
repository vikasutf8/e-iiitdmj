export default function Index() {


 const temp= {
    "a0Gbf000000cFcsEAE": "Tim Horton's",
    "a0Gbf000000cFcKEAU": "Kroger",
    "a0Gbf000000cFcAEAU": "Walmart",
    "a0Gbf000000cFc9EAE": "Simple Truth",
    "a0Gbf000000cFWsEAM": "Compliments",
    "a0Gbf000000cFWpEAM": "Sobey's",
    "a0Gbf000000cFO9EAM": "Western Family",
    "a0Gbf000000cFKIEA2": "Sealtest",
    "a0Gbf000000cFKAEA2": "Agropur",
    "a0Gbf000000cFEbEAM": "No Name",
    "a0Gbf000000cExPEAU": "Nestle",
    "a0Gbf000000cExOEAU": "Great Value",
    }

    // show dispalcy key and values
  return (
    <>
    <div className="h-[200vh]">
        Object.entires(temp).map((key,item)=>(
             <div key={key}>{key} - {item}</div>
             
        ))
    </div>
    </>
  );
}
