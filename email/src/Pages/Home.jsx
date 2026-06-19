import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";
import './Home.css'

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ color: [] }],
    ["clean"],
  ],
};

const Home = () => {

    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const currentUser = localStorage.getItem('email')
    const currentUserId = localStorage.getItem('userId')

    console.log(to,subject,body)

    const submitHandler = async(e) => {
        e.preventDefault();
        const receiverKey = to.replace(/\./g, ',');
        const senderKey = currentUser.replace(/\./g, ',');

        try{
            const response = await fetch(`https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/user/${senderKey}/sent.json`,{
                method : 'POST',
                body : JSON.stringify({
                    from : currentUser,
                    to : to,
                    subject : subject,
                    body : body,
                    createdAt :  Date.now(),
                }),
                headers : {
                    'Content-Type' : 'application/json'
                }
            })

            const responseInbox = await fetch(`https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/${receiverKey}/receive/inbox.json`,{
                method : 'POST',
                body : JSON.stringify({
                    from : currentUser,
                    to : to,
                    subject : subject,
                    body : body,
                    readStatus : false,
                }),
                headers : {
                    'Content-Type' : 'application/json'
                }
            })

            const data = await response.json();
            const inboxData = await responseInbox.json();
            
            if(!response.ok){
                throw new Error('Something went wrong...')
            }

            if(!responseInbox.ok){
                throw new Error('Something went wrong...')
            }

            console.log(data);
            console.log(inboxData);
        }catch(err){
            console.log(err)
        }

    }


    return (
        <div className="compose">
            <input type="email" placeholder="from" value={`From : ${currentUser}`}/>

            <input type="email" placeholder="Recipients" onChange={(e) => setTo(e.currentTarget.value)}/>

            <input type="text" placeholder="Subject" onChange={(e) => setSubject(e.currentTarget.value)}/>

            <div className="editor-wrapper">
                <ReactQuill
                    theme="snow"
                    value={body}
                    onChange={setBody}
                    style={{ height: "400px" }}
                    modules={modules}
                    
                />
            </div>

            <div className="mail-footer">
                <button className="send-btn" type="button" onClick={submitHandler}>Send</button>
            </div>
        </div>
    )
}

export default Home;