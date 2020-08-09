import React,{useEffect,useState} from 'react';
import {Link, useParams} from 'react-router-dom';

const Followers  = ()=>{
    const [data,setData] = useState(null);
    const {userid} = useParams();

    useEffect(()=>{
        fetch(`/followers/${userid}`,{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
           setData(result.user);
         });
    },[]);

    return(
        <>
        {data ?
            <div className="home">
            {
                data.followers.map(item=>{
                    return(
                        <div className="card block" key={item._id}>
                            <h5 style={{padding:"8px"}}>
                                <img style={{width:"40px",height:"40px",borderRadius:"25px", marginRight:"5px", marginBottom:"-3px"}}
                                src={item.pic} alt={item.name}/>                 
                                <Link to={"/profile/"+item._id}>
                                    {item.name}   
                                </Link>
                            </h5>
                        </div>
                    )
                })
            }
            </div>
        :
            <h2>Loading...</h2>
        }
        </>
    )
};        

export default Followers;