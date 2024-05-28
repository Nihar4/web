import React, { useEffect, useState } from "react";
import ServerRequest from "../utils/ServerRequest";

const Sample = () => {
    const [data,setData] = useState();
    const id = 171498877736;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ServerRequest({
          method: "get",
          URL: `/strategy/insertdldataEureka?id=${id}`,
        });

        if (data.server_error) {
          alert("error");
        }

        if (data.error) {
          alert("error1");
        }

        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        // throw error;
      }
    };

    fetchData().then((result) => {
        setData(result.data);
    }).catch((error) => {
        console.error("Error setting data:", error);
    });

  }, []);
//   console.log(data);

  return (
    <div>
        <table>
            <thead>
                <tr>
                    <th style={{padding:"5px"}}>risk</th>
                    <th style={{padding:"5px"}}>return</th>
                    {data && data[0][0].map((item,index)=>(
                        <th key={index} style={{padding:"5px"}}>{index}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data && data.map((array,index)=> (
                    <tr key={index}>
                        <td style={{padding:"5px"}}>{array[2].toFixed(4)}</td>
                        <td style={{padding:"5px"}}>{array[1].toFixed(4)}</td>

                        {array[0].map((value,arrayIdx)=> (
                            <td key={arrayIdx} style={{padding:"5px"}}>{value.toFixed(4)}</td>
                        ))}

                    </tr>
                ))
                }
            </tbody>
    {/* {data &&  data.map((item, index) => (

    ))} */}
    </table>
</div>
  );
};

export default Sample;
