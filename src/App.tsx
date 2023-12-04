// import { Create } from "./routes/root/create/Create";
// import { Home } from "./routes/root/home/Home";

// function App() {
//   const d = getDb();
//   const [user] = useAuthState(getAppAuth());

//   const messagesRef = collection(d, "messages");
//   const q = query(messagesRef, limit(25));

//   const [data] = useCollectionData(q);

//   // const asdf = data[0];
//   console.log("what is this", data);

//   const auth = getAppAuth();
//   const currentUser = auth.currentUser;
//   const json = JSON.stringify(currentUser, null, 2);

//   return (
//     <BrowserRouter>
//       <main>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/"></Link>
//             </li>
//             <li>
//               <Link to="/create"></Link>
//             </li>
//           </ul>
//         </nav>
//         <h1>hi.</h1>
//         <SignOut />
//         <section>{user ? <div>you are signed in</div> : <SignIn />}</section>
//         <pre>
//           <code>{json}</code>
//         </pre>
//         <Switch>
//           <Route path="/" Component={Home}></Route>
//           <Route path="/create" Component={Create}></Route>
//         </Switch>
//       </main>
//     </BrowserRouter>
//   );
// }
// export default App;
