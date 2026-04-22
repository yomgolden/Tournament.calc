// firebase.js — All Firebase setup and database read/write helpers
// 🔧 REPLACE the firebaseConfig below with your own from Firebase Console

const firebaseConfig = {
apiKey: “AIzaSyBl7sciwMVSVFVj9wfpOCZ9t8yvBjaQwsE”,
authDomain: “tournament-f1015.firebaseapp.com”,
projectId: “tournament-f1015”,
storageBucket: “tournament-f1015.firebasestorage.app”,
messagingSenderId: “649492665434”,
appId: “1:649492665434:web:ad74c25d85be57504eb463”
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── Collection references ──
const teamsCol    = db.collection(“teams”);
const matchesCol  = db.collection(“matches”);
const rulesCol    = db.collection(“rules”);

// ── Teams ──
async function dbGetTeams() {
const snap = await teamsCol.orderBy(“createdAt”).get();
return snap.docs.map(d => ({ id: d.id, …d.data() }));
}

async function dbAddTeam(team) {
return await teamsCol.add({ …team, createdAt: Date.now() });
}

async function dbDeleteTeam(id) {
return await teamsCol.doc(id).delete();
}

// ── Matches ──
async function dbSaveMatch(matchData) {
return await matchesCol.add({ …matchData, savedAt: Date.now() });
}

async function dbGetMatches() {
const snap = await matchesCol.orderBy(“savedAt”).get();
return snap.docs.map(d => ({ id: d.id, …d.data() }));
}

async function dbDeleteAllMatches() {
const snap = await matchesCol.get();
const batch = db.batch();
snap.docs.forEach(d => batch.delete(d.ref));
return await batch.commit();
}

// ── Rules ──
async function dbGetRules() {
const doc = await rulesCol.doc(“config”).get();
if (doc.exists) return doc.data();
// Default rules
return {
killPoints: 1,
placements: [
{ position: 1, points: 15 },
{ position: 2, points: 12 },
{ position: 3, points: 10 },
{ position: 4, points: 8 },
{ position: 5, points: 6 },
]
};
}

async function dbSaveRules(rules) {
return await rulesCol.doc(“config”).set(rules);
}
