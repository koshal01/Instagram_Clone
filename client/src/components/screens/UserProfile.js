import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams, Link} from 'react-router-dom';

const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null);    
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true);

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{     
            setProfile(result)
        })
    },[]);

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            });
            setShowFollow(false);
        });
    };

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+ localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}});
            localStorage.setItem("user",JSON.stringify(data));
            
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id );
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            });
            setShowFollow(true); 
        });
    };

    return (
        <>
        {userProfile ?
        <div style={{maxWidth:"620px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{display:"inline-grid"}}>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={userProfile.user.pic} alt={"Profile Pic"}/>
                    {showfollow
                    ?
                     <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        onClick={()=>followUser()}>
                            Follow
                     </button>
                    : 
                     <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        onClick={()=>unfollowUser()} >
                            UnFollow
                     </button>
                    }
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h6>{userProfile.user.email}</h6>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6><b>{userProfile.posts.length}</b> posts</h6>
                        <Link to={"/followers/"+userid}><h6><b>{userProfile.user.followers.length}</b> followers</h6></Link>
                        <Link to={"/following/"+userid}><h6><b>{userProfile.user.following.length}</b> following</h6></Link>
                    </div>
                </div>
            </div>
        
            <div className="gallery row">
            {
                userProfile.posts.map(item=>{
                    return(
                        <div className="column" key={item._id}>  
                            <Link to={"/post/"+userid} >
                                <img key={item._id} src={item.photo} alt={item.title} style={{width:"100%"}}/>
                            </Link>
                        </div>
                    )
                })
            }
           </div>
        </div>
        : 
         <h2>loading...!</h2>
        }   
    </>
    );
};

export default Profile;