import { useEffect, useState } from 'react';
import './App.css';
import { addDoc,  getDocs, collection, updateDoc, doc, deleteDoc} from 'firebase/firestore'
import { database } from './config/firebase';

function App() {

  //username state
  const [username,setUserName]=useState("");
  const [userage,setUserage]=useState(0);

  //state (type: array) to store info about the users
  const [users,setUsers]=useState([]);

  //Reference to our collection
  const userRef= collection(database,"users")

  //Function to add new user
  const addUser= async ()=>{
    //Adding document to the collection with individual fields
    await addDoc(userRef,{
      userName: username,
      userAge: Number(userage),
    })
  }

  // Async function to get data from database (Read userData)
  const getUsers = async()=>{
    //To get actual data from our database
    const userData= await getDocs(userRef);

    setUsers(userData.docs.map((doc)=>
    ({...doc.data(), 
      id: doc.id})
    ))
  }

  //Function to update user's age in the database by getting spec id of the document and the previous state of age
  const updateUserAge= async(id,age)=>{
    //Getting an instance of our original doc
    const newUserDoc=doc(database,"users",id)
    //Updating specific fields in the document
    const newFields={
      userAge: age + 1,
    }
    //Updating the database
    await updateDoc(newUserDoc,newFields)
  }

  //Function to delete UserData from the database
  const deleteUser= async(id)=>{
    //Getting id of the document(/user) we want to delete
    const deleteUserDoc=doc(database,"users",id)
    //Deleting the doc from the collection by its id
    await deleteDoc(deleteUserDoc);
  }

  useEffect(()=> {
    getUsers();
  }, [])

  return (
    <div className="App">
    
    <input 
    type="text" 
    placeholder="Enter user's name"
    onChange={(event)=> setUserName(event.target.value)} 
    />
    <input 
    type="number" 
    placeholder="Enter users age"
    onChange={(event)=> setUserage(event.target.value)}
    />  
    <button onClick={addUser}>Create New User</button>
    
    
    {/* Looping through users array */}
      {users.map((user) => {
        return (
          <div>
            <h1>Name: {user.userName}</h1>
            <h2>Age: {user.userAge}</h2>
            <button onClick={()=>updateUserAge(user.id, user.userAge)}>Increase age by 1</button>
            <button onClick={()=>deleteUser(user.id)}>Delete User</button>
          </div>
        )
      })}
    </div>
  );
}

export default App;
