import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import { Toaster } from "react-hot-toast";
import AddSegment from "./pages/AddSegment";
import AddSubscriber from "./pages/AddSubscriber";
import AddSubscriberCSV from "./pages/AddSubscriberCSV";
import Broadcast from "./pages/Broadcast";
import BroadcastDetail from "./pages/BroadcastDetail";
import ChangePassword from "./pages/ChangePassword";
import Completed from "./pages/Completed";
import CreateTag from "./pages/CreateTag";
import Dashboard from "./pages/Dashboard";
import Draft from "./pages/Draft";
import EditBroadcast from "./pages/EditBroadcast";
import EditSegment from "./pages/EditSegment";
import EditSubscriber from "./pages/EditSubscriber";
import EditTag from "./pages/EditTag";
import Help from "./pages/Help";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ManageSubscriber from "./pages/ManageSubscriber";
import NewBroadcast from "./pages/NewBroadcast";
import OTP from "./pages/OTP";
import Profile from "./pages/Profile";
import Queued from "./pages/Queued";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Subscriber from "./pages/Subscriber";
import Unsubscribed from "./pages/Unsubscribed";
import ViewSegment from "./pages/ViewSegment";
import ViewTag from "./pages/ViewTag";
import AdminRoutes from "./protected/AdminRoutes";
import UserRoutes from "./protected/UserRoutes";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Router>
      <Toaster />
      <Routes>
        {user ? (
          <Route path="/" element={<Dashboard />} />
        ) : (
          <>
            <Route path="/" element={<Index />} />
          </>
        )}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/otp" element={<OTP />} />
        <Route
          path="/unsubscribe/:userId/:subscriberId"
          element={<Unsubscribed />}
        />

        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<h1>Hello Admin</h1>} />
        </Route>

        <Route element={<UserRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscriber" element={<Subscriber />} />
          <Route path="/broadcast" element={<Broadcast />} />
          <Route path="/editProfile/:id" element={<Profile />} />
          <Route path="/changePassword/:id" element={<ChangePassword />} />
          <Route path="/addSubscriber" element={<AddSubscriber />} />
          <Route path="/editSubscriber" element={<ManageSubscriber />} />
          <Route
            path="/editSubscriber/details/:id"
            element={<EditSubscriber />}
          />
          <Route path="/createTag" element={<CreateTag />} />
          <Route path="/viewTag" element={<ViewTag />} />
          <Route path="/createSegment" element={<AddSegment />} />
          <Route path="/viewSegment" element={<ViewSegment />} />
          <Route path="/editTag/:id" element={<EditTag />} />
          <Route path="/editSegment/:id" element={<EditSegment />} />
          <Route path="/newBroadcast" element={<NewBroadcast />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/queued" element={<Queued />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/editBroadcast/:id" element={<EditBroadcast />} />
          <Route path="/addSubscriber/CSV" element={<AddSubscriberCSV />} />
          <Route path="/broadcastDetail/:id" element={<BroadcastDetail />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
