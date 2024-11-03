// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Anonymous login for user anonymity
auth.signInAnonymously().catch((error) => {
    console.error("Firebase auth error:", error);
});

// Function to add ticket for sale
document.getElementById("ticketForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const ticket = {
        eventName: document.getElementById("eventName").value,
        date: document.getElementById("date").value,
        location: document.getElementById("location").value,
        askPrice: parseFloat(document.getElementById("askPrice").value),
        userId: auth.currentUser.uid
    };
    db.collection("tickets").add(ticket).then(() => {
        alert("Ticket posted successfully!");
        document.getElementById("ticketForm").reset();
    });
});

// Function to add bid request
document.getElementById("bidForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const bid = {
        eventName: document.getElementById("bidEventName").value,
        bidPrice: parseFloat(document.getElementById("bidPrice").value),
        userId: auth.currentUser.uid
    };
    db.collection("bids").add(bid).then(() => {
        alert("Bid request posted successfully!");
        document.getElementById("bidForm").reset();
    });
});

// Matching bids and asks
db.collection("tickets").onSnapshot((snapshot) => {
    snapshot.docs.forEach((doc) => {
        const ticket = doc.data();
        db.collection("bids").where("eventName", "==", ticket.eventName)
          .where("bidPrice", ">=", ticket.askPrice).get()
          .then((bidsSnapshot) => {
              bidsSnapshot.docs.forEach((bidDoc) => {
                  const bid = bidDoc.data();
                  // Notify both users
                  sendNotification(bid.userId, `A match found for ${bid.eventName}!`);
                  sendNotification(ticket.userId, `Your ticket for ${ticket.eventName} matched a buyer!`);
                  // Further payment processing would go here
              });
          });
    });
});

// Function to send notifications
function sendNotification(userId, message) {
    const notification = { userId, message, timestamp: Date.now() };
    db.collection("notifications").add(notification);
}
