import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";  
import Workouts from "./components/Workouts";
import AddWorkoutModal from "./components/AddWorkoutModal";

const Navbar = () => (
  <nav className="navbar">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/workouts">Workouts</a></li>
      <li><a href="/profile">Profile</a></li>
    </ul>
  </nav>
);

const App = () => {
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [workouts, setWorkouts] = useState([]); 
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (token) {
        try {
          const response = await fetch("https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
           
            if (Array.isArray(data)) {
              setWorkouts(data);
            } else {
              console.error("Expected an array, but received:", data);
            }
          } else {
            console.error("Failed to fetch workouts.");
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        } finally {
        setIsLoading(false); // Disable loading skeleton
        }
      }
    };

    fetchWorkouts();
  }, [token]);


  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setMessage("Login successful!");
  };

 
  const handleShowRegister = () => setShowRegister(true);

 
  const handleShowLogin = () => setShowRegister(false);

const handleWorkoutAdded = (newWorkoutResponse) => {
  console.log("Workout added response:", newWorkoutResponse); 
  

  const newWorkout = newWorkoutResponse.workout || newWorkoutResponse.data || newWorkoutResponse;

  setWorkouts((prevWorkouts) => {
    if (Array.isArray(prevWorkouts)) {
      return [...prevWorkouts, newWorkout];
    } else {
      console.error("Expected workouts to be an array, but it is not.");
      return [newWorkout]; 
    }
  });

  setMessage("Workout added successfully!");
  setShowAddWorkout(false); 
};

  return (
    <div>
    <Navbar />
      {token ? (
        <div>
          <p>Welcome! You are logged in.</p>
          <button onClick={() => setShowAddWorkout(true)}>Add Workout</button>

          <Workouts workouts={workouts} />

          {showAddWorkout && (
            <AddWorkoutModal token={token} onWorkoutAdded={handleWorkoutAdded} />
          )}
        </div>
      ) : (
        <div>
          {showRegister ? (
            <Register />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
          <div>
            <button onClick={handleShowLogin}>Already have an account? Login</button>
            <button onClick={handleShowRegister}>Don't have an account? Register</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

