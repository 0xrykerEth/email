import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Mailbox.css";

function Mailbox() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [activeTab, setActiveTab] = useState("inbox");

  const currentUser = localStorage.getItem("email");
  const userKey = currentUser.replace(/\./g, ",");
  const sentKey = currentUser.replace(/\./g, ",");

  useEffect(() => {
    fetchInbox();
    fetchSent();
  }, []);

  useEffect(() => {
    fetchInbox();
    fetchSent();

    const interval = setInterval(() => {
        fetchInbox();
        fetchSent();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchInbox = async () => {
    try {
      const response = await fetch(
        `https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/${userKey}/receive/inbox.json`
      );

      const data = await response.json();

      const loadedInbox = [];

      for (const key in data) {
        loadedInbox.push({
          id: key,
          ...data[key],
        });
      }

      setInbox(loadedInbox.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMail = async(mailId) => {
        
    try{
         await fetch(`https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/user/${userKey}/sent/${mailId}.json`,{
        method: "DELETE",
      }
    );

    fetchInbox();
        
    }catch(error){
        console.log(error)
    }
  }

  const deleteoutBox = async(mailId) => {
        
    try{
         await fetch(`https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/user/${sentKey}/sent/${mailId}.json`,{
        method: "DELETE",
      }
    );

    fetchSent();
        
    }catch(error){
        console.log(error)
    }
  }

  const fetchSent = async () => {
    try {
      const response = await fetch(
        `https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/user/${userKey}/sent.json`
      );

      const data = await response.json();

      const loadedSent = [];

      for (const key in data) {
        loadedSent.push({
          id: key,
          ...data[key],
        });
      }

      setSent(loadedSent.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const markAsRead = async (mailId) => {
    try {
      await fetch(
        `https://login-signup-c5f9f-default-rtdb.asia-southeast1.firebasedatabase.app/${userKey}/receive/inbox/${mailId}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            readStatus: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchInbox();
    } catch (err) {
      console.log(err);
    }
  };

  const unreadCount = inbox.filter(
    (mail) => mail.readStatus === false
  ).length;

  return (
    <div className="mailbox">

      <aside className="sidebar">
        <h2>Mailbox</h2>

        <div
          className={`menu-item ${
            activeTab === "inbox" ? "active" : ""
          }`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
          <span>{unreadCount}</span>
        </div>

        <div
          className={`menu-item ${
            activeTab === "sent" ? "active" : ""
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </div>
        <Link to={'/Home'} className="mail-link">
            ✉ Compose
        </Link>
      </aside>

      <main className="mail-content">

        {activeTab === "inbox" && (
          <>
            <h2>Inbox</h2>

            {inbox.map((mail) => (
              <div
                key={mail.id}
                className={`mail-card ${
                  !mail.readStatus ? "unread" : ""
                }`}
                onClick={() => markAsRead(mail.id)}
              >
                <div className="mail-header">
                  <strong>{mail.from}</strong>
                </div>

                <h3>{mail.subject}</h3>

                <div
                  dangerouslySetInnerHTML={{
                    __html: mail.body,
                  }}
                />
                <button onClick={() => deleteMail(mail.id)}>Delete</button>
              </div>
            ))}
          </>
        )}

        {activeTab === "sent" && (
          <>
            <h2>Sent Mail</h2>

            {sent.map((mail) => (
              <div
                key={mail.id}
                className="mail-card"
              >
                <div className="mail-header">
                  <strong>To:</strong> {mail.to}
                </div>

                <h3>{mail.subject}</h3>

                {mail.createdAt && (
                  <p>
                    {new Date(
                      mail.createdAt
                    ).toLocaleString()}
                  </p>
                )}

                <div
                  dangerouslySetInnerHTML={{
                    __html: mail.body,
                  }}
                />
                <div>
                    <button onClick={() => deleteoutBox(mail.id)}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}

      </main>
    </div>
  );
}

export default Mailbox;